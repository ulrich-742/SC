//pour lancer le script, utilisez la commande suivante dans le terminal à la racine du projet :
//npx ts-node server/bin/promote-user-to-admin.ts

import path from "node:path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function promoteToAdmin() {
  if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME
  ) {
    console.error("Erreur : Les variables d'environnement DB sont manquantes.");
    process.exit(1);
  }

  const email = "giorgibestavashvili@laposte.net"; // Changez cet email par celui de l'utilisateur à promouvoir

  let connection: mysql.Connection | null = null;

  try {
    console.log(`Connexion à ${process.env.DB_HOST}...`);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "3306", 10),
    });

    console.log("Connecté à la base de données.");

    const [result]: [mysql.ResultSetHeader, unknown[]] =
      await connection.execute(
        "UPDATE users SET user_type = 'admin' WHERE email = ?",
        [email],
      );

    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      console.error(`Aucun utilisateur trouvé avec l'email : ${email}`);
      process.exit(1);
    }
    console.log(`Type utilisateur changé en 'admin' pour ${email}`);

    const [rows]: [mysql.RowDataPacket[], unknown[]] = await connection.execute(
      "SELECT * FROM admin WHERE id_user = (SELECT id_user FROM users WHERE email = ?)",
      [email],
    );

    if (rows.length === 0) {
      await connection.execute(
        `INSERT INTO admin (id_user, access_level) 
         SELECT id_user, 1 FROM users WHERE email = ?`,
        [email],
      );
      console.log("Entrée admin créée.");
    } else {
      await connection.execute(
        "UPDATE admin SET access_level = 1 WHERE id_user = (SELECT id_user FROM users WHERE email = ?)",
        [email],
      );
      console.log("Niveau d'accès admin mis à jour.");
    }

    console.log("Opération terminée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'exécution :", error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

promoteToAdmin();
