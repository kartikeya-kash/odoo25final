CREATE DATABASE IF NOT EXISTS quickcourt_db;
USE quickcourt_db;

CREATE TABLE user_profiles (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  bio TEXT,
  city VARCHAR(100),
  state_province VARCHAR(100),
  country VARCHAR(100),
  preferred_sports JSON,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP NULL,
  total_bookings INT DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE user_addresses (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  address_type VARCHAR(50) NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

CREATE TABLE venues (
  id CHAR(36) PRIMARY KEY,
  owner_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  venue_type VARCHAR(100) NOT NULL,
  sports_offered JSON NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cover_image_url TEXT,
  logo_url TEXT,
  gallery_images JSON,
  operating_hours JSON,
  base_hourly_rate DECIMAL(10, 2) NOT NULL,
  amenities JSON,
  phone_number VARCHAR(50),
  email VARCHAR(255),
  website_url TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES user_profiles(id)
);

CREATE TABLE courts (
  id CHAR(36) PRIMARY KEY,
  venue_id CHAR(36) NOT NULL,
  court_number INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  sport_type VARCHAR(100) NOT NULL,
  surface_material VARCHAR(100),
  max_capacity INT,
  is_indoor BOOLEAN DEFAULT FALSE,
  description TEXT,
  amenities JSON,
  image_url TEXT,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  peak_hour_rate DECIMAL(10, 2),
  weekend_rate DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(venue_id, court_number),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
  id CHAR(36) PRIMARY KEY,
  confirmation_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id CHAR(36),
  venue_id CHAR(36) NOT NULL,
  court_id CHAR(36) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INT NOT NULL,
  sport_type VARCHAR(100) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  base_rate DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  special_requests TEXT,
  promo_code VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES user_profiles(id),
  FOREIGN KEY (venue_id) REFERENCES venues(id),
  FOREIGN KEY (court_id) REFERENCES courts(id)
);

CREATE TABLE payment_transactions (
  id CHAR(36) PRIMARY KEY,
  booking_id CHAR(36) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  card_last_four VARCHAR(4),
  card_brand VARCHAR(50),
  billing_address_id CHAR(36),
  refund_amount DECIMAL(10, 2) DEFAULT 0.00,
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (billing_address_id) REFERENCES user_addresses(id)
);

CREATE TABLE reviews (
  id CHAR(36) PRIMARY KEY,
  venue_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  booking_id CHAR(36),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  comment TEXT,
  cleanliness_rating INT CHECK (cleanliness_rating BETWEEN 1 AND 5),
  staff_rating INT CHECK (staff_rating BETWEEN 1 AND 5),
  value_rating INT CHECK (value_rating BETWEEN 1 AND 5),
  equipment_rating INT CHECK (equipment_rating BETWEEN 1 AND 5),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(venue_id, user_id, booking_id),
  FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  related_id CHAR(36),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

CREATE TABLE platform_analytics (
  id CHAR(36) PRIMARY KEY,
  date DATE NOT NULL,
  total_bookings INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0.00,
  new_users INT DEFAULT 0,
  active_venues INT DEFAULT 0,
  popular_sports JSON,
  peak_booking_hours JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date)
);

DELIMITER //
CREATE FUNCTION generate_uuid() 
RETURNS CHAR(36) DETERMINISTIC
BEGIN
  RETURN UUID();
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_venue_rating_trigger
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  UPDATE venues
  SET 
    average_rating = (SELECT AVG(rating) FROM reviews WHERE venue_id = NEW.venue_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE venue_id = NEW.venue_id),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.venue_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_venue_rating_update_trigger
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
  UPDATE venues
  SET 
    average_rating = (SELECT AVG(rating) FROM reviews WHERE venue_id = NEW.venue_id),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE venue_id = NEW.venue_id),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.venue_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_user_booking_stats_trigger
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status <> 'confirmed') THEN
    UPDATE user_profiles
    SET 
      total_bookings = total_bookings + 1,
      total_spent = total_spent + NEW.total_amount,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.customer_id;
  END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_platform_analytics_trigger
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
  IF NEW.status = 'confirmed' THEN
    INSERT INTO platform_analytics (id, date, total_bookings, total_revenue)
    VALUES (UUID(), CURDATE(), 1, NEW.total_amount)
    ON DUPLICATE KEY UPDATE
      total_bookings = total_bookings + 1,
      total_revenue = total_revenue + NEW.total_amount;
  END IF;
END //
DELIMITER ;

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

CREATE INDEX idx_venues_owner ON venues(owner_id);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_rating ON venues(average_rating);

CREATE INDEX idx_courts_venue ON courts(venue_id);
CREATE INDEX idx_courts_sport ON courts(sport_type);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_venue ON bookings(venue_id);
CREATE INDEX idx_bookings_court ON bookings(court_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE INDEX idx_payments_booking ON payment_transactions(booking_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);

CREATE INDEX idx_reviews_venue ON reviews(venue_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);