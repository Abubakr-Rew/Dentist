-- Run this file once to create all tables
-- psql -U <user> -d <dbname> -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)        NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255)      NOT NULL,
  phone       VARCHAR(50),
  role        VARCHAR(20)         NOT NULL CHECK (role IN ('patient', 'clinic')),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clinics (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(255)  NOT NULL,
  city        VARCHAR(100)  NOT NULL,
  phone       VARCHAR(50),
  rating      DECIMAL(3,1)  DEFAULT 5.0,
  image       VARCHAR(500),
  description TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dentists (
  id               SERIAL PRIMARY KEY,
  clinic_id        INTEGER REFERENCES clinics(id) ON DELETE CASCADE,
  name             VARCHAR(255) NOT NULL,
  specialization   VARCHAR(100) NOT NULL,
  photo            VARCHAR(500),
  experience       INTEGER DEFAULT 0,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id               SERIAL PRIMARY KEY,
  dentist_id       INTEGER REFERENCES dentists(id) ON DELETE CASCADE,
  name             VARCHAR(255) NOT NULL,
  price            INTEGER      NOT NULL,
  duration_minutes INTEGER      NOT NULL,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS time_slots (
  id          SERIAL PRIMARY KEY,
  dentist_id  INTEGER REFERENCES dentists(id) ON DELETE CASCADE,
  date        DATE    NOT NULL,
  start_time  TIME    NOT NULL,
  end_time    TIME    NOT NULL,
  is_booked   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE (dentist_id, date, start_time)
);

CREATE TABLE IF NOT EXISTS appointments (
  id           SERIAL PRIMARY KEY,
  patient_id   INTEGER REFERENCES users(id)     ON DELETE SET NULL,
  clinic_id    INTEGER REFERENCES clinics(id)   ON DELETE CASCADE,
  dentist_id   INTEGER REFERENCES dentists(id)  ON DELETE CASCADE,
  service_id   INTEGER REFERENCES services(id)  ON DELETE SET NULL,
  time_slot_id INTEGER REFERENCES time_slots(id) ON DELETE SET NULL,
  date         DATE    NOT NULL,
  start_time   TIME    NOT NULL,
  end_time     TIME    NOT NULL,
  status       VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at   TIMESTAMP DEFAULT NOW()
);
