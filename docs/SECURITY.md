# Sécurité et matrice d’accès

| Ressource | Visiteur | Client | Coiffeur | Admin |
|---|---:|---:|---:|---:|
| Coiffeurs, prestations, événements, avis | Lecture | Lecture | Lecture | Lecture |
| Profil client | Non | Le sien | Non | Tous |
| Profil et horaires coiffeur | Lecture limitée | Lecture | Les siens | Tous |
| Rendez-vous | Non | Les siens, création/annulation | Les siens, statut | Tous |
| Utilisateurs/tableaux globaux | Non | Non | Non | Oui |
| Avis | Non | Création après son RDV terminé | Non | Suppression |

Mesures présentes : Argon2, JWT expirant, validation Zod des entrées critiques, réponses 401/403, contrôles IDOR, Helmet, CORS explicite, JSON limité à 100 Ko, limitation de débit sur l’authentification, erreurs centralisées et transaction avec verrouillage des créneaux.

Avant une production publique : ajouter un fournisseur d’e-mail et des jetons de réinitialisation aléatoires, hachés, expirants et à usage unique ; analyser le contenu réel des images ; persister les uploads ; centraliser les journaux ; organiser la rotation des secrets et la conservation/suppression RGPD.

Ne jamais journaliser JWT, mot de passe, jeton de réinitialisation ou erreur SQL complète.
