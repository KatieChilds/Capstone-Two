-- Create tables for database
CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    avatar TEXT DEFAULT('user_default_avatar.png'),
    token TEXT 
);

CREATE TABLE children (
    id SERIAL PRIMARY KEY,
    parent_username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL
);

CREATE TABLE friends (
    user_friending_username VARCHAR(25) 
        REFERENCES users ON DELETE CASCADE,
    user_friended_username VARCHAR(25) 
        REFERENCES users ON DELETE CASCADE,
    PRIMARY KEY (user_friending_username, user_friended_username) 
);

CREATE TABLE places (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat TEXT NOT NULL,
    lng TEXT NOT NULL,
    type TEXT
);

CREATE TABLE users_places (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL 
        REFERENCES users ON DELETE CASCADE,
    place_id TEXT NOT NULL 
        REFERENCES places ON DELETE CASCADE
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    place_id TEXT NOT NULL
        REFERENCES places ON DELETE CASCADE,
    bathroom BOOLEAN,
    changing_table BOOLEAN,
    highchair BOOLEAN,
    parking BOOLEAN,
    other_notes TEXT,
    stars INT NOT NULL CHECK(stars > 0 AND stars <= 5),
    timestamp TIMESTAMP NOT NULL DEFAULT(NOW())
);

CREATE TABLE dates (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL
        REFERENCES users ON DELETE CASCADE,
    place_id TEXT NOT NULL
        REFERENCES places ON DELETE CASCADE,
    date TIMESTAMP NOT NULL 
);