
Use o_pass;

SHOW VARIABLES LIKE 'character_set%';
SHOW TABLE STATUS WHERE Name = 'users';

ALTER DATABASE aichatbotproject CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE users (
    user_no INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    branch_id VARCHAR(255) NOT NULL,
    auth_code VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    user_no INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    branch_id VARCHAR(255) NOT NULL,
    auth_code VARCHAR(255) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER DATABASE aichatbotproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER DATABASE aichatbotproject CHARACTER SET utf8 COLLATE utf8_general_ci;

DROP TABLE users;

INSERT INTO users (user_name, password, branch_id, auth_code)
VALUES ('john_doe', 'password123', 'branch001', 'auth001'),
       ('jane_doe', 'password456', 'branch002', 'auth002'),
       ('alice_smith', 'password789', 'branch003', 'auth003');

SELECT * FROM users;

COMMIT;