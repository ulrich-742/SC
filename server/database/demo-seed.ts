/**
 * DEMO SEED — données fictives pour la démonstration du projet
 *
 * Commande : npm run db:demo
 *
 * Comptes barbers (mot de passe : Demo1234!) :
 *  - thomas@secare.fr      → Bordeaux
 *  - maxime@secare.fr      → Bordeaux
 *  - sofiane@secare.fr     → Bordeaux
 *  - rafik@secare.fr       → Paris 18e
 *  - kevin@secare.fr       → Paris 11e
 *  - ibrahim@secare.fr     → Paris 10e
 *  - jordan@secare.fr      → Paris 8e
 *  - mehdi@secare.fr       → Lyon
 *  - leo@secare.fr         → Lyon
 *  - samir@secare.fr       → Marseille
 *  - julien@secare.fr      → Marseille
 *  - nabil@secare.fr       → Lille
 *  - theo@secare.fr        → Lille
 *  - cedric@secare.fr      → Strasbourg
 *  - youssef@secare.fr     → Strasbourg
 *  - xavier@secare.fr      → Nantes
 *  - killian@secare.fr     → Nantes
 *  - rayan@secare.fr       → Toulouse
 *  - lucas@secare.fr       → Toulouse
 *  - pierre@secare.fr      → Nice
 *  - ali@secare.fr         → Nice
 *  - tony@secare.fr        → Rennes
 *  - enzo@secare.fr        → Montpellier
 *  - bilal@secare.fr       → Grenoble
 *  - hugo@secare.fr        → Dijon
 *  - adam@secare.fr        → Rouen
 *  - nassim@secare.fr      → Clermont-Ferrand
 *  - dylan@secare.fr       → Reims
 *  - mathieu@secare.fr     → Metz
 *  - florian@secare.fr     → Tours
 *
 * Comptes clients : jean.dupont@gmail.com ... (mot de passe : Demo1234!)
 * Compte admin   : è
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import argon2 from "argon2";
import database from "./client";

const demo = async () => {
  try {
    console.info("🗑️  Nettoyage des tables...");

    await database.query("SET FOREIGN_KEY_CHECKS = 0");
    await database.query("TRUNCATE TABLE review");
    await database.query("TRUNCATE TABLE appointment");
    await database.query("TRUNCATE TABLE barber_portfolio");
    await database.query("TRUNCATE TABLE barber_availability");
    await database.query("TRUNCATE TABLE propose");
    await database.query("TRUNCATE TABLE admin");
    await database.query("TRUNCATE TABLE customer");
    await database.query("TRUNCATE TABLE barber");
    await database.query("TRUNCATE TABLE prestation");
    await database.query("TRUNCATE TABLE event");
    await database.query("TRUNCATE TABLE users");
    await database.query("SET FOREIGN_KEY_CHECKS = 1");

    console.info("🔐 Génération des mots de passe...");
    const password = await argon2.hash("Demo1234!");

    // =========================================================================
    // USERS — 1 admin + 30 barbers + 10 clients = 41
    // =========================================================================
    console.info("👤 Insertion des utilisateurs...");
    await database.query(
      `INSERT INTO users (id_user, email, password, user_type, phone) VALUES
      (1,  'admin@secare.fr',             ?, 'admin',    '0600000001'),
      -- Barbers Bordeaux
      (2,  'thomas@secare.fr',            ?, 'barber',   '0611111101'),
      (3,  'maxime@secare.fr',            ?, 'barber',   '0611111102'),
      (4,  'sofiane@secare.fr',           ?, 'barber',   '0611111103'),
      -- Barbers Paris
      (5,  'rafik@secare.fr',             ?, 'barber',   '0611111104'),
      (6,  'kevin@secare.fr',             ?, 'barber',   '0611111105'),
      (7,  'ibrahim@secare.fr',           ?, 'barber',   '0611111106'),
      (8,  'jordan@secare.fr',            ?, 'barber',   '0611111107'),
      -- Barbers Lyon
      (9,  'mehdi@secare.fr',             ?, 'barber',   '0611111108'),
      (10, 'leo@secare.fr',               ?, 'barber',   '0611111109'),
      -- Barbers Marseille
      (11, 'samir@secare.fr',             ?, 'barber',   '0611111110'),
      (12, 'julien@secare.fr',            ?, 'barber',   '0611111111'),
      -- Barbers Lille
      (13, 'nabil@secare.fr',             ?, 'barber',   '0611111112'),
      (14, 'theo@secare.fr',              ?, 'barber',   '0611111113'),
      -- Barbers Strasbourg
      (15, 'cedric@secare.fr',            ?, 'barber',   '0611111114'),
      (16, 'youssef@secare.fr',           ?, 'barber',   '0611111115'),
      -- Barbers Nantes
      (17, 'xavier@secare.fr',            ?, 'barber',   '0611111116'),
      (18, 'killian@secare.fr',           ?, 'barber',   '0611111117'),
      -- Barbers Toulouse
      (19, 'rayan@secare.fr',             ?, 'barber',   '0611111118'),
      (20, 'lucas@secare.fr',             ?, 'barber',   '0611111119'),
      -- Barbers Nice
      (21, 'pierre@secare.fr',            ?, 'barber',   '0611111120'),
      (22, 'ali@secare.fr',               ?, 'barber',   '0611111121'),
      -- Autres villes
      (23, 'tony@secare.fr',              ?, 'barber',   '0611111122'),
      (24, 'enzo@secare.fr',              ?, 'barber',   '0611111123'),
      (25, 'bilal@secare.fr',             ?, 'barber',   '0611111124'),
      (26, 'hugo@secare.fr',              ?, 'barber',   '0611111125'),
      (27, 'adam@secare.fr',              ?, 'barber',   '0611111126'),
      (28, 'nassim@secare.fr',            ?, 'barber',   '0611111127'),
      (29, 'dylan@secare.fr',             ?, 'barber',   '0611111128'),
      (30, 'mathieu@secare.fr',           ?, 'barber',   '0611111129'),
      (31, 'florian@secare.fr',           ?, 'barber',   '0611111130'),
      -- Clients
      (32, 'jean.dupont@gmail.com',       ?, 'customer', '0622222201'),
      (33, 'lucie.martin@gmail.com',      ?, 'customer', '0622222202'),
      (34, 'karim.benali@gmail.com',      ?, 'customer', '0622222203'),
      (35, 'yasmine.oui@gmail.com',       ?, 'customer', '0622222204'),
      (36, 'antoine.girard@gmail.com',    ?, 'customer', '0622222205'),
      (37, 'sarah.camus@gmail.com',       ?, 'customer', '0622222206'),
      (38, 'marc.dupuis@gmail.com',       ?, 'customer', '0622222207'),
      (39, 'chloe.richard@gmail.com',     ?, 'customer', '0622222208'),
      (40, 'nicolas.petit@gmail.com',     ?, 'customer', '0622222209'),
      (41, 'emma.blanc@gmail.com',        ?, 'customer', '0622222210')`,
      Array(41).fill(password),
    );

    // =========================================================================
    // AVATARS BARBERS — une image différente par barber
    // =========================================================================
    console.info("🖼️  Téléchargement des avatars barbers...");

    const avatarsDir = path.resolve("public/uploads/avatars");
    fs.mkdirSync(avatarsDir, { recursive: true });

    const barberUserIds = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    ];
    for (let i = 0; i < barberUserIds.length; i++) {
      const id = barberUserIds[i];
      const filename = `demo-barber-${id}.jpg`;
      const filePath = path.join(avatarsDir, filename);
      if (!fs.existsSync(filePath)) {
        // randomuser.me fournit de vrais portraits (hommes, indices 1-99)
        const portraitIndex = (i % 70) + 1;
        const res = await fetch(
          `https://randomuser.me/api/portraits/men/${portraitIndex}.jpg`,
        );
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
      }
      await database.query(
        "UPDATE users SET avatar_url = ? WHERE id_user = ?",
        [`/uploads/avatars/${filename}`, id],
      );
    }
    console.info(`  ➜ ${barberUserIds.length} avatars téléchargés`);

    // =========================================================================
    // PROFILS
    // =========================================================================
    await database.query(
      "INSERT INTO admin (id_user, access_level) VALUES (1, 3)",
    );

    await database.query(
      `INSERT INTO barber (id_user, name, description, postal_code, city, adress, delivery_radius, status) VALUES
      -- Bordeaux
      (2,  'Thomas The Barber', 'Spécialiste du dégradé américain et de la taille de barbe. 10 ans d''expérience.', '33000', 'Bordeaux',         '8 Place de la Victoire',           15, 'Actif'),
      (3,  'Maxime Gradient',   'Expert coloriste pour homme, coiffure vintage et styles rétro pompadour.',          '33100', 'Bordeaux',         '102 Rue de la Benauge',            10, 'Actif'),
      (4,  'Sofiane Style',     'Coiffeur afro et mixte, spécialiste des tresses et locks. 7 ans d''expérience.',   '33000', 'Bordeaux',         '22 Rue du Palais Gallien',          8, 'Actif'),
      -- Paris
      (5,  'Rafik Barber',      'Maître barbier dans le 18e, fade et dégradés afro depuis 12 ans.',                 '75018', 'Paris',            '14 Rue de la Goutte d''Or',        10, 'Actif'),
      (6,  'Kevin Fade',        'Spécialiste du skin fade et des dégradés nets. Ambiance streetwear.',              '75011', 'Paris',            '45 Rue Oberkampf',                  5, 'Actif'),
      (7,  'Ibrahim Cuts',      'Coiffeur polyvalent, expert en coupe classique et moderne.',                       '75010', 'Paris',            '78 Rue du Faubourg Saint-Denis',    8, 'Actif'),
      (8,  'Jordan Premium',    'Barbershop haut de gamme, coupe + rasage traditionnel au couteau.',                '75008', 'Paris',            '12 Rue de Ponthieu',               15, 'Actif'),
      -- Lyon
      (9,  'Mehdi Lyon',        'Dégradés et tailles de barbe dans le cœur de Lyon. Accueil chaleureux.',          '69001', 'Lyon',             '5 Rue de la République',           10, 'Actif'),
      (10, 'Léo Coiffure',      'Coupe moderne et vintage, spécialiste du pompadour et du slick back.',            '69003', 'Lyon',             '22 Cours Lafayette',                8, 'Actif'),
      -- Marseille
      (11, 'Samir BarberShop',  'Le meilleur du dégradé à Marseille, ambiance conviviale garantie.',               '13001', 'Marseille',        '9 Rue de la République',           12, 'Actif'),
      (12, 'Julien Style',      'Coiffeur tendance, spécialiste coloration et coupe créative.',                    '13006', 'Marseille',        '34 Rue Paradis',                   10, 'Actif'),
      -- Lille
      (13, 'Nabil Barber',      'Expert dégradé et barbe dans le Vieux-Lille. 8 ans d''expérience.',              '59000', 'Lille',            '17 Rue de la Monnaie',              8, 'Actif'),
      (14, 'Théo Cuts',         'Coupes modernes et classiques, ambiance barbershop authentique.',                 '59800', 'Lille',            '52 Rue Léon Gambetta',              6, 'Actif'),
      -- Strasbourg
      (15, 'Cédric Alsace',     'Barbier alsacien, maîtrise du rasage à l''ancienne et du dégradé.',              '67000', 'Strasbourg',       '8 Place Kléber',                   10, 'Actif'),
      (16, 'Youssef Barber',    'Coupe afro, dégradé et tresse. Le meilleur du quartier Neudorf.',                '67100', 'Strasbourg',       '45 Route de Lyon',                  7, 'Actif'),
      -- Nantes
      (17, 'Xavier Nantes',     'Barbershop moderne sur l''île de Nantes. Fade, barbe et bien-être.',             '44200', 'Nantes',           '3 Boulevard des Martyrs Nantais',  12, 'Actif'),
      (18, 'Killian Coiffure',  'Coupe classique et contemporaine, spécialiste homme toutes textures.',           '44000', 'Nantes',           '26 Rue Crébillon',                  8, 'Actif'),
      -- Toulouse
      (19, 'Rayan Toulouse',    'Dégradé et barbe dans le cœur de Toulouse. Tes cheveux méritent le meilleur.',  '31000', 'Toulouse',         '12 Rue Saint-Rome',                10, 'Actif'),
      (20, 'Lucas Style',       'Coupes tendance pour hommes, spécialiste coloration masculine.',                  '31300', 'Toulouse',         '88 Allées Jean Jaurès',             8, 'Actif'),
      -- Nice
      (21, 'Pierre Riviera',    'Barbier de la Côte d''Azur, coupes soignées et rasage traditionnel.',            '06000', 'Nice',             '7 Avenue Jean Médecin',            15, 'Actif'),
      (22, 'Ali Nice Barber',   'Dégradé afro et barbe sculptée sur la Promenade des Anglais.',                   '06300', 'Nice',             '14 Rue de France',                  8, 'Actif'),
      -- Autres villes
      (23, 'Tony Rennes',       'Barbier breton, coupe classique et moderne au cœur de Rennes.',                  '35000', 'Rennes',           '19 Rue d''Antrain',                 8, 'Actif'),
      (24, 'Enzo Montpellier',  'Spécialiste dégradé et coiffure créative à Montpellier.',                        '34000', 'Montpellier',      '5 Place de la Comédie',            10, 'Actif'),
      (25, 'Bilal Grenoble',    'Barbier isérois, expert fade et taille de barbe.',                               '38000', 'Grenoble',         '11 Rue Félix Poulat',               8, 'Actif'),
      (26, 'Hugo Dijon',        'Coupe soignée en Bourgogne, ambiance chaleureuse et prix justes.',               '21000', 'Dijon',            '3 Rue de la Liberté',               6, 'Actif'),
      (27, 'Adam Rouen',        'Barbier normand, spécialiste du rasage traditionnel à la mousse.',               '76000', 'Rouen',            '22 Rue du Gros-Horloge',            8, 'Actif'),
      (28, 'Nassim Clermont',   'Dégradé et barbe au cœur de l''Auvergne.',                                      '63000', 'Clermont-Ferrand', '8 Place de Jaude',                  7, 'Actif'),
      (29, 'Dylan Reims',       'Coiffeur champenois, coupes modernes et classiques.',                            '51100', 'Reims',            '14 Rue de Vesle',                   6, 'Actif'),
      (30, 'Mathieu Metz',      'Barbier lorrain, expert en fade et coupe structurée.',                           '57000', 'Metz',             '5 Place Saint-Louis',               7, 'Actif'),
      (31, 'Florian Tours',     'Coiffeur du Val de Loire, spécialiste coupe et barbe soignée.',                  '37000', 'Tours',            '16 Rue Nationale',                  9, 'Actif')`,
    );

    await database.query(
      `INSERT INTO customer (id_user, firstname, lastname, postal_code, city, adress) VALUES
      (32, 'Jean',    'Dupont',  '33000', 'Bordeaux', '12 Rue Sainte-Catherine'),
      (33, 'Lucie',   'Martin',  '33400', 'Talence',  '45 Avenue de l''Université'),
      (34, 'Karim',   'Benali',  '33300', 'Bordeaux', '7 Cours de la Marne'),
      (35, 'Yasmine', 'Oui',     '75018', 'Paris',    '3 Rue Ordener'),
      (36, 'Antoine', 'Girard',  '69003', 'Lyon',     '18 Cours Gambetta'),
      (37, 'Sarah',   'Camus',   '13001', 'Marseille','22 Rue Paradis'),
      (38, 'Marc',    'Dupuis',  '59000', 'Lille',    '8 Rue Faidherbe'),
      (39, 'Chloé',   'Richard', '31000', 'Toulouse', '5 Rue du Taur'),
      (40, 'Nicolas', 'Petit',   '06000', 'Nice',     '10 Avenue Durante'),
      (41, 'Emma',    'Blanc',   '67000', 'Strasbourg','4 Rue des Grandes Arcades')`,
    );

    // =========================================================================
    // PRESTATIONS
    // =========================================================================
    console.info("✂️  Insertion des prestations...");
    await database.query(
      `INSERT INTO prestation (id_prestation, name, price, duration_minutes) VALUES
      (1, 'Coupe Homme Classique',              25.00, 30),
      (2, 'Dégradé Américain (Fade)',           30.00, 45),
      (3, 'Taille de Barbe & Serviette chaude', 20.00, 30),
      (4, 'Formule Coupe + Barbe',              45.00, 60),
      (5, 'Coloration / Décoloration',          55.00, 90)`,
    );

    // Chaque barber propose un mix de prestations
    await database.query(
      `INSERT INTO propose (id_user, id_prestation) VALUES
      -- Bordeaux
      (2,1),(2,2),(2,3),(2,4),
      (3,1),(3,3),(3,5),
      (4,1),(4,2),(4,3),
      -- Paris
      (5,1),(5,2),(5,3),(5,4),
      (6,1),(6,2),(6,4),
      (7,1),(7,2),(7,3),
      (8,1),(8,3),(8,4),
      -- Lyon
      (9,1),(9,2),(9,3),(9,4),
      (10,1),(10,2),(10,5),
      -- Marseille
      (11,1),(11,2),(11,3),(11,4),
      (12,1),(12,3),(12,5),
      -- Lille
      (13,1),(13,2),(13,3),
      (14,1),(14,2),(14,4),
      -- Strasbourg
      (15,1),(15,2),(15,3),(15,4),
      (16,1),(16,2),(16,3),
      -- Nantes
      (17,1),(17,2),(17,3),(17,4),
      (18,1),(18,2),(18,5),
      -- Toulouse
      (19,1),(19,2),(19,3),(19,4),
      (20,1),(20,3),(20,5),
      -- Nice
      (21,1),(21,2),(21,3),(21,4),
      (22,1),(22,2),(22,3),
      -- Autres
      (23,1),(23,2),(23,3),
      (24,1),(24,2),(24,4),
      (25,1),(25,2),(25,3),
      (26,1),(26,3),(26,4),
      (27,1),(27,2),(27,3),
      (28,1),(28,2),(28,4),
      (29,1),(29,2),(29,3),
      (30,1),(30,2),(30,4),
      (31,1),(31,2),(31,3)`,
    );

    // =========================================================================
    // ÉVÉNEMENTS
    // =========================================================================
    console.info("📅 Insertion des événements...");
    await database.query(
      `INSERT INTO event (id_event, title, description, status, start_date, end_date, location) VALUES
      (1, 'Festival Rock & Barber 2026',    'Le plus grand rassemblement de coiffeurs et de musique rock.',         'publié',   '2026-07-11 10:00:00', '2026-07-12 20:00:00', 'Hangar 14, Quai des Chartrons, Bordeaux'),
      (2, 'Salon du Mariage Bordeaux',      'Espace mise en beauté pour les futurs mariés.',                        'brouillon','2026-10-24 09:00:00', '2026-10-25 18:00:00', 'Parc des Expositions, Bordeaux'),
      (3, 'Pop-up Barbershop Centre-ville', 'Session de coiffure en plein air au cœur de Bordeaux.',               'publié',   '2026-07-20 11:00:00', '2026-07-20 18:00:00', 'Place des Quinconces, Bordeaux'),
      (4, 'Paris Barber Week',              'Une semaine dédiée aux meilleurs barbiers parisiens.',                 'publié',   '2026-09-14 09:00:00', '2026-09-20 20:00:00', 'Le Marais, Paris'),
      (5, 'Lyon Fade Festival',             'Compétition de dégradés entre les meilleurs barbiers de Lyon.',        'brouillon','2026-11-05 10:00:00', '2026-11-05 18:00:00', 'Halle Tony Garnier, Lyon')`,
    );

    // =========================================================================
    // RENDEZ-VOUS (centrés sur Thomas id=2 pour la démo barber)
    // =========================================================================
    console.info("📆 Insertion des rendez-vous...");
    await database.query(
      `INSERT INTO appointment (id_appointment, appointment_date, status, location_type, id_prestation, id_user_barber, id_user_customer) VALUES

      -- ── Mai / Juin : historique terminé ──────────────────────────────────────
      (1,  '2026-05-10 10:00:00', 'terminé',    'salon',    2, 2,  32),
      (2,  '2026-05-15 14:00:00', 'terminé',    'domicile', 4, 2,  33),
      (3,  '2026-05-20 09:30:00', 'terminé',    'salon',    1, 3,  32),
      (4,  '2026-05-25 11:00:00', 'terminé',    'salon',    3, 2,  34),
      (5,  '2026-06-01 10:00:00', 'terminé',    'domicile', 2, 2,  33),
      (6,  '2026-06-05 14:30:00', 'terminé',    'salon',    5, 3,  34),
      (7,  '2026-06-10 09:00:00', 'terminé',    'salon',    1, 4,  35),
      (8,  '2026-06-15 11:00:00', 'terminé',    'salon',    2, 5,  35),
      (9,  '2026-06-20 14:00:00', 'terminé',    'domicile', 3, 2,  36),
      (10, '2026-06-25 10:00:00', 'terminé',    'salon',    4, 3,  37),
      (11, '2026-06-27 09:00:00', 'terminé',    'salon',    2, 9,  36),
      (12, '2026-06-28 14:00:00', 'terminé',    'salon',    1, 11, 37),

      -- ── Annulés ──────────────────────────────────────────────────────────────
      (13, '2026-06-18 09:00:00', 'annulé',     'salon',    1, 2,  32),
      (14, '2026-06-22 15:00:00', 'annulé',     'domicile', 3, 3,  33),
      (15, '2026-07-01 10:00:00', 'annulé',     'salon',    2, 2,  36),

      -- ── Semaine dernière (30 juin – 4 juillet) → stats ──────────────────────
      (16, '2026-06-30 09:00:00', 'terminé',    'salon',    2, 2,  32),
      (17, '2026-06-30 11:00:00', 'terminé',    'salon',    1, 2,  34),
      (18, '2026-07-01 10:00:00', 'terminé',    'domicile', 4, 2,  33),
      (19, '2026-07-01 14:00:00', 'terminé',    'salon',    3, 3,  37),
      (20, '2026-07-02 09:30:00', 'terminé',    'salon',    2, 4,  38),
      (21, '2026-07-02 11:00:00', 'terminé',    'salon',    1, 2,  39),
      (22, '2026-07-03 10:00:00', 'terminé',    'domicile', 4, 2,  32),
      (23, '2026-07-04 14:00:00', 'terminé',    'salon',    5, 3,  34),

      -- ── Cette semaine (7–11 juillet) ────────────────────────────────────────
      (24, '2026-07-07 09:00:00', 'confirmé',   'salon',    2, 2,  33),
      (25, '2026-07-07 11:00:00', 'confirmé',   'salon',    1, 2,  34),
      (26, '2026-07-07 14:00:00', 'terminé',    'domicile', 3, 3,  37),

      -- ── AUJOURD'HUI (8 juillet) → dashboard barber Thomas ───────────────────
      (27, '2026-07-08 09:00:00', 'confirmé',   'salon',    2, 2,  32),
      (28, '2026-07-08 10:00:00', 'confirmé',   'salon',    4, 2,  33),
      (29, '2026-07-08 11:30:00', 'en attente', 'salon',    1, 2,  34),
      (30, '2026-07-08 14:00:00', 'confirmé',   'domicile', 3, 2,  35),
      (31, '2026-07-08 15:30:00', 'en attente', 'salon',    2, 2,  36),
      -- Aujourd'hui pour d'autres barbers
      (32, '2026-07-08 09:00:00', 'confirmé',   'salon',    1, 3,  37),
      (33, '2026-07-08 11:00:00', 'confirmé',   'domicile', 5, 3,  38),
      (34, '2026-07-08 14:00:00', 'en attente', 'salon',    2, 5,  39),
      (35, '2026-07-08 10:00:00', 'confirmé',   'salon',    4, 9,  40),
      (36, '2026-07-08 14:00:00', 'confirmé',   'salon',    2, 11, 41),

      -- ── Reste de la semaine (9–11 juillet) ──────────────────────────────────
      (37, '2026-07-09 10:00:00', 'confirmé',   'salon',    2, 2,  37),
      (38, '2026-07-09 14:00:00', 'en attente', 'domicile', 4, 2,  38),
      (39, '2026-07-10 09:00:00', 'confirmé',   'salon',    1, 3,  36),
      (40, '2026-07-10 11:00:00', 'confirmé',   'salon',    3, 4,  34),
      (41, '2026-07-11 10:00:00', 'confirmé',   'event',    4, 2,  33),

      -- ── À venir (15–31 juillet) → planning ──────────────────────────────────
      (42, '2026-07-15 10:00:00', 'en attente', 'salon',    2, 2,  32),
      (43, '2026-07-15 14:00:00', 'en attente', 'salon',    4, 2,  33),
      (44, '2026-07-16 09:00:00', 'confirmé',   'domicile', 1, 3,  34),
      (45, '2026-07-17 11:00:00', 'confirmé',   'salon',    2, 4,  35),
      (46, '2026-07-20 09:00:00', 'confirmé',   'salon',    2, 2,  36),
      (47, '2026-07-21 14:00:00', 'en attente', 'salon',    4, 2,  37),
      (48, '2026-07-22 10:00:00', 'confirmé',   'domicile', 5, 3,  32),
      (49, '2026-07-25 09:00:00', 'confirmé',   'salon',    1, 2,  33),
      (50, '2026-07-28 14:00:00', 'en attente', 'salon',    3, 4,  34),
      (51, '2026-07-30 10:00:00', 'confirmé',   'salon',    2, 2,  35)`,
    );

    // =========================================================================
    // AVIS
    // =========================================================================
    console.info("⭐ Insertion des avis...");
    await database.query(
      `INSERT INTO review (rating, comment, created_at, id_appointment) VALUES
      (5, 'Excellent coiffeur, dégradé ultra propre et précis. Je reviendrai sans hésiter !',  '2026-05-10 11:30:00', 1),
      (4, 'Très bonne prestation à domicile, ponctuel et professionnel.',                      '2026-05-15 15:00:00', 2),
      (3, 'Coupe correcte mais un peu d''attente. Résultat satisfaisant.',                     '2026-05-20 10:30:00', 3),
      (5, 'Taille de barbe parfaite, soin serviette chaude top. Je recommande !',              '2026-05-25 12:00:00', 4),
      (4, 'Super dégradé, ambiance sympa. Juste un tout petit retard.',                        '2026-06-01 11:00:00', 5),
      (5, 'Coloration impeccable, exactement ce que je voulais. Très à l''écoute.',            '2026-06-05 15:30:00', 6),
      (5, 'Coupe propre et rapide, je reviendrai !',                                           '2026-06-10 10:00:00', 7),
      (4, 'Dégradé bien réalisé, salon agréable.',                                             '2026-06-15 12:00:00', 8),
      (3, 'Résultat correct, mais j''attendais mieux pour le prix.',                           '2026-06-20 15:00:00', 9),
      (5, 'Formule top, coupe + barbe en un seul passage. Super !',                            '2026-06-25 11:30:00', 10),
      (4, 'Très bon barbier lyonnais, je recommande.',                                         '2026-06-27 10:00:00', 11),
      (5, 'Le meilleur de Marseille, sans hésitation.',                                        '2026-06-28 15:00:00', 12),
      (5, 'Toujours aussi pro, meilleur dégradé de Bordeaux.',                                '2026-06-30 10:00:00', 16),
      (4, 'Coupe classique très bien exécutée.',                                               '2026-06-30 12:00:00', 17),
      (5, 'Prestation à domicile parfaite, très à l''heure.',                                  '2026-07-01 11:00:00', 18),
      (4, 'Barbe bien taillée, serviette chaude agréable.',                                    '2026-07-01 15:00:00', 19),
      (3, 'Dégradé un peu court mais propre.',                                                 '2026-07-02 10:30:00', 20),
      (5, 'Excellent, rien à redire !',                                                        '2026-07-02 12:00:00', 21),
      (4, 'Formule complète très satisfaisante.',                                              '2026-07-03 11:00:00', 22),
      (5, 'Coloration superbe, exactement la teinte voulue.',                                  '2026-07-04 15:30:00', 23)`,
    );

    // =========================================================================
    // PORTFOLIO — téléchargement d'images uniques depuis picsum.photos
    // =========================================================================
    console.info("🖼️  Insertion des portfolios...");

    const portfolioEntries = [
      {
        id_user: 2,
        filename: "thomas-fade1.jpg",
        title: "Dégradé à blanc parfait",
        seed: "barber-t1",
      },
      {
        id_user: 2,
        filename: "thomas-fade2.jpg",
        title: "Fade skin classique",
        seed: "barber-t2",
      },
      {
        id_user: 2,
        filename: "thomas-beard1.jpg",
        title: "Barbe sculptée au rasoir",
        seed: "barber-t3",
      },
      {
        id_user: 2,
        filename: "thomas-beard2.jpg",
        title: "Taille ronde précise",
        seed: "barber-t4",
      },
      {
        id_user: 2,
        filename: "thomas-cut1.jpg",
        title: "Coupe pompadour moderne",
        seed: "barber-t5",
      },
      {
        id_user: 3,
        filename: "maxime-color1.jpg",
        title: "Coloration mèches dorées",
        seed: "barber-m1",
      },
      {
        id_user: 3,
        filename: "maxime-color2.jpg",
        title: "Décoloration platinum",
        seed: "barber-m2",
      },
      {
        id_user: 3,
        filename: "maxime-retro1.jpg",
        title: "Pompadour vintage années 50",
        seed: "barber-m3",
      },
      {
        id_user: 4,
        filename: "sofiane-afro1.jpg",
        title: "Tresse box braid complète",
        seed: "barber-s1",
      },
      {
        id_user: 4,
        filename: "sofiane-fade1.jpg",
        title: "Dégradé afro contour",
        seed: "barber-s2",
      },
      {
        id_user: 5,
        filename: "rafik-fade1.jpg",
        title: "Skin fade parfait",
        seed: "barber-r1",
      },
      {
        id_user: 9,
        filename: "mehdi-cut1.jpg",
        title: "Coupe moderne Lyon",
        seed: "barber-me1",
      },
      {
        id_user: 11,
        filename: "samir-fade1.jpg",
        title: "Dégradé Marseille",
        seed: "barber-sa1",
      },
    ];

    const uploadsDir = path.resolve("public/uploads/portfolio");
    fs.mkdirSync(uploadsDir, { recursive: true });

    for (const entry of portfolioEntries) {
      const filePath = path.join(uploadsDir, entry.filename);
      if (!fs.existsSync(filePath)) {
        const res = await fetch(
          `https://picsum.photos/seed/${entry.seed}/600/400`,
        );
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.info(`  ➜ ${entry.filename} téléchargée`);
      }
    }

    await database.query(
      `INSERT INTO barber_portfolio (id_user, image_url, title) VALUES ${portfolioEntries
        .map(
          (e) =>
            `(${e.id_user}, '/uploads/portfolio/${e.filename}', '${e.title.replace(/'/g, "\\'")}')`,
        )
        .join(", ")}`,
    );

    // =========================================================================
    // DISPONIBILITÉS — créneaux 30 min, Lun-Sam, 9h-12h et 14h-18h
    // Période : 8 juillet → 31 juillet 2026
    // =========================================================================
    console.info("🗓️  Insertion des disponibilités...");

    const barberIds = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    ];

    // Génération des créneaux de 30 minutes
    const morningTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
    const afternoonTimes = [
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ];
    const allTimes = [...morningTimes, ...afternoonTimes];

    const slots: Array<[string, string, number]> = [];

    const seedStart = new Date("2026-07-08T00:00:00Z");
    const seedEnd = new Date("2026-07-31T00:00:00Z");

    for (
      const cur = new Date(seedStart);
      cur <= seedEnd;
      cur.setUTCDate(cur.getUTCDate() + 1)
    ) {
      if (cur.getUTCDay() === 0) continue; // Dimanche → repos
      const dateStr = cur.toISOString().split("T")[0];

      for (const barberId of barberIds) {
        for (const time of allTimes) {
          const [h, m] = time.split(":").map(Number);
          const endM = m + 30;
          const endH = endM >= 60 ? h + 1 : h;
          const endMin = endM >= 60 ? endM - 60 : endM;
          const endTime = `${String(endH).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
          slots.push([
            `${dateStr} ${time}:00`,
            `${dateStr} ${endTime}:00`,
            barberId,
          ]);
        }
      }
    }

    // Insertion par lots de 500
    const batchSize = 500;
    for (let i = 0; i < slots.length; i += batchSize) {
      const batch = slots.slice(i, i + batchSize);
      const placeholders = batch.map(() => "(?, ?, FALSE, ?)").join(", ");
      const values = batch.flat();
      await database.query(
        `INSERT INTO barber_availability (start_time, end_time, is_booked, id_user) VALUES ${placeholders}`,
        values,
      );
    }

    console.info(
      `  ➜ ${slots.length} créneaux insérés pour ${barberIds.length} barbers`,
    );

    database.end();

    console.info("\n✅ Base de données remplie avec les données de démo !");
    console.info("─────────────────────────────────────────────────────────");
    console.info("Mot de passe pour tous les comptes : Demo1234!");
    console.info("");
    console.info("ADMIN  → admin@secare.fr");
    console.info("BARBERS (30) :");
    console.info(
      "  Bordeaux    → thomas@secare.fr / maxime@secare.fr / sofiane@secare.fr",
    );
    console.info(
      "  Paris       → rafik@secare.fr / kevin@secare.fr / ibrahim@secare.fr / jordan@secare.fr",
    );
    console.info("  Lyon        → mehdi@secare.fr / leo@secare.fr");
    console.info("  Marseille   → samir@secare.fr / julien@secare.fr");
    console.info("  Lille       → nabil@secare.fr / theo@secare.fr");
    console.info("  Strasbourg  → cedric@secare.fr / youssef@secare.fr");
    console.info("  Nantes      → xavier@secare.fr / killian@secare.fr");
    console.info("  Toulouse    → rayan@secare.fr / lucas@secare.fr");
    console.info("  Nice        → pierre@secare.fr / ali@secare.fr");
    console.info(
      "  Autres      → tony(Rennes) / enzo(Montpellier) / bilal(Grenoble)",
    );
    console.info(
      "              → hugo(Dijon) / adam(Rouen) / nassim(Clermont)",
    );
    console.info(
      "              → dylan(Reims) / mathieu(Metz) / florian(Tours)",
    );
    console.info(
      "CLIENTS (10) → jean.dupont / lucie.martin / karim.benali / yasmine.oui",
    );
    console.info(
      "             → antoine.girard / sarah.camus / marc.dupuis / chloe.richard",
    );
    console.info(
      "             → nicolas.petit / emma.blanc  (tous @gmail.com)",
    );
    console.info("─────────────────────────────────────────────────────────");
  } catch (err) {
    const { message, stack } = err as Error;
    console.error("Erreur lors du seed de démo :", message, stack);
    database.end();
    process.exit(1);
  }
};

demo();
