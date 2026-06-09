const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: Parse request JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Helper: Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // --- API Routes ---

  // User Login
  if (pathname === '/api/login' && method === 'POST') {
    try {
      const { email, password } = await parseBody(req);
      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email and password are required' });
      }
      
      const user = db.authenticateUser(email, password);
      if (!user) {
        return sendJson(res, 401, { error: 'Invalid email or password' });
      }
      
      return sendJson(res, 200, { user });
    } catch (err) {
      return sendJson(res, 500, { error: 'Server error processing request' });
    }
  }

  // Fetch Flights schedule + Occupied seats
  if (pathname === '/api/flights' && method === 'GET') {
    const origin = parsedUrl.searchParams.get('origin');
    const destination = parsedUrl.searchParams.get('destination');
    const date = parsedUrl.searchParams.get('date');

    if (!origin || !destination || !date) {
      return sendJson(res, 400, { error: 'Missing parameters: origin, destination, and date are required' });
    }

    try {
      const flightsList = db.getFlights(origin, destination);
      
      // For each flight, retrieve seats reserved for this date
      const enrichedFlights = flightsList.map(flight => {
        const occupied = db.getReservedSeats(flight.id, date);
        return {
          ...flight,
          occupiedSeats: occupied
        };
      });

      return sendJson(res, 200, { flights: enrichedFlights });
    } catch (err) {
      console.error(err);
      return sendJson(res, 500, { error: 'Server error fetching flights' });
    }
  }

  // Create Booking
  if (pathname === '/api/bookings' && method === 'POST') {
    try {
      const bookingData = await parseBody(req);
      const {
        flightId, date, passengerName, passengerNid, passengerEmail,
        passengerPhone, seatNumber, seatCategory, pricePaid, bookingSpeed,
        loyaltyRedeemed, classType, userEmail
      } = bookingData;

      if (!flightId || !date || !passengerName || !passengerNid || !seatNumber || !pricePaid) {
        return sendJson(res, 400, { error: 'Missing required booking fields' });
      }

      // Create booking in database
      const bookingId = db.createBooking(bookingData);

      // Handle loyalty miles adjustments if logged in
      let updatedMiles = 0;
      if (userEmail) {
        // Calculate 10% BDT spent converted to miles
        const earnedMiles = Math.round(pricePaid * 0.1);
        updatedMiles = db.updateUserMiles(userEmail, loyaltyRedeemed || 0, earnedMiles);
      }

      return sendJson(res, 201, {
        success: true,
        bookingId,
        updatedMiles
      });
    } catch (err) {
      console.error(err);
      return sendJson(res, 500, { error: 'Server error creating booking' });
    }
  }

  // Fetch Booking History for User
  if (pathname === '/api/bookings' && method === 'GET') {
    const email = parsedUrl.searchParams.get('email');
    if (!email) {
      return sendJson(res, 400, { error: 'Email parameter is required' });
    }

    try {
      const userBookings = db.getUserBookings(email);
      return sendJson(res, 200, { bookings: userBookings });
    } catch (err) {
      return sendJson(res, 500, { error: 'Server error retrieving bookings' });
    }
  }


  // --- Static Files Routing ---
  
  let normalizedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(__dirname, normalizedPath);
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}\n`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
