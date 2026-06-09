// Core State Manager
const AppState = {
  activeScreen: 'screen-search',
  currentUser: null,
  
  // Timer State
  timer: {
    duration: 60, // 60 seconds challenge
    elapsed: 0,
    intervalId: null,
    active: false,
    startTime: null,
    savedElapsed: 0
  },

  // Booking details
  booking: {
    origin: 'DAC',
    destination: 'CXB',
    date: '',
    passengers: 1,
    travelClass: 'economy',
    selectedFlight: null,
    selectedSeat: null,
    selectedSeatCategory: 'standard',
    seatUpgradeCost: 0,
    addons: {
      fasttrack: false,
      baggage: false
    },
    loyaltyRedeemed: 0,
    totalCost: 0
  },

  // Mock Database Airports
  airports: {
    DAC: { code: 'DAC', name: 'Dhaka', airport: 'Hazrat Shahjalal Int\'l' },
    CGP: { code: 'CGP', name: 'Chittagong', airport: 'Shah Amanat Int\'l' },
    CXB: { code: 'CXB', name: 'Cox\'s Bazar', airport: 'Cox\'s Bazar Airport' },
    ZYL: { code: 'ZYL', name: 'Sylhet', airport: 'Osmani Int\'l' },
    JSR: { code: 'JSR', name: 'Jessore', airport: 'Jessore Airport' },
    SPD: { code: 'SPD', name: 'Saidpur', airport: 'Saidpur Airport' },
    CCU: { code: 'CCU', name: 'Kolkata', airport: 'Netaji Subhash Chandra Bose' },
    DXB: { code: 'DXB', name: 'Dubai', airport: 'Dubai International' },
    LHR: { code: 'LHR', name: 'London', airport: 'Heathrow Airport' },
    SIN: { code: 'SIN', name: 'Singapore', airport: 'Changi Airport' },
    BKK: { code: 'BKK', name: 'Bangkok', airport: 'Suvarnabhumi Airport' },
    KUL: { code: 'KUL', name: 'Kuala Lumpur', airport: 'Kuala Lumpur Int\'l' }
  }
};

// DOM Elements
const screens = document.querySelectorAll('.screen');
const notificationContainer = document.getElementById('notification-container');

// Header Elements
const timerWidget = document.getElementById('timer-widget');
const timerDisplay = document.getElementById('timer-display');
const timerFill = document.getElementById('timer-fill');
const timerIconSpin = document.getElementById('timer-icon-spin');
const authGuest = document.getElementById('auth-guest');
const authUser = document.getElementById('auth-user');
const profileName = document.getElementById('profile-name');
const profileMiles = document.getElementById('profile-miles');
const profileAvatar = document.getElementById('profile-avatar');

// Navigation / Button Triggers
const btnHome = document.getElementById('btn-home');
const btnOpenLogin = document.getElementById('btn-open-login');
const btnCloseLogin = document.getElementById('btn-close-login');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const btnLogout = document.getElementById('btn-logout');

// My Bookings UI Elements
const btnOpenBookings = document.getElementById('btn-open-bookings');
const btnCloseBookings = document.getElementById('btn-close-bookings');
const bookingsModal = document.getElementById('bookings-modal');
const bookingsHistoryList = document.getElementById('bookings-history-list');

// Screen 1: Search Elements
const searchForm = document.getElementById('search-form');
const searchOrigin = document.getElementById('search-origin');
const searchDestination = document.getElementById('search-destination');
const searchDate = document.getElementById('search-date');
const searchPassengers = document.getElementById('search-passengers');
const searchClass = document.getElementById('search-class');
const btnSwapAirports = document.getElementById('btn-swap-airports');
const presetCards = document.querySelectorAll('.preset-card');

// Screen 2: Flights List Elements
const btnBackToSearch = document.getElementById('btn-back-to-search');
const flightsRouteTitle = document.getElementById('flights-route-title');
const flightsDateSummary = document.getElementById('flights-date-summary');
const flightsCount = document.getElementById('flights-count');
const flightsListContainer = document.getElementById('flights-list-container');
const filterBtns = document.querySelectorAll('.filter-btn');

// Screen 3: Seat selection Elements
const btnBackToFlights = document.getElementById('btn-back-to-flights');
const seatsFlightSummary = document.getElementById('seats-flight-summary');
const cabinSeatGrid = document.getElementById('cabin-seat-grid');
const summaryBasePrice = document.getElementById('summary-base-price');
const summarySeatNumber = document.getElementById('summary-seat-number');
const summarySeatUpgrade = document.getElementById('summary-seat-upgrade');
const summaryTotalPrice = document.getElementById('summary-total-price');
const chkFasttrack = document.getElementById('chk-fasttrack');
const chkExtraBaggage = document.getElementById('chk-extra-baggage');
const btnConfirmSeats = document.getElementById('btn-confirm-seats');

// Screen 4: Checkout Elements
const btnBackToSeats = document.getElementById('btn-back-to-seats');
const autofillBanner = document.getElementById('autofill-banner');
const btnAutofillAction = document.getElementById('btn-autofill-action');
const checkFname = document.getElementById('check-fname');
const checkNid = document.getElementById('check-nid');
const checkEmail = document.getElementById('check-email');
const checkPhone = document.getElementById('check-phone');
const checkoutLoyaltyPanel = document.getElementById('checkout-loyalty-panel');
const loyaltyMilesCount = document.getElementById('loyalty-miles-count');
const loyaltyDiscountDisplay = document.getElementById('loyalty-discount-display');
const loyaltyMilesSlider = document.getElementById('loyalty-miles-slider');

