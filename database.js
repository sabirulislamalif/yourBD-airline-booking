const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'delta_airline.db');
const db = new DatabaseSync(dbPath);

console.log(`Database initialized at: ${dbPath}`);

// Setup schemas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    nid TEXT,
    miles INTEGER DEFAULT 0,
    avatar TEXT,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS flights (
    id TEXT PRIMARY KEY,
    carrier TEXT NOT NULL,
    code TEXT NOT NULL,
    flightNo TEXT NOT NULL,
    departure TEXT NOT NULL,
    arrival TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price INTEGER NOT NULL,
    carrierColor TEXT,
    logo TEXT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flightId TEXT NOT NULL,
    date TEXT NOT NULL,
    passengerName TEXT NOT NULL,
    passengerNid TEXT NOT NULL,
    passengerEmail TEXT NOT NULL,
    passengerPhone TEXT NOT NULL,
    seatNumber TEXT NOT NULL,
    seatCategory TEXT NOT NULL,
    pricePaid INTEGER NOT NULL,
    bookingSpeed REAL NOT NULL,
    loyaltyRedeemed INTEGER DEFAULT 0,
    class TEXT NOT NULL,
    fasttrack INTEGER DEFAULT 0,
    baggage INTEGER DEFAULT 0,
    userEmail TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS seat_reservations (
    flightId TEXT NOT NULL,
    date TEXT NOT NULL,
    seatNumber TEXT NOT NULL,
    PRIMARY KEY (flightId, date, seatNumber)
  );
`);

// Seed default users if empty
const checkUsers = db.prepare('SELECT count(*) as count FROM users');
const userCountResult = checkUsers.get();

if (userCountResult.count === 0) {
  console.log('Seeding user database...');
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, phone, nid, miles, avatar, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertUser.run(
    'Tanvir Rahman', 
    'tanvir@biman.com', 
    '+880 1712-345678', 
    '1993261543883', 
    4500, 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80',
    'password'
  );

  insertUser.run(
    'Sadia Chowdhury', 
    'sadia.c@outlook.com', 
    '+880 1819-234567', 
    '1995261899124', 
    8200, 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80',
    'password'
  );
}

// Seed default flights schedule if empty
const checkFlights = db.prepare('SELECT count(*) as count FROM flights');
const flightCountResult = checkFlights.get();

if (flightCountResult.count === 0) {
  console.log('Seeding flights database...');
  const insertFlight = db.prepare(`
    INSERT INTO flights (id, carrier, code, flightNo, departure, arrival, duration, price, carrierColor, logo, origin, destination)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const origins = ['DAC', 'CGP', 'CXB', 'ZYL', 'JSR', 'SPD'];
  const destinations = [
    'DAC', 'CGP', 'CXB', 'ZYL', 'JSR', 'SPD',
    'CCU', 'DXB', 'LHR', 'SIN', 'BKK', 'KUL'
  ];

  const carriers = [
    { name: 'Biman Bangladesh Airlines', code: 'BG', color: 'text-green', logo: 'fa-paper-plane' },
    { name: 'US-Bangla Airlines', code: 'BS', color: 'text-cyan', logo: 'fa-plane' },
    { name: 'Novoair', code: 'VQ', color: 'text-purple', logo: 'fa-plane-departure' },
    { name: 'Air Astra', code: '2A', color: 'text-pink', logo: 'fa-jet-fighter' }
  ];

  let flightIdCounter = 100;

  // Let's seed direct flights for all origin -> destination combinations
  origins.forEach(orig => {
    destinations.forEach(dest => {
      if (orig === dest) return;

      const isInternational = ['CCU', 'DXB', 'LHR', 'SIN', 'BKK', 'KUL'].includes(dest);
      
      // Determine duration
      let durationMinutes = 45;
      if (isInternational) {
        if (dest === 'CCU') durationMinutes = 45;
        else if (dest === 'LHR') durationMinutes = 680;
        else if (dest === 'DXB') durationMinutes = 310;
        else durationMinutes = 240; // SIN, BKK, KUL
      } else {
        // domestic variance
        if ((orig === 'DAC' && dest === 'CXB') || (orig === 'CXB' && dest === 'DAC')) durationMinutes = 60;
        else if ((orig === 'DAC' && dest === 'CGP') || (orig === 'CGP' && dest === 'DAC')) durationMinutes = 50;
        else durationMinutes = 45;
      }

      // Base Ticket Price
      let basePrice = 4500;
      if (isInternational) {
        if (dest === 'CCU') basePrice = 12500;
        else if (dest === 'LHR') basePrice = 88000;
        else if (dest === 'DXB') basePrice = 45000;
        else basePrice = 32000;
      } else {
        basePrice = 4200;
      }

      // Create 3 flights for each valid route at different times
      for (let index = 0; index < 3; index++) {
        const carrier = carriers[(flightIdCounter) % carriers.length];
        
        // Start hours 8:00, 13:00, 18:00
        const startHour = 8 + (index * 5);
        const depTime = `${startHour.toString().padStart(2, '0')}:${(15 * index).toString().padStart(2, '0')}`;
        
        const depMinutesTotal = startHour * 60 + (15 * index);
        const arrMinutesTotal = depMinutesTotal + durationMinutes;
        const arrHour = Math.floor(arrMinutesTotal / 60) % 24;
        const arrMin = arrMinutesTotal % 60;
        const arrTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

        const fPrice = basePrice + (index * 500);
        const flightNo = `${carrier.code}-${100 + index * 33 + (flightIdCounter % 50)}`;
        const fId = `${flightNo}-${orig}-${dest}`;

        insertFlight.run(
          fId,
          carrier.name,
          carrier.code,
          flightNo,
          depTime,
          arrTime,
          durationMinutes,
          fPrice,
          carrier.color,
          carrier.logo,
          orig,
          dest
        );

        flightIdCounter++;
      }
    });
  });
  console.log(`Successfully seeded ${flightIdCounter - 100} flights.`);
}

