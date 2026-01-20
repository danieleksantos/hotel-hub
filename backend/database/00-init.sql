CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,  
    stars INTEGER CHECK (stars BETWEEN 1 AND 5),
    description TEXT,
    total_rooms INTEGER NOT NULL,
    photo_url TEXT,                 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), 
    responsible_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,          
    end_date DATE NOT NULL,           
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE, 
    name VARCHAR(255) NOT NULL,        
    document VARCHAR(50) NOT NULL,     
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password_hash) 
VALUES ('admin', '$2b$10$uk2bq3gM5bmxSmxq1/c7n.3sfvz2jWzeWaE4jZ9ASeAN8oM74tiT6') 
ON CONFLICT (username) DO NOTHING;