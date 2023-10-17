-- Both test users have the password "password"

-- Insert data into database as a starting point and to check functionality

INSERT INTO users (username, password, first_name, last_name, email, lat, lng)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'test',
        'user',
        'test@email.com',
        45.4215296,
        -75.69719309999999
        ),
        ('demouser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'demo',
        'user',
        'demo@email.com',
        45.4215296,
        -75.69719309999999);

INSERT INTO children (parent_username, dob, gender)
VALUES ('demouser',
        '2020-12-30',
        'male');

INSERT INTO friends (user_friending_username, user_friended_username)
VALUES ('demouser', 'testuser');