// Database query exports
module.exports = {
  db,
  
  // Auth operations
  authenticateUser: (email, password) => {
    const query = db.prepare('SELECT id, name, email, phone, nid, miles, avatar FROM users WHERE email = ? AND password = ?');
    return query.get(email, password) || null;
  },

  updateUserMiles: (email, redeemed, earned) => {
    const query = db.prepare('UPDATE users SET miles = MAX(0, miles - ? + ?) WHERE email = ?');
    query.run(redeemed, earned, email);
    
    // Fetch and return updated user miles info
    const fetch = db.prepare('SELECT miles FROM users WHERE email = ?');
    return fetch.get(email)?.miles || 0;
  },

  // Flights querying
  getFlights: (origin, destination) => {
    const query = db.prepare('SELECT * FROM flights WHERE origin = ? AND destination = ?');
    return query.all(origin, destination);
  },

  // Seat reservations operations
  getReservedSeats: (flightId, date) => {
    const query = db.prepare('SELECT seatNumber FROM seat_reservations WHERE flightId = ? AND date = ?');
    const rows = query.all(flightId, date);
    return rows.map(r => r.seatNumber);
  },

  reserveSeat: (flightId, date, seatNumber) => {
    const query = db.prepare('INSERT INTO seat_reservations (flightId, date, seatNumber) VALUES (?, ?, ?)');
    query.run(flightId, date, seatNumber);
  },

  // Booking operations
  createBooking: (bookingData) => {
    // Add reservation inside a quick manual sequence
    const {
      flightId, date, passengerName, passengerNid, passengerEmail,
      passengerPhone, seatNumber, seatCategory, pricePaid, bookingSpeed,
      loyaltyRedeemed, classType, fasttrack, baggage, userEmail
    } = bookingData;

    // First save the booking transaction
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        flightId, date, passengerName, passengerNid, passengerEmail,
        passengerPhone, seatNumber, seatCategory, pricePaid, bookingSpeed,
        loyaltyRedeemed, class, fasttrack, baggage, userEmail
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const runResult = insertBooking.run(
      flightId, date, passengerName, passengerNid, passengerEmail,
      passengerPhone, seatNumber, seatCategory, pricePaid, bookingSpeed,
      loyaltyRedeemed, classType, fasttrack ? 1 : 0, baggage ? 1 : 0, userEmail || null
    );

    // Reserve seat
    const insertSeat = db.prepare(`
      INSERT OR IGNORE INTO seat_reservations (flightId, date, seatNumber)
      VALUES (?, ?, ?)
    `);
    insertSeat.run(flightId, date, seatNumber);

    return runResult.lastInsertRowid;
  },

  getUserBookings: (email) => {
    const query = db.prepare(`
      SELECT b.*, f.carrier, f.flightNo, f.departure, f.arrival, f.origin, f.destination
      FROM bookings b
      JOIN flights f ON b.flightId = f.id
      WHERE b.userEmail = ?
      ORDER BY b.created_at DESC
    `);
    return query.all(email);
  }
};
