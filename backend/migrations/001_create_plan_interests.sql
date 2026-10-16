
CREATE TABLE IF NOT EXISTS plan_interests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    plan_id INT UNSIGNED NOT NULL,

    client_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(254) NOT NULL,

    preferred_date DATE NOT NULL,
    experience_level VARCHAR(20),

    consent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,

    status VARCHAR(20) NOT NULL DEFAULT 'pending',

    idempotency_key CHAR(36) NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_plan_interests_plan
        FOREIGN KEY (plan_id)
        REFERENCES plans(id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