// Credit Card Preview Info
const creditCardObject = document.getElementById('credit-card-object');
const creditCardContainer = document.getElementById('credit-card-container');
const cardNumInput = document.getElementById('card-num');
const cardNameInput = document.getElementById('card-name');
const cardExpInput = document.getElementById('card-exp');
const cardCvvInput = document.getElementById('card-cvv');
const cardPreviewNumber = document.getElementById('card-preview-number');
const cardPreviewName = document.getElementById('card-preview-name');
const cardPreviewExp = document.getElementById('card-preview-exp');
const cardPreviewCvv = document.getElementById('card-preview-cvv');
const paymentTabs = document.querySelectorAll('.payment-tab');
const paymentCardFields = document.getElementById('payment-card-fields');
const paymentWalletFields = document.getElementById('payment-wallet-fields');
const walletPhoneInput = document.getElementById('wallet-phone');

// Checkout Pricing Summary
const summaryCheckoutRoute = document.getElementById('summary-checkout-route');
const summaryCheckoutBase = document.getElementById('summary-checkout-base');
const summaryCheckoutSeatUp = document.getElementById('summary-checkout-seat-up');
const summaryCheckoutFasttrackRow = document.getElementById('summary-checkout-fasttrack-row');
const summaryCheckoutBaggageRow = document.getElementById('summary-checkout-baggage-row');
const summaryCheckoutDiscountRow = document.getElementById('summary-checkout-discount-row');
const summaryCheckoutDiscount = document.getElementById('summary-checkout-discount');
const summaryCheckoutTotal = document.getElementById('summary-checkout-total');

// Sliding confirmations
const slideTrack = document.getElementById('slide-track');
const slideHandle = document.getElementById('slide-handle');
const slideText = document.getElementById('slide-text');

// Screen 5: Digital Boarding Pass Elements
const boardingPassTicket = document.getElementById('boarding-pass-ticket');
const ticketCarrierName = document.getElementById('ticket-carrier-name');
const ticketClassName = document.getElementById('ticket-class-name');
const ticketOriginCode = document.getElementById('ticket-origin-code');
const ticketOriginName = document.getElementById('ticket-origin-name');
const ticketDestCode = document.getElementById('ticket-dest-code');
const ticketDestName = document.getElementById('ticket-dest-name');
const ticketPassengerName = document.getElementById('ticket-passenger-name');
const ticketFlightNo = document.getElementById('ticket-flight-no');
const ticketSeatNo = document.getElementById('ticket-seat-no');
const ticketDepartDate = document.getElementById('ticket-depart-date');
const ticketBoardingTime = document.getElementById('ticket-boarding-time');
const ticketGate = document.getElementById('ticket-gate');
const ticketSpeedTime = document.getElementById('ticket-speed-time');
const ticketBadgeRank = document.getElementById('ticket-badge-rank');
const btnPrintTicket = document.getElementById('btn-print-ticket');
const btnRestartBooking = document.getElementById('btn-restart-booking');


/* --- Initialization & Event Listeners --- */
document.addEventListener('DOMContentLoaded', () => {
  // Set default departure date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  searchDate.value = tomorrow.toISOString().split('T')[0];
  
  initEventListeners();
  checkSavedLogin();
});

