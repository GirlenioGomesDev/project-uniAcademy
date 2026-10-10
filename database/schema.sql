-- MySQL 8.0+ / Workbench. Reexecução preserva solicitações e alterações comerciais.
CREATE DATABASE IF NOT EXISTS uniacademy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uniacademy_db;
CREATE TABLE IF NOT EXISTS plans (
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, name VARCHAR(40) NOT NULL UNIQUE,
 price DECIMAL(10,2) NOT NULL, duration_months SMALLINT UNSIGNED NOT NULL DEFAULT 1,
 payment_terms VARCHAR(255) NOT NULL, benefits JSON NOT NULL,
 is_featured BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT chk_price CHECK(price>=0)
);
CREATE TABLE IF NOT EXISTS modalities (
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, name VARCHAR(80) NOT NULL UNIQUE,
 description TEXT NOT NULL, image_url VARCHAR(500) NOT NULL, schedule_summary VARCHAR(255) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS schedules (
 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, weekday TINYINT UNSIGNED NOT NULL,
 modality_name VARCHAR(80) NOT NULL, time_slot VARCHAR(20) NOT NULL,
 instructor VARCHAR(120) NOT NULL, room VARCHAR(80) NOT NULL,
 UNIQUE KEY uq_schedule(weekday,modality_name,time_slot),
 FOREIGN KEY(modality_name) REFERENCES modalities(name) ON UPDATE CASCADE,
 CONSTRAINT chk_weekday CHECK(weekday BETWEEN 1 AND 7)
);
CREATE TABLE IF NOT EXISTS trial_requests (
 id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT, client_name VARCHAR(120) NOT NULL,
 phone VARCHAR(13) NOT NULL, email VARCHAR(254) NOT NULL, preferred_modality VARCHAR(80) NOT NULL,
 status ENUM('pending','contacted','confirmed','cancelled') NOT NULL DEFAULT 'pending',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(preferred_modality) REFERENCES modalities(name) ON UPDATE CASCADE,
 INDEX idx_trial_status_created(status,created_at)
);
INSERT INTO plans(id,name,price,duration_months,payment_terms,benefits,is_featured) VALUES
 (1,'Light',79.90,1,'Mensal • Pix ou cartão • sem fidelidade',JSON_ARRAY('Musculação e cardio','Acesso das 10h às 16h, seg–sex','Orientação no salão','Sem taxa de adesão'),0),
 (2,'Plus',99.90,1,'Mensal • Pix ou cartão • sem fidelidade',JSON_ARRAY('Musculação e cardio','Todos os horários de funcionamento','Funcional e dança','Sem taxa de adesão'),1),
 (3,'MegaPlus',119.90,1,'Mensal • Pix ou cartão • sem fidelidade',JSON_ARRAY('Tudo do Plus','Aulas de lutas','Avaliação física inicial','Reavaliação trimestral enquanto ativo'),0),
 (4,'Day-use',24.90,0,'Pagamento único • válido para um dia',JSON_ARRAY('Musculação e cardio','Aulas conforme disponibilidade','Orientação no salão','Sem compromisso mensal'),0)
ON DUPLICATE KEY UPDATE id=plans.id;
INSERT INTO modalities(id,name,description,image_url,schedule_summary) VALUES
 (1,'Musculação','Força e evolução com orientação em cada etapa.','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85','Durante todo o funcionamento'),
 (2,'Funcional','Movimento, resistência e energia em grupo.','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=85','Seg–sex • 07h e 18h30'),
 (3,'Dança','Seu ritmo encontra um espaço para acontecer.','https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85','Seg, qua e sex • 19h'),
 (4,'Lutas','Técnica, foco e condicionamento para iniciantes.','https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=85','Ter e qui • 19h30')
ON DUPLICATE KEY UPDATE id=modalities.id;
INSERT INTO schedules(weekday,modality_name,time_slot,instructor,room) VALUES
 (1,'Funcional','07:00','Ana Costa','Sala funcional'),(1,'Dança','19:00','Camila Santos','Estúdio'),
 (2,'Funcional','18:30','Ana Costa','Sala funcional'),(2,'Lutas','19:30','Rafael Lima','Sala de lutas'),
 (3,'Funcional','07:00','Bruno Alves','Sala funcional'),(3,'Dança','19:00','Camila Santos','Estúdio'),
 (4,'Funcional','18:30','Ana Costa','Sala funcional'),(4,'Lutas','19:30','Rafael Lima','Sala de lutas'),
 (5,'Dança','19:00','Camila Santos','Estúdio'),(6,'Funcional','09:00','Bruno Alves','Sala funcional')
ON DUPLICATE KEY UPDATE id=schedules.id;
