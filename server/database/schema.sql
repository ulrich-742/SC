-- =============================================================================
-- 1. TABLES INDÉPENDANTES (Niveau 0)
-- =============================================================================

CREATE TABLE users (
    id_user INT AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    forget_password VARCHAR(255) DEFAULT NULL,
    user_type VARCHAR(20) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT '/uploads/avatars/default-avatar.png',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20) DEFAULT NULL,
    birthday DATE DEFAULT NULL,
    genre VARCHAR(20) DEFAULT NULL,
    annotations TEXT DEFAULT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id_user)
);

CREATE TABLE event (
    id_event INT AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'brouillon', -- brouillon, publié, plannifié, terminé
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    CONSTRAINT pk_event PRIMARY KEY (id_event)
);

CREATE TABLE prestation (
    id_prestation INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    duration_minutes INT NOT NULL,
    CONSTRAINT pk_prestation PRIMARY KEY (id_prestation)
);

-- =============================================================================
-- 2. TABLES EN HÉRITAGE (Profils Utilisateurs - Niveau 1)
-- =============================================================================

CREATE TABLE admin (
    id_user INT,
    access_level INT NOT NULL DEFAULT 1,
    CONSTRAINT pk_admin PRIMARY KEY (id_user),
    CONSTRAINT fk_admin_users FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE customer (
    id_user INT,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    adress VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Actif',
    CONSTRAINT pk_customer PRIMARY KEY (id_user),
    CONSTRAINT fk_customer_users FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE barber (
    id_user INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    adress VARCHAR(255) NOT NULL,
    delivery_radius INT NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'En attente', -- pending, active, suspended
    CONSTRAINT pk_barber PRIMARY KEY (id_user),
    CONSTRAINT fk_barber_users FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- =============================================================================
-- 3. ENCADREMENT OPÉRATIONNEL (Planning & Portfolio - Niveau 2)
-- =============================================================================

CREATE TABLE barber_portfolio (
    id_picture INT AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    title VARCHAR(100) DEFAULT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_user INT NOT NULL, -- Clé étrangère pointant vers le coiffeur
    CONSTRAINT pk_barber_portfolio PRIMARY KEY (id_picture),
    CONSTRAINT fk_portfolio_barber FOREIGN KEY (id_user) REFERENCES barber(id_user) ON DELETE CASCADE
);

CREATE TABLE barber_availability (
    id_availability INT AUTO_INCREMENT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    id_user INT NOT NULL,  -- Clé étrangère pointant vers le coiffeur
    id_event INT DEFAULT NULL, -- Optionnel (0,1) : rattaché à un événement
    CONSTRAINT pk_barber_availability PRIMARY KEY (id_availability),
    CONSTRAINT fk_availability_barber FOREIGN KEY (id_user) REFERENCES barber(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_availability_event FOREIGN KEY (id_event) REFERENCES event(id_event) ON DELETE SET NULL
);

-- =============================================================================
-- 4. FLUX D'ACTIVITÉ (Réservations & Avis - Niveau 3)
-- =============================================================================

CREATE TABLE appointment (
    id_appointment INT AUTO_INCREMENT,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'En attente',
    location_type VARCHAR(50) NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_prestation INT NOT NULL,
    id_user_barber INT NOT NULL,   -- Coiffeur ayant reçu le RDV
    id_user_customer INT NOT NULL, -- Client ayant pris le RDV
    -- id_availability INT NOT NULL, -- Ajout Thomas
    -- CONSTRAINT fk_barber_availability FOREIGN KEY (id_availability) REFERENCES barber_availability(id_availability), -- Thomas
    CONSTRAINT pk_appointment PRIMARY KEY (id_appointment),
    CONSTRAINT fk_appointment_prestation FOREIGN KEY (id_prestation) REFERENCES prestation(id_prestation) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_barber FOREIGN KEY (id_user_barber) REFERENCES barber(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_customer FOREIGN KEY (id_user_customer) REFERENCES customer(id_user) ON DELETE CASCADE
);

CREATE TABLE review (
    id_review INT AUTO_INCREMENT,
    rating INT NOT NULL,
    comment TEXT,
    reporting BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_appointment INT NOT NULL, -- Lié à un rendez-vous (0,1)
    CONSTRAINT pk_review PRIMARY KEY (id_review),
    CONSTRAINT fk_review_appointment FOREIGN KEY (id_appointment) REFERENCES appointment(id_appointment) ON DELETE CASCADE,
    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5)
);

-- =============================================================================
-- 5. TABLE DE JONCTION (Relation N:M - Niveau 2)
-- =============================================================================

CREATE TABLE propose (
    id_user INT,          -- Clé étrangère vers barber
    id_prestation INT,    -- Clé étrangère vers prestation
    CONSTRAINT pk_propose PRIMARY KEY (id_user, id_prestation),
    CONSTRAINT fk_propose_barber FOREIGN KEY (id_user) REFERENCES barber(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_propose_prestation FOREIGN KEY (id_prestation) REFERENCES prestation(id_prestation) ON DELETE CASCADE
);


-- =============================================================================
-- 1. INSERTIONS DANS LA TABLE USERS (Connexions)
-- =============================================================================
-- Mots de passe fictifs (simulant un hachage)
INSERT INTO users (id_user, email, password, user_type, avatar_url) VALUES
(1, 'admin.coupe@barberapp.com', '$2y$10$xyzAdminPasswordHashed', 'admin', 'admin-avatar.png'),
(2, 'jean.dupont@gmail.com', '$2y$10$xyzCustomer1PasswordHashed', 'customer', 'customer-jean.png'),
(3, 'lucie.martin@yahoo.fr', '$2y$10$xyzCustomer2PasswordHashed', 'customer', 'customer-lucie.png'),
(4, 'thomas.thebarber@outlook.com', '$2y$10$xyzBarber1PasswordHashed', 'barber', 'barber-thomas.png'),
(5, 'maxime.gradient@gmail.com', '$2y$10$xyzBarber2PasswordHashed', 'barber', 'barber-maxime.png');

-- =============================================================================
-- 2. INSERTIONS DES PROFILS (Héritage)
-- =============================================================================
-- Profil Admin
INSERT INTO admin (id_user, access_level) VALUES 
(1, 3);

-- Profils Clients (id_user 2 et 3)
INSERT INTO customer (id_user, firstname, lastname, postal_code, city, adress) VALUES
(2, 'Jean', 'Dupont', '33000', 'Bordeaux', '12 Rue Sainte-Catherine'),
(3, 'Lucie', 'Martin', '33400', 'Talence', '45 Avenue de l''Université');

-- Profils Coiffeurs (id_user 4 et 5)
INSERT INTO barber (id_user, name, description, postal_code, city, adress, delivery_radius, status) VALUES
(4, 'Thomas The Barber', 'Spécialiste du dégradé américain et de la taille de barbe traditionnelle. 10 ans d''expérience.', '33000', 'Bordeaux', '8 Place de la Victoire', 15, 'Actif'),
(5, 'Maxime Gradient', 'Expert coloriste pour homme et coiffure vintage (styles rétro pompadour).', '33100', 'Bordeaux', '102 Rue de la Benauge', 10, 'Actif');

-- =============================================================================
-- 3. INSERTIONS DES PRESTATIONS ET ÉVÉNEMENTS
-- =============================================================================
-- Catalogue général des prestations
INSERT INTO prestation (id_prestation, name, price, duration_minutes) VALUES
(1, 'Coupe Homme Classique', 25.00, 30),
(2, 'Dégradé Américain (Fade)', 30.00, 45),
(3, 'Taille de Barbe & Soin serviette chaude', 20.00, 30),
(4, 'Formule Coupe + Barbe', 45.00, 60),
(5, 'Coloration / Décoloration', 55.00, 90);

-- Événements créés par l'Admin
INSERT INTO event (id_event, title,image_url, description,status, start_date, end_date, location) VALUES
(1, 'Festival Rock & Barber 2026','https://beautyimages.bobitstudios.com/upload/_migratedbeauty/post/barberexpo-main-__-1000x784-s.JPG', 'Le plus grand rassemblement de coiffeurs et de musique rock de la région.', 'publié', '2026-07-11 10:00:00', '2026-07-12 20:00:00', 'Hangar 14, Quai des Chartrons, Bordeaux'),
(2, 'Salon du Mariage Bordeaux','https://i.pinimg.com/736x/88/24/19/8824192fe1843a00b04c854b6febda9b.jpg', 'Espace mise en beauté pour les futurs mariés.', 'brouillon', '2026-10-24 09:00:00', '2026-10-25 18:00:00', 'Parc des Expositions, Bordeaux');

-- =============================================================================
-- 4. ASSOCIATIONS PRESTATIONS COIFFEURS (Table Propose)
-- =============================================================================
-- Thomas (4) propose Coupe classique, Dégradé, Barbe et Formule complète
INSERT INTO propose (id_user, id_prestation) VALUES 
(4, 1), (4, 2), (4, 3), (4, 4);

-- Maxime (5) propose Coupe classique, Barbe et Coloration
INSERT INTO propose (id_user, id_prestation) VALUES 
(5, 1), (5, 3), (5, 5);

-- =============================================================================
-- 5. PLANNING ET DISPONIBILITÉS (Barber Availability)
-- =============================================================================
INSERT INTO barber_availability (id_availability, start_time, end_time, is_booked, id_user, id_event) VALUES
-- Thomas : journée normale à son salon / domicile (Pas d'événement)
(1, '2026-06-02 09:00:00', '2026-06-02 10:00:00', TRUE, 4, NULL), -- Déjà réservé
(2, '2026-06-02 10:00:00', '2026-06-02 11:00:00', FALSE, 4, NULL),
(3, '2026-06-02 11:00:00', '2026-06-02 12:00:00', FALSE, 4, NULL),
-- Thomas : créneaux bloqués pour le Festival Rock (id_event = 1)
(4, '2026-07-11 14:00:00', '2026-07-11 15:00:00', TRUE, 4, 1),  -- Déjà réservé au festival
(5, '2026-07-11 15:00:00', '2026-07-11 16:00:00', FALSE, 4, 1),
-- Maxime : journée classique
(6, '2026-06-02 14:00:00', '2026-06-02 15:00:00', TRUE, 5, NULL); -- Déjà réservé

-- =============================================================================
-- 6. FLUX DES RENDEZ-VOUS (Appointement)
-- =============================================================================
INSERT INTO appointment (
    id_appointment,
    -- id_availability,
    appointment_date,
    status,
    location_type,
    id_prestation,
    id_user_barber,
    id_user_customer
) VALUES
(1,  '2026-05-20 10:00:00', 'terminé', 'salon', 2, 4, 2),
(2,  '2026-07-11 14:00:00', 'confirmé', 'event', 4, 4, 3),
(3,  '2026-05-22 14:30:00', 'terminé', 'domicile', 1, 5, 2);
-- =============================================================================
-- 7. NOTATIONS ET AVIS (Review)
-- =============================================================================
INSERT INTO review (id_review, rating, comment, created_at, id_appointment) VALUES
-- Jean laisse un avis sur son dégradé fait par Thomas (RDV n°1)
(1, 5, 'Excellent coiffeur, dégradé ultra propre et précis. Je reviendrai sans hésiter !', '2026-05-20 11:15:00', 1),
-- Jean laisse un avis plus mitigé sur Maxime (RDV n°3)
(2, 3, 'Coupe correcte, mais un peu de retard sur l''horaire prévu à mon domicile.', '2026-05-22 16:00:00', 3);

-- =============================================================================
-- 8. PORTFOLIO DES COIFFEURS (Photos de réalisations)
-- =============================================================================
INSERT INTO barber_portfolio (id_picture, image_url, title, id_user) VALUES
(1, 'uploads/portfolio/fade1.jpg', 'Dégradé à blanc parfait', 4),
(2, 'uploads/portfolio/beard1.jpg', 'Taille de barbe sculptée', 4),
(3, 'uploads/portfolio/retro1.jpg', 'Coupe Pompadour Vintage', 5);