function initEventListeners() {
  // Navigation
  btnHome.addEventListener('click', () => {
    resetChallengeTimer();
    showScreen('screen-search');
  });

  // Auth / Login Modals
  btnOpenLogin.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
  });
  btnCloseLogin.addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.add('hidden');
  });

  // My Bookings list toggles
  btnOpenBookings.addEventListener('click', loadBookingsHistory);
  btnCloseBookings.addEventListener('click', () => bookingsModal.classList.add('hidden'));
  bookingsModal.addEventListener('click', (e) => {
    if (e.target === bookingsModal) bookingsModal.classList.add('hidden');
  });

  // Quick user selection
  document.getElementById('quick-user-1').addEventListener('click', () => loginMockUser('tanvir@biman.com'));
  document.getElementById('quick-user-2').addEventListener('click', () => loginMockUser('sadia.c@outlook.com'));
  btnAutofillAction.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    loginMockUser(email);
  });

  btnLogout.addEventListener('click', logoutUser);

  // Search Screen Events
  btnSwapAirports.addEventListener('click', swapAirports);
  
  // Connect Date Chips
  document.getElementById('chip-today').addEventListener('click', () => setQuickDate(0, 'chip-today'));
  document.getElementById('chip-tomorrow').addEventListener('click', () => setQuickDate(1, 'chip-tomorrow'));
  document.getElementById('chip-day-after').addEventListener('click', () => setQuickDate(2, 'chip-day-after'));

  // Trigger Timer on first click/type interaction with Search screen
  searchForm.addEventListener('input', startTimerOnFirstAction);
  searchForm.addEventListener('click', startTimerOnFirstAction);

  // Presets booking
  presetCards.forEach(card => {
    card.addEventListener('click', () => {
      const origin = card.getAttribute('data-origin');
      const dest = card.getAttribute('data-dest');
      searchOrigin.value = origin;
      searchDestination.value = dest;
      startChallengeTimer();
      executeSearch();
    });
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    startChallengeTimer();
    executeSearch();
  });

  // Screen 2: Flights list actions
  btnBackToSearch.addEventListener('click', () => {
    showScreen('screen-search');
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sortType = btn.getAttribute('data-sort');
      sortFlights(sortType);
    });
  });

  // Screen 3: Seat map actions
  btnBackToFlights.addEventListener('click', () => {
    showScreen('screen-flights');
  });

  chkFasttrack.addEventListener('change', updateSeatTotals);
  chkExtraBaggage.addEventListener('change', updateSeatTotals);

  btnConfirmSeats.addEventListener('click', () => {
    if (!AppState.booking.selectedSeat) {
      showNotification('Please select a seat to proceed.', 'error');
      return;
    }
    setupCheckout();
    showScreen('screen-checkout');
  });

  // Screen 4: Checkout Actions
  btnBackToSeats.addEventListener('click', () => {
    showScreen('screen-seats');
  });

  // Payment tabs selector
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const method = tab.getAttribute('data-method');
      if (method === 'card') {
        paymentCardFields.classList.remove('hidden');
        paymentWalletFields.classList.add('hidden');
        creditCardContainer.style.display = 'block';
        cardNumInput.required = true;
        cardNameInput.required = true;
        cardExpInput.required = true;
        cardCvvInput.required = true;
        walletPhoneInput.required = false;
      } else {
        paymentCardFields.classList.add('hidden');
        paymentWalletFields.classList.remove('hidden');
        creditCardContainer.style.display = 'none';
        cardNumInput.required = false;
        cardNameInput.required = false;
        cardExpInput.required = false;
        cardCvvInput.required = false;
        walletPhoneInput.required = true;
      }
    });
  });

  // Credit Card Typing Visualizer & Flipping
  cardNumInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
    e.target.value = formatted;
    cardPreviewNumber.innerText = formatted || '•••• •••• •••• ••••';
  });

  cardNameInput.addEventListener('input', (e) => {
    let val = e.target.value.toUpperCase();
    cardPreviewName.innerText = val || 'YOUR NAME';
  });

  cardExpInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    e.target.value = val;
    cardPreviewExp.innerText = val || 'MM/YY';
  });

  cardCvvInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    e.target.value = val;
    cardPreviewCvv.innerText = '•'.repeat(val.length) || '•••';
  });

  // Flip credit card on CVV focus
  cardCvvInput.addEventListener('focus', () => {
    creditCardObject.classList.add('flipped');
  });
  cardCvvInput.addEventListener('blur', () => {
    creditCardObject.classList.remove('flipped');
  });

  // Loyalty Points redemption
  loyaltyMilesSlider.addEventListener('input', (e) => {
    const milesToRedeem = parseInt(e.target.value);
    AppState.booking.loyaltyRedeemed = milesToRedeem;
    
    const discount = milesToRedeem / 2;
    loyaltyDiscountDisplay.innerText = `BDT ${discount.toLocaleString()}`;
    
    updateCheckoutTotals();
  });

  // Slide to confirm drag logic
  initSlideToConfirm();

  // Screen 5: Ticket actions
  btnRestartBooking.addEventListener('click', () => {
    resetChallengeTimer();
    showScreen('screen-search');
  });

  btnPrintTicket.addEventListener('click', () => {
    window.print();
  });

  // Boarding Pass 3D Tilt Hover
  initBoardingPassTilt();
}


/* --- Timer Operations (The Booking Challenge) --- */

function startTimerOnFirstAction() {
  if (AppState.activeScreen === 'screen-search' && !AppState.timer.active && AppState.timer.elapsed === 0) {
    startChallengeTimer();
    showNotification('Booking speedrun timer started! Complete checkout in 60s.', 'success');
  }
  searchForm.removeEventListener('input', startTimerOnFirstAction);
  searchForm.removeEventListener('click', startTimerOnFirstAction);
}

function startChallengeTimer() {
  if (AppState.timer.active) return;
  
  AppState.timer.active = true;
  AppState.timer.startTime = Date.now() - AppState.timer.savedElapsed;
  timerIconSpin.classList.add('fa-spin');

  AppState.timer.intervalId = setInterval(() => {
    const elapsedMs = Date.now() - AppState.timer.startTime;
    AppState.timer.elapsed = elapsedMs;

    const remainingMs = Math.max(0, 60000 - elapsedMs);
    updateTimerUI(remainingMs);

    if (remainingMs <= 0) {
      stopChallengeTimer();
      triggerTimerFail();
    }
  }, 33);
}

function stopChallengeTimer() {
  if (!AppState.timer.active) return;
  AppState.timer.active = false;
  clearInterval(AppState.timer.intervalId);
  AppState.timer.savedElapsed = AppState.timer.elapsed;
  timerIconSpin.classList.remove('fa-spin');
}

function resetChallengeTimer() {
  stopChallengeTimer();
  AppState.timer.elapsed = 0;
  AppState.timer.savedElapsed = 0;
  
  searchForm.addEventListener('input', startTimerOnFirstAction);
  searchForm.addEventListener('click', startTimerOnFirstAction);

  timerWidget.className = 'timer-widget';
  timerDisplay.innerText = '01:00.00';
  timerFill.style.width = '100%';
}

function updateTimerUI(remainingMs) {
  const totalSeconds = remainingMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hundredths = Math.floor((remainingMs % 1000) / 10);

  const formattedTime = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  timerDisplay.innerText = formattedTime;

  const percentage = (remainingMs / 60000) * 100;
  timerFill.style.width = `${percentage}%`;

  if (totalSeconds <= 15 && totalSeconds > 5) {
    timerWidget.classList.add('timer-warning');
  } else if (totalSeconds <= 5) {
    timerWidget.classList.remove('timer-warning');
    timerWidget.classList.add('timer-critical');
  } else {
    timerWidget.classList.remove('timer-warning', 'timer-critical');
  }
}

