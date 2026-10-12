# SECARE

SECARE est une application full-stack de réservation de prestations de coiffure. Le monorepo contient le client React/TypeScript, l’API Express/TypeScript et une base MySQL.

## Démarrage local

Prérequis : Node.js 20+, npm et MySQL 8.

```bash
npm install
cp server/.env.sample server/.env
cp client/.env.sample client/.env
npm run db:migrate
npm run db:demo --workspace=server
npm run dev
```

Client : `http://localhost:3000`. API : `http://localhost:3310`. Santé : `GET /health`.

```bash
npm run build
npm run check-types --workspaces --if-present
npm test
npm run test:coverage --workspace=server
```

`db:migrate` est non destructif : il initialise une base vide puis applique seulement les migrations absentes. `db:demo` remplace les données par le scénario de démonstration ; ne jamais l’exécuter en production.

## Architecture

```text
client/src              interface React et appels API
server/src/router*.ts   routes publiques, client, coiffeur et admin
server/src/modules      contrôleurs et repositories SQL par domaine
server/src/middleware   authentification, rôles et validation
server/database         schéma, migrations et données de démonstration
```

Les mots de passe sont hachés avec Argon2. Les routes privées utilisent un JWT, puis un contrôle de rôle et/ou de propriété. Une transaction MySQL verrouille le créneau pendant la réservation. Voir [SECURITY.md](docs/SECURITY.md) et [TESTING.md](docs/TESTING.md).

## Docker et déploiement

```bash
docker compose up --build
docker compose exec web npm run db:migrate
docker compose exec web npm run db:demo --workspace=server
```

Production : renseigner un `.env` racine avec les variables obligatoires, puis lancer :

```bash
docker compose -f docker-compose.prod.yml up -d --build
curl http://localhost:3310/health
```

Le conteneur applique les migrations non destructives avant l’API. MySQL utilise un volume persistant. Pour plusieurs instances, monter `server/public/uploads` sur un volume persistant ou utiliser un stockage objet.

Sauvegarde et restauration :

```bash
docker compose -f docker-compose.prod.yml exec database sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' > secare-backup.sql
docker compose -f docker-compose.prod.yml exec -T database sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' < secare-backup.sql
```

## Scénario DEMO_BACKEND

1. Charger `npm run db:demo --workspace=server`.
2. Se connecter comme client, chercher un coiffeur et réserver un créneau futur.
3. Vérifier la réservation côté client et coiffeur.
4. Confirmer puis terminer le rendez-vous côté coiffeur.
5. Publier un avis côté client.
6. Contrôler le rendez-vous et l’avis côté administrateur.

Les identifiants sont affichés par le script de démonstration et ne doivent jamais servir en production.
