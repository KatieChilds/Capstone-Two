-- Both test users have the password "password"

-- Insert data into database as a starting point and to check functionality

INSERT INTO users (username, password, first_name, last_name, email, city, country)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'test',
        'user',
        'test@email.com',
        'ottawa',
        'canada'),
        ('demouser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'demo',
        'user',
        'demo@email.com',
        'ottawa',
        'canada');

INSERT INTO children (parent_username, age, gender)
VALUES ('demouser',
        3,
        'male');

INSERT INTO friends (user_friending_username, user_friended_username)
VALUES ('demouser', 'testuser');