function triggerTimerFail() {
  showNotification('Booking speedrun timer expired! You can still continue, but check out faster next time!', 'error');
}


/* --- Routing / Views --- */

function showScreen(screenId) {
  screens.forEach(screen => {
    if (screen.id === screenId) {
      screen.classList.add('active');
    } else {
      screen.classList.remove('active');
    }
  });
  AppState.activeScreen = screenId;
  window.scrollTo(0, 0);

  if (screenId === 'screen-ticket') {
    stopChallengeTimer();
    timerWidget.classList.add('timer-stopped');
  } else if (screenId === 'screen-search') {
    resetChallengeTimer();
  }
}


/* --- User Authentication --- */

function checkSavedLogin() {
  const savedUser = localStorage.getItem('delta_user');
  if (savedUser) {
    AppState.currentUser = JSON.parse(savedUser);
    renderAuthHeader();
  }
}

async function loginMockUser(email) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password' })
    });

    const data = await response.json();
    
    if (!response.ok) {
      showNotification(data.error || 'Authentication failed', 'error');
      return;
    }

    AppState.currentUser = data.user;
    localStorage.setItem('delta_user', JSON.stringify(data.user));
    renderAuthHeader();
    loginModal.classList.add('hidden');
    showNotification(`Welcome back, ${data.user.name}!`, 'success');

    if (AppState.activeScreen === 'screen-checkout') {
      setupCheckout();
    }
  } catch (err) {
    showNotification('Server communication failure during login', 'error');
  }
}

function logoutUser() {
  AppState.currentUser = null;
  localStorage.removeItem('delta_user');
  renderAuthHeader();
  showNotification('You have logged out.', 'success');
  
  if (AppState.activeScreen === 'screen-checkout') {
    checkFname.value = '';
    checkNid.value = '';
    checkEmail.value = '';
    checkPhone.value = '';
    autofillBanner.classList.remove('hidden');
    checkoutLoyaltyPanel.classList.add('hidden');
    AppState.booking.loyaltyRedeemed = 0;
    updateCheckoutTotals();
  }
}

function renderAuthHeader() {
  if (AppState.currentUser) {
    authGuest.classList.add('hidden');
    authUser.classList.remove('hidden');
    profileName.innerText = AppState.currentUser.name;
    profileMiles.innerHTML = `<i class="fa-solid fa-crown"></i> ${AppState.currentUser.miles.toLocaleString()} Miles`;
    
    // Add default avatar fallback
    profileAvatar.src = AppState.currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80';
  } else {
    authGuest.classList.remove('hidden');
    authUser.classList.add('hidden');
  }
}

async function loadBookingsHistory() {
  if (!AppState.currentUser) return;
  
  try {
    const response = await fetch(`/api/bookings?email=${encodeURIComponent(AppState.currentUser.email)}`);
    const data = await response.json();

    if (!response.ok) {
      showNotification(data.error || 'Could not fetch history', 'error');
      return;
    }

    renderBookingsList(data.bookings);
    bookingsModal.classList.remove('hidden');
  } catch (err) {
    showNotification('Error loading bookings logs', 'error');
  }
}

function renderBookingsList(bookings) {
  bookingsHistoryList.innerHTML = '';
  
  if (!bookings || bookings.length === 0) {
    bookingsHistoryList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <i class="fa-solid fa-plane-slash" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>You have no bookings recorded in SQLite yet!</p>
      </div>
    `;
    return;
  }

  bookings.forEach(b => {
    const hrs = Math.floor(b.duration / 60);
    const mins = b.duration % 60;
    const formattedDuration = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    
    const speed = parseFloat(b.bookingSpeed);
    let speedClass = 'text-muted';
    let speedRank = 'Bronze';
    if (speed < 30) { speedClass = 'text-cyan'; speedRank = 'Platinum'; }
    else if (speed < 45) { speedClass = 'text-green'; speedRank = 'Gold'; }
    else if (speed < 60) { speedClass = 'text-purple'; speedRank = 'Silver'; }

    const card = document.createElement('div');
    card.style.background = 'rgba(255, 255, 255, 0.02)';
    card.style.border = '1px solid var(--border-color)';
    card.style.borderRadius = '8px';
    card.style.padding = '1rem';
    card.style.marginBottom = '0.8rem';
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span style="font-family: var(--font-title); font-weight: bold; font-size: 1rem; color: var(--accent-cyan);">
          <i class="fa-solid fa-plane-up"></i> ${b.carrier} (${b.flightNo})
        </span>
        <span class="font-mono text-xs ${speedClass}">
          <i class="fa-solid fa-stopwatch"></i> ${speed}s (${speedRank})
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;">
        <span><strong>Route:</strong> ${b.origin} &rarr; ${b.destination} (${formattedDuration})</span>
        <span><strong>Seat:</strong> ${b.seatNumber} (${b.class.toUpperCase()})</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 0.4rem;">
        <span class="font-mono text-green">Paid BDT ${b.pricePaid.toLocaleString()}</span>
        <span>Date: ${b.date}</span>
      </div>
    `;
    bookingsHistoryList.appendChild(card);
  });
}


/* --- Form & Date Presets --- */

function swapAirports() {
  const origin = searchOrigin.value;
  const destination = searchDestination.value;
  searchOrigin.value = destination;
  searchDestination.value = origin;
}

