# Plan et résultats des tests

Tests automatisés : absence/token invalide (401), rôle insuffisant (403), accès au profil d’un tiers (403), inscription admin (400), réservation valide (201), réservation par coiffeur (403), conflit de créneau (409), note invalide (400), route inconnue (404 JSON).

Exécution : `npm test`. Couverture : `npm run test:coverage --workspace=server`.

Les tests HTTP isolent SQL par des mocks. Pour la recette, employer une base MySQL dédiée, appliquer `db:migrate`, charger `db:demo`, puis suivre `DEMO_BACKEND` dans le README. Ne jamais lancer les données de démonstration sur la production.

Contrôles manuels : `GET /health`, concurrence sur un même créneau (une réussite et un 409), isolation entre comptes, persistance après redémarrage Docker et restauration d’une sauvegarde dans une base séparée.
