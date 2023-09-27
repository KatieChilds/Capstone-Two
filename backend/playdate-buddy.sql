-- Drop and create app database
DROP DATABASE playdate_buddy;
CREATE DATABASE playdate_buddy;
\connect playdate_buddy

\i playdate-buddy-schema.sql
\i playdate-buddy-seed.sql

-- Drop and create test database
DROP DATABASE playdate_buddy_test;
CREATE DATABASE playdate_buddy_test;
\connect playdate_buddy_test

\i playdate-buddy-schema.sql