function setQuickDate(daysOffset, chipId) {
  document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
  document.getElementById(chipId).classList.add('active');

  const selectedDate = new Date();
  selectedDate.setDate(selectedDate.getDate() + daysOffset);
  searchDate.value = selectedDate.toISOString().split('T')[0];
}


/* --- Screen 2: Flight Search Results --- */

let currentFlightsResults = [];

async function executeSearch() {
  const origin = searchOrigin.value;
  const dest = searchDestination.value;
  const date = searchDate.value;

  if (!origin || !dest) {
    showNotification('Please select both Origin and Destination.', 'error');
    return;
  }

  if (origin === dest) {
    showNotification('Origin and Destination cannot be the same airport.', 'error');
    return;
  }

  // Update Route Title
  const originAirport = AppState.airports[origin];
  const destAirport = AppState.airports[dest];
  flightsRouteTitle.innerHTML = `${originAirport.name} (${origin}) <i class="fa-solid fa-arrow-right-long text-cyan text-sm"></i> ${destAirport.name} (${dest})`;

  // Summary Text
  const travelDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const pCount = searchPassengers.value;
  const tClass = searchClass.value.toUpperCase();
  flightsDateSummary.innerText = `Date: ${travelDate} | ${pCount} Passenger(s) | ${tClass}`;

  // Call API
  try {
    const response = await fetch(`/api/flights?origin=${origin}&destination=${dest}&date=${date}`);
    const data = await response.json();

    if (!response.ok) {
      showNotification(data.error || 'Failed to search flights', 'error');
      return;
    }

    currentFlightsResults = data.flights;
    sortFlights('speed');
    showScreen('screen-flights');
  } catch (err) {
    showNotification('Connection error while fetching flights list', 'error');
  }
}

function sortFlights(sortType) {
  if (sortType === 'price') {
    currentFlightsResults.sort((a, b) => a.price - b.price);
  } else if (sortType === 'departure') {
    currentFlightsResults.sort((a, b) => a.departure.localeCompare(b.departure));
  } else {
    currentFlightsResults.sort((a, b) => a.duration - b.duration);
  }
  
  renderFlightsList();
}

