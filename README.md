# yourBD | 1-Minute Airline Booking System

An ultra-fast, premium flight booking single-page web application themed around the Bangladeshi aviation ecosystem. Users are challenged to search, select a flight, choose their seats, and complete check-out in under 60 seconds.

## Features

- **60-Second Speedrun Timer**: Floating countdown widget tracking your speed, changing color as time runs low.
- **Persistent SQLite Database**: Local SQLite database storing user accounts, flight schedules, bookings, and seat reservations.
- **REST API Gateway**: Clean backend endpoints in native Node.js:
  - `/api/login` - Member authentication.
  - `/api/flights` - Query flight schedules and seat reservation tables.
  - `/api/bookings` - Create transaction records and update passenger loyalty points.
- **My Bookings Log**: Logged-in users can view past speedrun records and check their speedrunner ranks (Platinum, Gold, Silver, Bronze).
- **Interactive Seat Map**: High-fidelity CSS grid seating cabin layout with price indicators.
- **Visual Card Checkout**: Interactive credit card template that visualizes input details and flips to display CVV.
- **Parallax 3D Boarding Pass**: High-tech success boarding pass with simulated QR code scanning and dynamic mouse-tracking tilt effects.

---

## File Structure

```text
├── index.html        # Main layout structure & UI state containers
├── style.css         # Glassmorphism styling, layout grids, & keyframes
├── app.js            # Frontend state controller, timer, & API connections
├── database.js       # SQLite connections, schemas, & route seeders
├── server.js         # REST API router & static asset server
├── delta_airline.db  # Persisted SQLite database file
└── assets/
    └── airline_hero_bg.png  # Generated cyberpunk background image
```

---

## How to Run

### Requirements
- **Node.js** (v22.5.0 or higher recommended, as it includes native SQLite support).

### Startup Instructions

1. Clone or download this project folder.
2. Open your terminal in this directory.
3. Start the application using Node's SQLite flag:
   ```bash
   node --experimental-sqlite server.js
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:3000/
   ```

### Default Accounts for Testing
Use these credentials on the login screen to test profile autofill and loyalty miles redemptions:
- **User 1**: `tanvir@biman.com` (Password: `password`)
- **User 2**: `sadia.c@outlook.com` (Password: `password`)
