

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'quickcourt_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testDatabaseConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    console.log('Database connected successfully at:', rows[0].now);
  } catch (err) {
    console.error('Database connection error:', err.stack);
  }
}

testDatabaseConnection();

// USER MANAGEMENT ENDPOINTS

app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user profile data
    const [userProfiles] = await pool.query(
      'SELECT * FROM user_profiles WHERE id = ?',
      [parseInt(userId)])
    
    
    if (userProfiles.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userProfile = userProfiles[0];
    
    // Parse JSON fields
    const formattedProfile = {
      ...userProfile,
      preferred_sports: JSON.parse(userProfile.preferred_sports || '[]'),
      skill_levels: JSON.parse(userProfile.skill_levels || '{}')
    };
    
    res.json(formattedProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});


app.post('/api/users/storenewuserdata', async (req, res) => {
  try {
    const { 
      email, full_name, phone_number, password, role, 
      otp_verified, selected_sports, skill_levels 
    } = req.body;
    
    // Check if user already exists
    const [userCheck] = await pool.query(
      'SELECT * FROM user_profiles WHERE email = ?',
      [email]
    );
    
    if (userCheck.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Insert new user with additional registration data
    const [result] = await pool.query(
      `INSERT INTO user_profiles 
       (email, full_name, phone_number, role, is_active, is_verified, 
        preferred_sports, skill_levels, registration_completed) 
       VALUES (?, ?, ?, ?, true, ?, ?, ?, true)`,
      [email, full_name, phone_number, role, otp_verified, JSON.stringify(selected_sports), JSON.stringify(skill_levels)]
    );
    
    res.status(201).json({
      message: 'User registration data stored successfully',
      user: {
        id: result.insertId,
        email,
        full_name,
        role
      }
    });
  } catch (error) {
    console.error('Error storing user registration data:', error);
    res.status(500).json({ error: 'Failed to store user registration data' });
  }
});

 //POST /api/users/verifyotp

app.post('/api/users/verifyotp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // For this example, we'll simulate OTP verification with a mock check
    const isValidOtp = otp === '123456' || otp.length === 6; 
    
    if (!isValidOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    res.json({
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});


app.post('/api/users/sendotp', async (req, res) => {
  try {
    const { email, phone_number } = req.body;
    
    const mockOtp = '123456'; 
    
    
    res.json({
      message: 'OTP sent successfully',
      otp: mockOtp
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * POST /api/users/register
 */
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, full_name, phone_number, password, role = 'customer' } = req.body;
    
    // Check if user already exists
    const [userCheck] = await pool.query(
      'SELECT * FROM user_profiles WHERE email = ?',
      [email]
    );
    
    if (userCheck.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO user_profiles 
       (email, full_name, phone_number, role, is_active, is_verified) 
       VALUES (?, ?, ?, ?, true, false)`,
      [email, full_name, phone_number, role]
    );
    
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        email,
        full_name,
        role
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// VENUE MANAGEMENT ENDPOINTS


app.post('/api/venues', async (req, res) => {
  try {
    const {
      name, description, address, city, state, zip_code,
      country, latitude, longitude, amenities, photos,
      opening_hours, contact_email, contact_phone, sports_offered
    } = req.body;
    
    // Insert venue data
    const [result] = await pool.query(
      `INSERT INTO venues 
       (name, description, address, city, state, zip_code, country, 
        latitude, longitude, amenities, photos, opening_hours, 
        contact_email, contact_phone, sports_offered, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)`,
      [name, description, address, city, state, zip_code, country, 
       latitude, longitude, JSON.stringify(amenities), JSON.stringify(photos), 
       JSON.stringify(opening_hours), contact_email, contact_phone, 
       JSON.stringify(sports_offered)]
    );
    
    res.status(201).json({
      message: 'Venue created successfully',
      venue_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({ error: 'Failed to create venue' });
  }
});

/**
 * GET /api/venues/:venueId
 */
app.get('/api/venues/:venueId', async (req, res) => {
  try {
    const { venueId } = req.params;
    
    const [venues] = await pool.query(
      'SELECT * FROM venues WHERE id = ?',
      [venueId]
    );
    
    if (venues.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    // Parse JSON fields
    const venue = venues[0];
    venue.amenities = JSON.parse(venue.amenities || '[]');
    venue.photos = JSON.parse(venue.photos || '[]');
    venue.opening_hours = JSON.parse(venue.opening_hours || '{}');
    venue.sports_offered = JSON.parse(venue.sports_offered || '[]');
    
    res.json(venue);
  } catch (error) {
    console.error('Error fetching venue details:', error);
    res.status(500).json({ error: 'Failed to fetch venue details' });
  }
});


/**
 * POST /api/venues/:venueId/courts
 */
app.post('/api/venues/:venueId/courts', async (req, res) => {
  try {
    const { venueId } = req.params;
    const {
      name, court_type, sport, surface_type, indoor,
      dimensions, features, hourly_rate, availability_schedule,
      image_url
    } = req.body;
    
    // Check if venue exists
    const [venues] = await pool.query(
      'SELECT id FROM venues WHERE id = ?',
      [venueId]
    );
    
    if (venues.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    // Insert court data
    const [result] = await pool.query(
      `INSERT INTO courts 
       (venue_id, name, court_type, sport, surface_type, indoor, 
        dimensions, features, hourly_rate, availability_schedule, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [venueId, name, court_type, sport, surface_type, indoor ? 1 : 0,
       JSON.stringify(dimensions), JSON.stringify(features), hourly_rate,
       JSON.stringify(availability_schedule), image_url]
    );
    
    res.status(201).json({
      message: 'Court added successfully',
      court_id: result.insertId
    });
  } catch (error) {
    console.error('Error adding court:', error);
    res.status(500).json({ error: 'Failed to add court' });
  }
});

/**
 * GET /api/venues/:venueId/courts
 */
app.get('/api/venues/:venueId/courts', async (req, res) => {
  try {
    const { venueId } = req.params;
    
    const [courts] = await pool.query(
      'SELECT * FROM courts WHERE venue_id = ?',
      [venueId]
    );
    
    // Parse JSON fields for each court
    const formattedCourts = courts.map(court => ({
      ...court,
      indoor: !!court.indoor, // Convert to boolean
      dimensions: JSON.parse(court.dimensions || '{}'),
      features: JSON.parse(court.features || '[]'),
      availability_schedule: JSON.parse(court.availability_schedule || '{}')
    }));
    
    res.json(formattedCourts);
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({ error: 'Failed to fetch courts' });
  }
});


/**
 * POST /api/bookings
 */
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      user_id, court_id, start_time, end_time, 
      total_price, status = 'pending', participants = []
    } = req.body;
    
    // Insert booking data
    const [result] = await pool.query(
      `INSERT INTO bookings 
       (user_id, court_id, start_time, end_time, total_price, 
        status, participants, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, court_id, start_time, end_time, total_price, 
       status, JSON.stringify(participants)]
    );
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/**
 * GET /api/users/:userId/bookings
 */
app.get('/api/users/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    let query = 'SELECT b.*, c.name as court_name, v.name as venue_name FROM bookings b '
              + 'JOIN courts c ON b.court_id = c.id '
              + 'JOIN venues v ON c.venue_id = v.id '
              + 'WHERE b.user_id = ?';
    
    const queryParams = [userId];
    
    if (status) {
      query += ' AND b.status = ?';
      queryParams.push(status);
    }
    
    query += ' ORDER BY b.start_time DESC';
    
    const [bookings] = await pool.query(query, queryParams);
    
    // Parse JSON fields
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      participants: JSON.parse(booking.participants || '[]')
    }));
    
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
});


/**
 * POST /api/payments
 */
app.post('/api/payments', async (req, res) => {
  try {
    const {
      booking_id, user_id, amount, payment_method,
      payment_status = 'completed', payment_details
    } = req.body;
    
    // Insert payment transaction
    const [result] = await pool.query(
      `INSERT INTO payment_transactions 
       (booking_id, user_id, amount, payment_method, payment_status, 
        payment_details, transaction_date) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [booking_id, user_id, amount, payment_method, 
       payment_status, JSON.stringify(payment_details)]
    );
    
    // Update booking status if payment is successful
    if (payment_status === 'completed') {
      await pool.query(
        'UPDATE bookings SET status = ? WHERE id = ?',
        ['confirmed', booking_id]
      );
    }
    
    res.status(201).json({
      message: 'Payment processed successfully',
      transaction_id: result.insertId,
      payment_status
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

/**
 * Add a new payment method for a user
 * POST /api/users/:userId/payment-methods
 */
app.post('/api/users/:userId/payment-methods', async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      card_number, card_holder_name, expiry_month, expiry_year,
      card_type, is_default = false 
    } = req.body;
    
    // Mask the card number for storage (keep only last 4 digits)
    const last4 = card_number.slice(-4);
    const maskedCardNumber = `**** **** **** ${last4}`;
    
    // If this is the first payment method or is_default is true, make it the default
    let makeDefault = is_default;
    
    if (!makeDefault) {
      const [existingMethods] = await pool.query(
        'SELECT COUNT(*) as count FROM user_payment_methods WHERE user_id = ?',
        [userId]
      );
      
      if (existingMethods[0].count === 0) {
        makeDefault = true;
      }
    }
    
    // If making this the default, unset any existing defaults
    if (makeDefault) {
      await pool.query(
        'UPDATE user_payment_methods SET is_default = false WHERE user_id = ?',
        [userId]
      );
    }
    
    // Insert the new payment method
    const [result] = await pool.query(
      `INSERT INTO user_payment_methods 
       (user_id, card_number, card_holder_name, expiry_month, 
        expiry_year, card_type, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, maskedCardNumber, card_holder_name, expiry_month, 
       expiry_year, card_type, makeDefault]
    );
    
    res.status(201).json({
      message: 'Payment method added successfully',
      payment_method_id: result.insertId,
      is_default: makeDefault
    });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

/**
 * Get user payment methods
 * GET /api/users/:userId/payment-methods
 */
app.get('/api/users/:userId/payment-methods', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [paymentMethods] = await pool.query(
      'SELECT * FROM user_payment_methods WHERE user_id = ?',
      [userId]
    );
    
    res.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

/**
 * Delete a payment method
 * DELETE /api/users/:userId/payment-methods/:paymentMethodId
 */
app.delete('/api/users/:userId/payment-methods/:paymentMethodId', async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.params;
    
    // Check if the payment method exists and belongs to the user
    const [paymentMethod] = await pool.query(
      'SELECT * FROM user_payment_methods WHERE id = ? AND user_id = ?',
      [paymentMethodId, userId]
    );
    
    if (paymentMethod.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    
    // Check if this is the default payment method
    const isDefault = paymentMethod[0].is_default;
    
    // Delete the payment method
    await pool.query(
      'DELETE FROM user_payment_methods WHERE id = ?',
      [paymentMethodId]
    );
    
    // If this was the default payment method, set a new default if any exist
    if (isDefault) {
      const [remainingMethods] = await pool.query(
        'SELECT id FROM user_payment_methods WHERE user_id = ? LIMIT 1',
        [userId]
      );
      
      if (remainingMethods.length > 0) {
        await pool.query(
          'UPDATE user_payment_methods SET is_default = true WHERE id = ?',
          [remainingMethods[0].id]
        );
      }
    }
    
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
});

/**
 * Set a payment method as default
 * PUT /api/users/:userId/payment-methods/:paymentMethodId/default
 */
app.put('/api/users/:userId/payment-methods/:paymentMethodId/default', async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.params;
    
    // Check if the payment method exists and belongs to the user
    const [paymentMethod] = await pool.query(
      'SELECT * FROM user_payment_methods WHERE id = ? AND user_id = ?',
      [paymentMethodId, userId]
    );
    
    if (paymentMethod.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    
    // Unset any existing defaults
    await pool.query(
      'UPDATE user_payment_methods SET is_default = false WHERE user_id = ?',
      [userId]
    );
    
    // Set the new default
    await pool.query(
      'UPDATE user_payment_methods SET is_default = true WHERE id = ?',
      [paymentMethodId]
    );
    
    res.json({ message: 'Default payment method updated successfully' });
  } catch (error) {
    console.error('Error updating default payment method:', error);
    res.status(500).json({ error: 'Failed to update default payment method' });
  }
});

// =====================================================================================
// ANALYTICS ENDPOINTS
// =====================================================================================

/**
 * Get venue analytics
 * GET /api/venues/:venueId/analytics
 */
app.get('/api/venues/:venueId/analytics', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { start_date, end_date, metrics } = req.query;
    
    // Validate date range
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    // Parse metrics to filter (if provided)
    const requestedMetrics = metrics ? metrics.split(',') : null;
    
    // Query analytics data for the venue within the date range
    const [analyticsData] = await pool.query(
      `SELECT * FROM venue_analytics 
       WHERE venue_id = ? AND date BETWEEN ? AND ? 
       ORDER BY date ASC`,
      [venueId, start_date, end_date]
    );
    
    if (analyticsData.length === 0) {
      return res.status(404).json({ error: 'No analytics data found for this venue in the specified date range' });
    }
    
    // Parse JSON fields and calculate summary metrics
    let totalViews = 0;
    let totalSearchAppearances = 0;
    let totalBookingConversionRate = 0;
    let totalBookingValue = 0;
    
    const formattedData = analyticsData.map(item => {
      // Parse JSON fields
      const peakBookingTimes = JSON.parse(item.peak_booking_times || '{}');
      const popularCourts = JSON.parse(item.popular_courts || '[]');
      
      // Update totals for summary
      totalViews += item.total_views || 0;
      totalSearchAppearances += item.search_appearances || 0;
      totalBookingConversionRate += item.booking_conversion_rate || 0;
      totalBookingValue += item.average_booking_value || 0;
      
      return {
        date: item.date,
        total_views: item.total_views,
        search_appearances: item.search_appearances,
        booking_conversion_rate: item.booking_conversion_rate,
        average_booking_value: item.average_booking_value,
        peak_booking_times: peakBookingTimes,
        popular_courts: popularCourts
      };
    });
    
    // Calculate averages for rates
    const avgBookingConversionRate = totalBookingConversionRate / analyticsData.length;
    const avgBookingValue = totalBookingValue / analyticsData.length;
    
    // Prepare trends data
    const viewsByDay = formattedData.map(item => ({
      date: item.date,
      views: item.total_views
    }));
    
    const searchAppearancesByDay = formattedData.map(item => ({
      date: item.date,
      appearances: item.search_appearances
    }));
    
    // Aggregate peak booking times across all days
    const aggregatedPeakTimes = {};
    formattedData.forEach(item => {
      Object.entries(item.peak_booking_times).forEach(([time, count]) => {
        aggregatedPeakTimes[time] = (aggregatedPeakTimes[time] || 0) + count;
      });
    });
    
    // Aggregate popular courts across all days
    const aggregatedPopularCourts = {};
    formattedData.forEach(item => {
      item.popular_courts.forEach(court => {
        aggregatedPopularCourts[court.court_id] = {
          court_id: court.court_id,
          court_name: court.court_name,
          bookings: (aggregatedPopularCourts[court.court_id]?.bookings || 0) + court.bookings
        };
      });
    });
    
    // Convert aggregated data to arrays and sort
    const peakBookingTimes = Object.entries(aggregatedPeakTimes)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => b.count - a.count);
    
    const popularCourts = Object.values(aggregatedPopularCourts)
      .sort((a, b) => b.bookings - a.bookings);
    
    // Prepare response with summary and trends
    const response = {
      summary: {
        total_views: totalViews,
        total_search_appearances: totalSearchAppearances,
        average_booking_conversion_rate: avgBookingConversionRate,
        average_booking_value: avgBookingValue
      },
      trends: {
        views_by_day: viewsByDay,
        search_appearances_by_day: searchAppearancesByDay,
        peak_booking_times: peakBookingTimes,
        popular_courts: popularCourts
      }
    };
    
    // Filter metrics if requested
    if (requestedMetrics) {
      const filteredResponse = { summary: {}, trends: {} };
      
      // Filter summary metrics
      Object.keys(response.summary).forEach(key => {
        if (requestedMetrics.includes(key.replace('total_', '').replace('average_', ''))) {
          filteredResponse.summary[key] = response.summary[key];
        }
      });
      
      // Filter trends
      Object.keys(response.trends).forEach(key => {
        const metricName = key.replace('_by_day', '').replace('peak_', '').replace('popular_', '');
        if (requestedMetrics.includes(metricName)) {
          filteredResponse.trends[key] = response.trends[key];
        }
      });
      
      res.json(filteredResponse);
    } else {
      res.json(response);
    }
  } catch (error) {
    console.error('Error fetching venue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch venue analytics' });
  }
});

/**
 * Store venue analytics data
 * POST /api/analytics/venueanalytics
 */
app.post('/api/analytics/venueanalytics', async (req, res) => {
  try {
    const {
      venue_id, date, total_views, search_appearances,
      booking_conversion_rate, average_booking_value,
      peak_booking_times, popular_courts
    } = req.body;
    
    // Check if an entry already exists for this venue and date
    const [existingEntry] = await pool.query(
      'SELECT id FROM venue_analytics WHERE venue_id = ? AND date = ?',
      [venue_id, date]
    );
    
    if (existingEntry.length > 0) {
      await pool.query(
        `UPDATE venue_analytics SET 
         total_views = ?, search_appearances = ?, 
         booking_conversion_rate = ?, average_booking_value = ?, 
         peak_booking_times = ?, popular_courts = ? 
         WHERE id = ?`,
        [total_views, search_appearances, booking_conversion_rate, 
         average_booking_value, JSON.stringify(peak_booking_times), 
         JSON.stringify(popular_courts), existingEntry[0].id]
      );
      
      res.json({
        message: 'Venue analytics data updated successfully',
        analytics_id: existingEntry[0].id
      });
    } else {
      // Insert new entry
      const [result] = await pool.query(
        `INSERT INTO venue_analytics 
         (venue_id, date, total_views, search_appearances, 
          booking_conversion_rate, average_booking_value, 
          peak_booking_times, popular_courts) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [venue_id, date, total_views, search_appearances, 
         booking_conversion_rate, average_booking_value, 
         JSON.stringify(peak_booking_times), JSON.stringify(popular_courts)]
      );
      
      res.status(201).json({
        message: 'Venue analytics data stored successfully',
        analytics_id: result.insertId
      });
    }
  } catch (error) {
    console.error('Error storing venue analytics data:', error);
    res.status(500).json({ error: 'Failed to store venue analytics data' });
  }
});


app.post('/api/venues/:venueId/reviews', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { user_id, rating, comment, photos = [] } = req.body;
    
    const [venues] = await pool.query(
      'SELECT id FROM venues WHERE id = ?',
      [venueId]
    );
    
    if (venues.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    // Insert review
    const [result] = await pool.query(
      `INSERT INTO reviews 
       (venue_id, user_id, rating, comment, photos, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [venueId, user_id, rating, comment, JSON.stringify(photos)]
    );
    
    await pool.query(
      `UPDATE venues v 
       SET rating = (SELECT AVG(rating) FROM reviews WHERE venue_id = ?), 
           review_count = (SELECT COUNT(*) FROM reviews WHERE venue_id = ?) 
       WHERE v.id = ?`,
      [venueId, venueId, venueId]
    );
    
    res.status(201).json({
      message: 'Review added successfully',
      review_id: result.insertId
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});


app.get('/api/venues/:venueId/reviews', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { limit = 10, offset = 0, sort_by = 'created_at', sort_order = 'desc' } = req.query;
    
    // Validate sort parameters
    const validSortFields = ['created_at', 'rating'];
    const validSortOrders = ['asc', 'desc'];
    
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortOrder = validSortOrders.includes(sort_order.toLowerCase()) ? sort_order : 'desc';
    
    // Get reviews with user information
    const [reviews] = await pool.query(
      `SELECT r.*, u.full_name as user_name, u.profile_picture 
       FROM reviews r 
       JOIN user_profiles u ON r.user_id = u.id 
       WHERE r.venue_id = ? 
       ORDER BY r.${sortField} ${sortOrder} 
       LIMIT ? OFFSET ?`,
      [venueId, parseInt(limit), parseInt(offset)]
    );
    
    // Get total count for pagination
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM reviews WHERE venue_id = ?',
      [venueId]
    );
    
    // Parse JSON fields
    const formattedReviews = reviews.map(review => ({
      ...review,
      photos: JSON.parse(review.photos || '[]')
    }));
    
    res.json({
      reviews: formattedReviews,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// =====================================================================================
// NOTIFICATION ENDPOINTS
// =====================================================================================

/**
 * Create a notification
 * POST /api/notifications
 */
app.post('/api/notifications', async (req, res) => {
  try {
    const { 
      user_id, type, title, message, 
      related_id = null, additional_data = {} 
    } = req.body;
    
    // Insert notification
    const [result] = await pool.query(
      `INSERT INTO notifications 
       (user_id, type, title, message, related_id, additional_data, is_read, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, false, NOW())`,
      [user_id, type, title, message, related_id, JSON.stringify(additional_data)]
    );
    
    res.status(201).json({
      message: 'Notification created successfully',
      notification_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

app.get('/api/users/:userId/notifications', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0, unread_only = false } = req.query;
    
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const queryParams = [userId];
    
    if (unread_only === 'true') {
      query += ' AND is_read = false';
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const [notifications] = await pool.query(query, queryParams);
    
    // Get unread count
    const [unreadCount] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
      [userId]
    );
    
    // Parse JSON fields
    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      additional_data: JSON.parse(notification.additional_data || '{}')
    }));
    
    res.json({
      notifications: formattedNotifications,
      unread_count: unreadCount[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});


app.put('/api/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Update notification
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = ?',
      [notificationId]
    );
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// SEARCH ENDPOINTS

/**
 * Search venues
 * GET /api/search/venues
 */
app.get('/api/search/venues', async (req, res) => {
  try {
    const { 
      query, city, sport, min_rating, 
      max_price, amenities, limit = 20, offset = 0 
    } = req.query;
    
    let sqlQuery = `
      SELECT v.*, 
             (SELECT COUNT(*) FROM courts c WHERE c.venue_id = v.id) as court_count 
      FROM venues v 
      WHERE v.is_active = true`;
    
    const queryParams = [];
    
    // Add search filters
    if (query) {
      sqlQuery += ` AND (v.name LIKE ? OR v.description LIKE ?)`;
      const searchTerm = `%${query}%`;
      queryParams.push(searchTerm, searchTerm);
    }
    
    if (city) {
      sqlQuery += ` AND v.city = ?`;
      queryParams.push(city);
    }
    
    if (sport) {
      sqlQuery += ` AND JSON_CONTAINS(v.sports_offered, ?)`;  // MySQL JSON function
      queryParams.push(`"${sport}"`);
    }
    
    if (min_rating) {
      sqlQuery += ` AND v.rating >= ?`;
      queryParams.push(parseFloat(min_rating));
    }
    
    if (max_price) {
      sqlQuery += ` AND v.id IN (
        SELECT DISTINCT venue_id FROM courts 
        WHERE hourly_rate <= ?
      )`;
      queryParams.push(parseFloat(max_price));
    }
    
    if (amenities) {
      const amenitiesList = amenities.split(',');
      amenitiesList.forEach(amenity => {
        sqlQuery += ` AND JSON_CONTAINS(v.amenities, ?)`; // MySQL JSON function
        queryParams.push(`"${amenity}"`);
      });
    }
    
    // Add sorting and pagination
    sqlQuery += ` ORDER BY v.rating DESC, v.review_count DESC 
                 LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute query
    const [venues] = await pool.query(sqlQuery, queryParams);
    
    // Get total count for pagination (without limit/offset)
    let countQuery = sqlQuery.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    countQuery = countQuery.split('ORDER BY')[0];
    const [countResult] = await pool.query(countQuery, queryParams.slice(0, -2));
    
    // Parse JSON fields
    const formattedVenues = venues.map(venue => ({
      ...venue,
      amenities: JSON.parse(venue.amenities || '[]'),
      photos: JSON.parse(venue.photos || '[]'),
      opening_hours: JSON.parse(venue.opening_hours || '{}'),
      sports_offered: JSON.parse(venue.sports_offered || '[]')
    }));
    
    res.json({
      venues: formattedVenues,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error searching venues:', error);
    res.status(500).json({ error: 'Failed to search venues' });
  }
});

/**
 * Get available courts for booking
 * GET /api/search/available-courts
 */
app.get('/api/search/available-courts', async (req, res) => {
  try {
    const { 
      venue_id, sport, date, start_time, end_time,
      min_price, max_price, limit = 20, offset = 0 
    } = req.query;
    
    if (!date || !start_time || !end_time) {
      return res.status(400).json({ error: 'Date, start time, and end time are required' });
    }
    
    // Build query to find available courts
    let sqlQuery = `
      SELECT c.*, v.name as venue_name, v.address, v.city, v.state, v.country 
      FROM courts c 
      JOIN venues v ON c.venue_id = v.id 
      WHERE 1=1`;
    
    const queryParams = [];
    
    // Add filters
    if (venue_id) {
      sqlQuery += ` AND c.venue_id = ?`;
      queryParams.push(venue_id);
    }
    
    if (sport) {
      sqlQuery += ` AND c.sport = ?`;
      queryParams.push(sport);
    }
    
    if (min_price) {
      sqlQuery += ` AND c.hourly_rate >= ?`;
      queryParams.push(parseFloat(min_price));
    }
    
    if (max_price) {
      sqlQuery += ` AND c.hourly_rate <= ?`;
      queryParams.push(parseFloat(max_price));
    }
    
    // Exclude courts that have bookings in the requested time slot
    sqlQuery += ` AND c.id NOT IN (
      SELECT court_id FROM bookings 
      WHERE date(start_time) = ? 
      AND (
        (start_time < ? AND end_time > ?) OR
        (start_time >= ? AND start_time < ?)
      )
      AND status IN ('confirmed', 'pending')
    )`;
    
    queryParams.push(
      date,
      end_time,
      start_time,
      start_time,
      end_time
    );
    
    // Add sorting and pagination
    sqlQuery += ` ORDER BY c.hourly_rate ASC 
                 LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute query
    const [courts] = await pool.query(sqlQuery, queryParams);
    
    // Get total count for pagination
    let countQuery = sqlQuery.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    countQuery = countQuery.split('ORDER BY')[0];
    const [countResult] = await pool.query(countQuery, queryParams.slice(0, -2));
    
    // Parse JSON fields
    const formattedCourts = courts.map(court => ({
      ...court,
      indoor: !!court.indoor,
      dimensions: JSON.parse(court.dimensions || '{}'),
      features: JSON.parse(court.features || '[]'),
      availability_schedule: JSON.parse(court.availability_schedule || '{}')
    }));
    
    res.json({
      courts: formattedCourts,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error searching available courts:', error);
    res.status(500).json({ error: 'Failed to search available courts' });
  }
});

// =====================================================================================
// FAVORITES ENDPOINTS
// =====================================================================================

/**
 * Add a venue to user favorites
 * POST /api/users/:userId/favorites
 */
app.post('/api/users/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const { venue_id } = req.body;
    
    // Check if already in favorites
    const [existingFavorite] = await pool.query(
      'SELECT * FROM user_favorites WHERE user_id = ? AND venue_id = ?',
      [userId, venue_id]
    );
    
    if (existingFavorite.length > 0) {
      return res.status(400).json({ error: 'Venue already in favorites' });
    }
    
    // Add to favorites
    await pool.query(
      'INSERT INTO user_favorites (user_id, venue_id, created_at) VALUES (?, ?, NOW())',
      [userId, venue_id]
    );
    
    res.status(201).json({ message: 'Venue added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add venue to favorites' });
  }
});

/**
 * Remove a venue from user favorites
 * DELETE /api/users/:userId/favorites/:venueId
 */
app.delete('/api/users/:userId/favorites/:venueId', async (req, res) => {
  try {
    const { userId, venueId } = req.params;
    
    // Remove from favorites
    await pool.query(
      'DELETE FROM user_favorites WHERE user_id = ? AND venue_id = ?',
      [userId, venueId]
    );
    
    res.json({ message: 'Venue removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove venue from favorites' });
  }
});

/**
 * Get user favorites
 * GET /api/users/:userId/favorites
 */
app.get('/api/users/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get favorites with venue details
    const [favorites] = await pool.query(
      `SELECT f.*, v.* 
       FROM user_favorites f 
       JOIN venues v ON f.venue_id = v.id 
       WHERE f.user_id = ? 
       ORDER BY f.created_at DESC`,
      [userId]
    );
    
    const formattedFavorites = favorites.map(favorite => ({
      ...favorite,
      amenities: JSON.parse(favorite.amenities || '[]'),
      photos: JSON.parse(favorite.photos || '[]'),
      opening_hours: JSON.parse(favorite.opening_hours || '{}'),
      sports_offered: JSON.parse(favorite.sports_offered || '[]')
    }));
    
    res.json(formattedFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`QuickCourt API server running on port ${PORT}`);
});