function renderFlightsList() {
  flightsListContainer.innerHTML = '';
  flightsCount.innerText = currentFlightsResults.length;

  if (currentFlightsResults.length === 0) {
    flightsListContainer.innerHTML = `
      <div class="glass-card text-center" style="padding: 3rem;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: var(--accent-pink); margin-bottom: 1rem;"></i>
        <h3>No flights scheduled on this route</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Try modifying your origin/destination parameters.</p>
      </div>
    `;
    return;
  }

  currentFlightsResults.forEach((flight, index) => {
    const hrs = Math.floor(flight.duration / 60);
    const mins = flight.duration % 60;
    const formattedDuration = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

    // Visual tags selection (mock tag matching based on relative indices)
    let badgesHTML = '';
    if (index === 0) badgesHTML = `<span class="flight-badge badge-fastest"><i class="fa-solid fa-bolt"></i> FASTEST</span>`;
    else if (index === currentFlightsResults.length - 1) badgesHTML = `<span class="flight-badge badge-cheapest"><i class="fa-solid fa-tags"></i> BEST PRICE</span>`;
    else badgesHTML = `<span class="flight-badge badge-eco"><i class="fa-solid fa-seedling"></i> ECO-VALUE</span>`;

    const card = document.createElement('div');
    card.className = 'flight-card glass-card';
    card.innerHTML = `
      <div class="airline-info">
        <div class="airline-logo-box ${flight.carrierColor}">
          <i class="fa-solid ${flight.logo}"></i>
        </div>
        <div class="airline-details">
          <span class="airline-name">${flight.carrier}</span>
          <span class="flight-number-tag">${flight.flightNo}</span>
        </div>
      </div>

      <div class="flight-timeline">
        <div class="timeline-time-box">
          <span class="time">${flight.departure}</span>
          <span class="airport">${searchOrigin.value}</span>
        </div>
        <div class="timeline-path">
          <span class="path-duration">${formattedDuration}</span>
          <div class="path-line-decor"></div>
          <span class="path-duration text-cyan font-bold">Direct</span>
        </div>
        <div class="timeline-time-box right">
          <span class="time">${flight.arrival}</span>
          <span class="airport">${searchDestination.value}</span>
        </div>
      </div>

      <div class="flight-badges">
        ${badgesHTML}
      </div>

      <div class="flight-action-area">
        <span class="flight-price">BDT ${flight.price.toLocaleString()}</span>
        <button class="btn btn-primary btn-sm btn-select-flight" data-id="${flight.id}">
          <span>Select</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;

    flightsListContainer.appendChild(card);
  });

  document.querySelectorAll('.btn-select-flight').forEach(btn => {
    btn.addEventListener('click', () => {
      const flightId = btn.getAttribute('data-id');
      const flight = currentFlightsResults.find(f => f.id === flightId);
      selectFlight(flight);
    });
  });
}

function selectFlight(flight) {
  AppState.booking.selectedFlight = flight;
  AppState.booking.selectedSeat = null;
  AppState.booking.seatUpgradeCost = 0;
  
  seatsFlightSummary.innerHTML = `${flight.carrier} ${flight.flightNo} | ${searchClass.value.toUpperCase()}`;
  
  generateSeatMap();
  updateSeatTotals();
  showScreen('screen-seats');
}


/* --- Screen 3: Seat Mapping & Logic --- */

function generateSeatMap() {
  cabinSeatGrid.innerHTML = '';
  const rowsCount = 10;
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Occupied seats list returned directly from SQLite database flight lookup!
  const occupiedList = AppState.booking.selectedFlight.occupiedSeats || [];

  for (let r = 1; r <= rowsCount; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';
    
    const rowNum = document.createElement('span');
    rowNum.className = 'row-num';
    rowNum.innerText = r.toString().padStart(2, '0');
    rowDiv.appendChild(rowNum);

    for (let c = 0; c < 3; c++) {
      rowDiv.appendChild(createSeatCell(r, columns[c], occupiedList));
    }

    const spacer = document.createElement('div');
    spacer.className = 'seat-gap';
    rowDiv.appendChild(spacer);

    for (let c = 3; c < 6; c++) {
      rowDiv.appendChild(createSeatCell(r, columns[c], occupiedList));
    }

    cabinSeatGrid.appendChild(rowDiv);
  }
}

function createSeatCell(row, col, occupiedList) {
  const seatId = `${row.toString().padStart(2, '0')}${col}`;
  const cell = document.createElement('div');
  
  let seatCategory = 'standard';
  let categoryLabel = '';
  
  if (row <= 2) {
    seatCategory = 'premium';
    cell.classList.add('seat-premium');
    categoryLabel = 'Premium';
  } else if (row === 5 || row === 6) {
    seatCategory = 'extra-leg';
    cell.classList.add('seat-extra-leg');
    categoryLabel = 'Extra Legroom';
  }
  
  cell.className += ` seat-cell`;
  cell.setAttribute('data-seat', seatId);
  cell.setAttribute('data-category', seatCategory);
  cell.innerHTML = seatId;

  // Check if seat exists in persistent SQLite reservations
  const isOccupied = occupiedList.includes(seatId);

  if (isOccupied) {
    cell.classList.add('occupied');
  } else {
    cell.addEventListener('click', () => {
      document.querySelectorAll('.seat-cell.selected').forEach(c => c.classList.remove('selected'));
      
      if (AppState.booking.selectedSeat === seatId) {
        AppState.booking.selectedSeat = null;
        AppState.booking.selectedSeatCategory = 'standard';
        AppState.booking.seatUpgradeCost = 0;
      } else {
        cell.classList.add('selected');
        AppState.booking.selectedSeat = seatId;
        AppState.booking.selectedSeatCategory = seatCategory;
        
        if (seatCategory === 'premium') AppState.booking.seatUpgradeCost = 2000;
        else if (seatCategory === 'extra-leg') AppState.booking.seatUpgradeCost = 1000;
        else AppState.booking.seatUpgradeCost = 0;

        showNotification(`Seat ${seatId} (${categoryLabel || 'Standard'}) selected.`, 'success');
      }
      updateSeatTotals();
    });
  }

  return cell;
}

function updateSeatTotals() {
  const flight = AppState.booking.selectedFlight;
  if (!flight) return;

  const basePrice = flight.price;
  summaryBasePrice.innerText = `BDT ${basePrice.toLocaleString()}`;

  const seat = AppState.booking.selectedSeat;
  if (seat) {
    summarySeatNumber.innerText = seat;
    summarySeatNumber.className = 'summary-val text-cyan font-mono font-bold';
  } else {
    summarySeatNumber.innerText = 'Not Selected';
    summarySeatNumber.className = 'summary-val text-muted';
  }

  const upgrade = AppState.booking.seatUpgradeCost;
  summarySeatUpgrade.innerText = `BDT +${upgrade.toLocaleString()}`;

  let addonCost = 0;
  if (chkFasttrack.checked) addonCost += 800;
  if (chkExtraBaggage.checked) addonCost += 1200;
  
  AppState.booking.addons.fasttrack = chkFasttrack.checked;
  AppState.booking.addons.baggage = chkExtraBaggage.checked;

  const total = basePrice + upgrade + addonCost;
  AppState.booking.totalCost = total;
  summaryTotalPrice.innerText = `BDT ${total.toLocaleString()}`;
}


/* --- Screen 4: Checkout Setup & Drag confirm --- */

function setupCheckout() {
  const flight = AppState.booking.selectedFlight;
  if (!flight) return;

  if (AppState.currentUser) {
    autofillBanner.classList.add('hidden');
    checkoutLoyaltyPanel.classList.remove('hidden');
    
    checkFname.value = AppState.currentUser.name;
    checkNid.value = AppState.currentUser.nid || '';
    checkEmail.value = AppState.currentUser.email;
    checkPhone.value = AppState.currentUser.phone || '';

    // Calculate max miles user can spend based on points exchange (capped to half the flight ticket price!)
    const maxMilesBurn = Math.min(AppState.currentUser.miles, Math.floor(AppState.booking.totalCost * 2));
    loyaltyMilesSlider.max = maxMilesBurn;
    loyaltyMilesSlider.value = 0;
    loyaltyMilesCount.innerText = AppState.currentUser.miles.toLocaleString();
    loyaltyDiscountDisplay.innerText = 'BDT 0';
    AppState.booking.loyaltyRedeemed = 0;
    
    cardNumInput.value = '4153 9200 4821 7761';
    cardNameInput.value = AppState.currentUser.name.toUpperCase();
    cardExpInput.value = '10/29';
    cardCvvInput.value = '425';

    cardPreviewNumber.innerText = '4153 9200 4821 7761';
    cardPreviewName.innerText = AppState.currentUser.name.toUpperCase();
    cardPreviewExp.innerText = '10/29';
    cardPreviewCvv.innerText = '•••';
  } else {
    autofillBanner.classList.remove('hidden');
    checkoutLoyaltyPanel.classList.add('hidden');
    
    checkFname.value = '';
    checkNid.value = '';
    checkEmail.value = '';
    checkPhone.value = '';

    cardNumInput.value = '';
    cardNameInput.value = '';
    cardExpInput.value = '';
    cardCvvInput.value = '';
    cardPreviewNumber.innerText = '•••• •••• •••• ••••';
    cardPreviewName.innerText = 'YOUR NAME';
    cardPreviewExp.innerText = 'MM/YY';
    cardPreviewCvv.innerText = '•••';
  }

  const originAirport = AppState.airports[searchOrigin.value];
  const destAirport = AppState.airports[searchDestination.value];
  summaryCheckoutRoute.innerHTML = `${originAirport.name} &rarr; ${destAirport.name}`;
  summaryCheckoutBase.innerText = `BDT ${flight.price.toLocaleString()}`;

  updateCheckoutTotals();
  resetSlideHandle();
}

function updateCheckoutTotals() {
  const flight = AppState.booking.selectedFlight;
  if (!flight) return;

  summaryCheckoutSeatUp.innerText = `BDT +${AppState.booking.seatUpgradeCost.toLocaleString()}`;

  let addonCost = 0;
  if (AppState.booking.addons.fasttrack) {
    summaryCheckoutFasttrackRow.classList.remove('hidden');
    addonCost += 800;
  } else {
    summaryCheckoutFasttrackRow.classList.add('hidden');
  }

  if (AppState.booking.addons.baggage) {
    summaryCheckoutBaggageRow.classList.remove('hidden');
    addonCost += 1200;
  } else {
    summaryCheckoutBaggageRow.classList.add('hidden');
  }

  const discount = AppState.booking.loyaltyRedeemed / 2;
  if (discount > 0) {
    summaryCheckoutDiscountRow.classList.remove('hidden');
    summaryCheckoutDiscount.innerText = `-BDT ${discount.toLocaleString()}`;
  } else {
    summaryCheckoutDiscountRow.classList.add('hidden');
  }

  const finalTotal = flight.price + AppState.booking.seatUpgradeCost + addonCost - discount;
  AppState.booking.totalCost = finalTotal;
  summaryCheckoutTotal.innerText = `BDT ${finalTotal.toLocaleString()}`;
}

function initSlideToConfirm() {
  let isDragging = false;
  let startX = 0;
  let maxDrag = 0;

  const dragStart = (e) => {
    if (!validateCheckoutForm()) {
      e.preventDefault();
      return;
    }

    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const trackWidth = slideTrack.offsetWidth;
    const handleWidth = slideHandle.offsetWidth;
    maxDrag = trackWidth - handleWidth - 8;
    slideHandle.style.transition = 'none';
  };

  const dragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let delta = currentX - startX;
    
    if (delta < 0) delta = 0;
    if (delta > maxDrag) delta = maxDrag;

    slideHandle.style.transform = `translateX(${delta}px)`;
    
    const pct = delta / maxDrag;
    slideText.style.opacity = (1 - pct * 1.5).toString();
  };

  const dragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    
    const transformStyle = window.getComputedStyle(slideHandle).transform;
    let currentTranslate = 0;
    if (transformStyle && transformStyle !== 'none') {
      const matrix = new WebKitCSSMatrix(transformStyle);
      currentTranslate = matrix.m41;
    }

    if (currentTranslate >= maxDrag * 0.9) {
      slideHandle.style.transition = 'transform 0.2s ease-out';
      slideHandle.style.transform = `translateX(${maxDrag}px)`;
      executeConfirmBooking();
    } else {
      slideHandle.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
      slideHandle.style.transform = `translateX(0px)`;
      slideText.style.opacity = '1';
    }
  };

  slideHandle.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);

  slideHandle.addEventListener('touchstart', dragStart);
  window.addEventListener('touchmove', dragMove);
  window.addEventListener('touchend', dragEnd);
}

function resetSlideHandle() {
  slideHandle.style.transform = 'translateX(0px)';
  slideText.style.opacity = '1';
  slideText.innerText = 'SLIDE TO BOOK INSTANTLY';
  slideTrack.classList.remove('slide-success');
}

function validateCheckoutForm() {
  if (!checkFname.value.trim()) { showNotification('Please enter Traveler Full Name.', 'error'); return false; }
  if (!checkNid.value.trim()) { showNotification('Please enter NID/Passport number.', 'error'); return false; }
  if (!checkEmail.value.trim() || !checkEmail.value.includes('@')) { showNotification('Please enter a valid email address.', 'error'); return false; }
  if (!checkPhone.value.trim()) { showNotification('Please enter contact mobile phone.', 'error'); return false; }

  const isCard = document.querySelector('.payment-tab.active').getAttribute('data-method') === 'card';
  if (isCard) {
    if (!cardNumInput.value.trim() || cardNumInput.value.length < 16) { showNotification('Please enter valid credit card number.', 'error'); return false; }
    if (!cardNameInput.value.trim()) { showNotification('Please enter Cardholder Name.', 'error'); return false; }
    if (!cardExpInput.value.trim() || !cardExpInput.value.includes('/')) { showNotification('Please enter credit card expiry MM/YY.', 'error'); return false; }
    if (!cardCvvInput.value.trim() || cardCvvInput.value.length < 3) { showNotification('Please enter Card CVV.', 'error'); return false; }
  } else {
    if (!walletPhoneInput.value.trim() || walletPhoneInput.value.length < 11) { showNotification('Please enter valid 11-digit mobile wallet number.', 'error'); return false; }
  }

  return true;
}


/* --- Confirm Booking & Ticket Display --- */

async function executeConfirmBooking() {
  slideText.innerText = 'LOCKING SEAT & CHARGING...';
  slideText.style.opacity = '1';
  slideTrack.classList.add('slide-success');

  stopChallengeTimer();
  const finalSeconds = (AppState.timer.elapsed / 1000).toFixed(2);
  AppState.bookingSpeed = finalSeconds;

  // Compile booking payloads
  const payload = {
    flightId: AppState.booking.selectedFlight.id,
    date: searchDate.value,
    passengerName: checkFname.value.trim(),
    passengerNid: checkNid.value.trim(),
    passengerEmail: checkEmail.value.trim(),
    passengerPhone: checkPhone.value.trim(),
    seatNumber: AppState.booking.selectedSeat,
    seatCategory: AppState.booking.selectedSeatCategory,
    pricePaid: AppState.booking.totalCost,
    bookingSpeed: parseFloat(finalSeconds),
    loyaltyRedeemed: AppState.booking.loyaltyRedeemed,
    classType: searchClass.value,
    fasttrack: AppState.booking.addons.fasttrack,
    baggage: AppState.booking.addons.baggage,
    userEmail: AppState.currentUser ? AppState.currentUser.email : null
  };

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      showNotification(data.error || 'Server rejected booking transaction', 'error');
      resetSlideHandle();
      return;
    }

    // Update Local Mileage state if logged in
    if (AppState.currentUser && data.updatedMiles !== undefined) {
      const difference = data.updatedMiles - AppState.currentUser.miles;
      AppState.currentUser.miles = data.updatedMiles;
      localStorage.setItem('delta_user', JSON.stringify(AppState.currentUser));
      renderAuthHeader();
      
      if (difference > 0) {
        showNotification(`Success! Earned +${difference} Biman Loyalty Miles!`, 'success');
      } else {
        showNotification('Success! Booking records saved to SQLite database.', 'success');
      }
    } else {
      showNotification('Success! Booking records saved to SQLite database.', 'success');
    }

    // Display ticket
    renderFinalBoardingPass();
    setTimeout(() => {
      showScreen('screen-ticket');
    }, 800);

  } catch (err) {
    showNotification('Database connection error during transaction checkout.', 'error');
    resetSlideHandle();
  }
}

function renderFinalBoardingPass() {
  const flight = AppState.booking.selectedFlight;
  if (!flight) return;

  const originAirport = AppState.airports[searchOrigin.value];
  const destAirport = AppState.airports[searchDestination.value];

  ticketCarrierName.innerText = flight.carrier.toUpperCase();
  
  const tClass = searchClass.value;
  ticketClassName.innerText = tClass === 'business' ? 'BUSINESS CLASS' : (tClass === 'premium' ? 'PREMIUM ECO' : 'ECONOMY CLASS');
  
  ticketOriginCode.innerText = originAirport.code;
  ticketOriginName.innerText = originAirport.name;
  
  ticketDestCode.innerText = destAirport.code;
  ticketDestName.innerText = destAirport.name;

  ticketPassengerName.innerText = checkFname.value.toUpperCase();
  ticketFlightNo.innerText = flight.flightNo;
  ticketSeatNo.innerText = AppState.booking.selectedSeat;

  const travelDate = new Date(searchDate.value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  ticketDepartDate.innerText = travelDate;

  const [depH, depM] = flight.departure.split(':').map(Number);
  let boardM = depM - 40;
  let boardH = depH;
  if (boardM < 0) {
    boardM += 60;
    boardH = (boardH - 1 + 24) % 24;
  }
  ticketBoardingTime.innerText = `${boardH.toString().padStart(2, '0')}:${boardM.toString().padStart(2, '0')}`;
  
  const gates = ['02-B', '04-A', '01-D', '08-A', '03-F'];
  const gateIndex = AppState.booking.selectedFlight.price % gates.length;
  ticketGate.innerText = gates[gateIndex];

  const totalSpeed = parseFloat(AppState.bookingSpeed);
  ticketSpeedTime.innerText = `${totalSpeed}s`;

  if (totalSpeed < 30) {
    ticketBadgeRank.innerText = 'PLATINUM OVERLORD (Sub-30s)';
    ticketBadgeRank.className = 'bubble-val text-cyan';
  } else if (totalSpeed < 45) {
    ticketBadgeRank.innerText = 'GOLD CHALLENGER (Sub-45s)';
    ticketBadgeRank.className = 'bubble-val text-green';
  } else if (totalSpeed < 60) {
    ticketBadgeRank.innerText = 'SILVER RACER (Sub-60s)';
    ticketBadgeRank.className = 'bubble-val text-purple';
  } else {
    ticketBadgeRank.innerText = 'OVERTIME GLIDE (60s+)';
    ticketBadgeRank.className = 'bubble-val text-muted';
  }
}


/* --- Boarding Pass Mouse 3D Parallax --- */

function initBoardingPassTilt() {
  const card = boardingPassTicket;
  const container = document.querySelector('.ticket-wrapper');

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((centerY - y) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease-out';
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });

  container.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
}


/* --- Notification Toasting Helpers --- */

function showNotification(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `notification-toast ${type === 'error' ? 'toast-error' : (type === 'success' ? 'toast-success' : '')}`;
  
  let icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  notificationContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
