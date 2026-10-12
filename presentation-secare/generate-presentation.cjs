const pptxgen = require(process.env.PPTXGEN_PATH);
const fs = require('fs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Ulrich Amoussou';
pptx.subject = 'Présentation du projet Secare — Titre professionnel DWWM';
pptx.title = 'SECARE — Soutenance DWWM';
pptx.company = 'Wild Code School';
pptx.lang = 'fr-FR';
pptx.theme = {
  headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR'
};
pptx.defineSlideMaster({
  title: 'MASTER',
  background: { color: 'F7F4EE' },
  objects: [
    { rect: { x: 0, y: 0, w: 13.333, h: 0.11, fill: { color: 'C8892E' }, line: { color: 'C8892E' } } },
    { text: { text: 'SECARE', options: { x: 0.55, y: 7.12, w: 1.5, h: 0.18, fontFace: 'Aptos', fontSize: 9, bold: true, color: '9A6A27', margin: 0 } } },
    { text: { text: 'Ulrich Amoussou • DWWM 2026', options: { x: 9.6, y: 7.12, w: 3.15, h: 0.18, fontFace: 'Aptos', fontSize: 8.5, color: '6B6258', align: 'right', margin: 0 } } }
  ],
  slideNumber: { x: 12.83, y: 7.1, color: '9A6A27', fontSize: 8.5 }
});

const C = { ink: '171512', gold: 'C8892E', cream: 'F7F4EE', white: 'FFFFFF', muted: '6B6258', pale: 'EFE5D6', green: '3C7A57', red: 'A6423A', blue: '376B8D' };
const outDir = __dirname;
const imgDir = path.resolve(__dirname, '..', 'client', 'src', 'assets', 'images');

function title(slide, t, kicker) {
  if (kicker) slide.addText(kicker.toUpperCase(), { x: .62, y: .42, w: 4.5, h: .25, fontSize: 11, bold: true, color: C.gold, charSpacing: 1.8, margin: 0 });
  slide.addText(t, { x: .62, y: .76, w: 12.05, h: .62, fontSize: 28, bold: true, color: C.ink, margin: 0, breakLine: false, fit: 'shrink' });
}
function bullets(slide, items, x=.72, y=1.65, w=5.8, h=4.8, fontSize=19) {
  const runs=[];
  items.forEach((it,i)=>{ runs.push({text:it,options:{bullet:{indent:16},breakLine:i<items.length-1,hanging:4}}); });
  slide.addText(runs,{x,y,w,h,fontSize,color:C.ink,breakLine:false,margin:.08,paraSpaceAfterPt:14,breakLineOnOverflow:false,fit:'shrink',valign:'mid'});
}
function pill(slide,text,x,y,w,color=C.gold){slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h:.42,rectRadius:.08,fill:{color},line:{color},radius:.08});slide.addText(text,{x:x+.08,y:y+.08,w:w-.16,h:.2,fontSize:11,bold:true,color:C.white,align:'center',margin:0});}
function card(slide, heading, body, x,y,w,h, color=C.gold){slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:.08,fill:{color:C.white,transparency:2},line:{color:'DED4C7',width:1}});slide.addShape(pptx.ShapeType.rect,{x,y,w:.08,h,fill:{color},line:{color}});slide.addText(heading,{x:x+.28,y:y+.22,w:w-.5,h:.35,fontSize:16,bold:true,color:C.ink,margin:0});slide.addText(body,{x:x+.28,y:y+.72,w:w-.5,h:h-.9,fontSize:13.5,color:C.muted,margin:0,fit:'shrink',valign:'top',breakLine:false});}
function section(slide,num,label,sub){slide.background={color:C.ink};slide.addText(String(num).padStart(2,'0'),{x:.72,y:.65,w:2.2,h:1.1,fontSize:58,bold:true,color:C.gold,margin:0});slide.addText(label,{x:.72,y:2.05,w:11.8,h:.85,fontSize:38,bold:true,color:C.white,margin:0});slide.addText(sub,{x:.76,y:3.1,w:10.8,h:.65,fontSize:20,color:'D7CFC3',margin:0});}
function notes(slide, arr){ if (slide.addNotes) slide.addNotes(arr); }

// 1
{
 const s=pptx.addSlide(); s.background={color:C.ink};
 const bg=path.join(imgDir,'background.webp'); if(fs.existsSync(bg)) s.addImage({path:bg,x:7.2,y:0,w:6.13,h:7.5,transparency:25});
 s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.33,h:7.5,fill:{color:C.ink,transparency:18},line:{color:C.ink,transparency:100}});
 s.addText('SECARE',{x:.72,y:1.2,w:6.7,h:1.1,fontSize:52,bold:true,color:C.white,margin:0,charSpacing:1.5});
 s.addText('La coiffure à domicile, simplement',{x:.76,y:2.38,w:6.2,h:.55,fontSize:24,color:'E9D4B1',margin:0});
 s.addShape(pptx.ShapeType.line,{x:.76,y:3.18,w:2.3,h:0,line:{color:C.gold,width:4}});
 s.addText('Projet de formation • Titre professionnel DWWM',{x:.76,y:3.48,w:6.5,h:.42,fontSize:17,color:C.white,margin:0});
 s.addText('Ulrich AMOUSSOU  |  Wild Code School  |  2026',{x:.76,y:6.62,w:6.8,h:.3,fontSize:13,color:'CFC7BB',margin:0});
 notes(s,['Accroche : Secare met en relation des clients avec des coiffeurs à domicile.','Annoncer une présentation centrée sur le parcours utilisateur et le fonctionnement full-stack.']);
}
// 2
{
 const s=pptx.addSlide('MASTER'); title(s,'Plan de la présentation','35 minutes');
 const parts=[['01','Projet & besoins','5 min'],['02','Conception','5 min'],['03','Front-end','8 min'],['04','Back-end & données','10 min'],['05','Sécurité & bilan','7 min']];
 parts.forEach((p,i)=>{const y=1.65+i*.92;s.addText(p[0],{x:.78,y,w:.55,h:.38,fontSize:17,bold:true,color:C.gold,margin:0});s.addText(p[1],{x:1.55,y,w:5.2,h:.38,fontSize:20,bold:true,color:C.ink,margin:0});s.addText(p[2],{x:10.7,y,w:1.4,h:.32,fontSize:14,color:C.muted,align:'right',margin:0});s.addShape(pptx.ShapeType.line,{x:1.55,y:y+.52,w:10.55,h:0,line:{color:'DDD4C7',width:1}})});
 notes(s,['Présenter rapidement le plan et annoncer une démonstration courte si le temps le permet.']);
}
// 3
{
 const s=pptx.addSlide('MASTER'); title(s,'Le projet en une phrase','Contexte');
 s.addText('« Permettre à un client de trouver un coiffeur, choisir une prestation et réserver un rendez-vous, tout en donnant au professionnel les outils pour gérer son activité. »',{x:.85,y:1.65,w:11.65,h:1.35,fontSize:25,bold:true,color:C.ink,align:'center',valign:'mid',margin:.1,fit:'shrink'});
 card(s,'Client','Recherche, prestations, disponibilités, réservation et avis.',.72,3.5,3.7,1.65,C.blue);
 card(s,'Coiffeur','Profil, portfolio, prestations, planning et rendez-vous.',4.82,3.5,3.7,1.65,C.gold);
 card(s,'Administrateur','Supervision des comptes, activité et statistiques.',8.92,3.5,3.7,1.65,C.green);
 notes(s,['Projet réalisé en équipe de quatre pendant deux mois, à partir d’un besoin réel exprimé par le fondateur de Secare.']);
}
// 4
{
 const s=pptx.addSlide('MASTER'); title(s,'Périmètre du MVP','Expression des besoins');
 card(s,'Inclus','Création de compte\nRecherche de coiffeurs\nPrestations et disponibilités\nRéservation et suivi\nProfils et avis',.75,1.65,5.55,4.55,C.green);
 card(s,'Hors périmètre','Paiement en ligne\nMessagerie instantanée\nGéolocalisation en temps réel\nEnvoi complet d’e-mails',7.02,1.65,5.55,4.55,C.red);
 s.addText('Choix : garantir un parcours principal fonctionnel dans le temps disponible.',{x:2.1,y:6.42,w:9.2,h:.36,fontSize:16,bold:true,color:C.gold,align:'center',margin:0});
 notes(s,['Expliquer que la priorisation a permis de concentrer le travail sur la valeur principale : la réservation.']);
}
// 5
{
 const s=pptx.addSlide('MASTER'); title(s,'Organisation et environnement','Travail en équipe');
 bullets(s,['Monorepo TypeScript fourni et préconfiguré par la Wild Code School','Visual Studio Code, NPM et variables d’environnement .env','GitHub : branches par fonctionnalité et intégration progressive','Trello : User Stories, priorités, responsables et suivi','Biome : formatage et contrôle de cohérence du code'],.72,1.55,7.0,4.9,18);
 ['VS Code','NPM','Git / GitHub','Trello','Biome','.env'].forEach((v,i)=>pill(s,v,8.35+(i%2)*2.0,1.75+Math.floor(i/2)*1.18,1.65,i===5?C.green:C.gold));
 s.addText('Je l’ai utilisé et adapté au projet ; je ne l’ai pas créé.',{x:8.25,y:5.35,w:4.2,h:.85,fontSize:16,bold:true,color:C.ink,align:'center',margin:.08,fit:'shrink'});
 notes(s,['Être transparent : le socle du monorepo a été fourni par l’école.','Détailler l’installation des dépendances, le .env et le lancement du client et du serveur.']);
}
// 6
{
 const s=pptx.addSlide('MASTER'); title(s,'Du besoin à l’interface','Conception');
 const steps=[['1','Entretien','Comprendre le besoin'],['2','Wireframes','Structurer les parcours'],['3','Figma','Valider le rendu'],['4','React + CSS','Intégrer et adapter']];
 steps.forEach((p,i)=>{const x=.72+i*3.12;s.addShape(pptx.ShapeType.ellipse,{x:x+.8,y:1.65,w:.75,h:.75,fill:{color:C.gold},line:{color:C.gold}});s.addText(p[0],{x:x+.8,y:1.83,w:.75,h:.25,fontSize:17,bold:true,color:C.white,align:'center',margin:0});s.addText(p[1],{x,y:2.72,w:2.35,h:.35,fontSize:19,bold:true,color:C.ink,align:'center',margin:0});s.addText(p[2],{x,y:3.22,w:2.35,h:.7,fontSize:14,color:C.muted,align:'center',margin:0,fit:'shrink'});if(i<3)s.addShape(pptx.ShapeType.chevron,{x:x+2.35,y:1.81,w:.65,h:.42,fill:{color:'DAC7AA'},line:{color:'DAC7AA'}})});
 const logo=path.join(imgDir,'logoof.jpg'); if(fs.existsSync(logo))s.addImage({path:logo,x:4.95,y:4.55,w:3.4,h:1.14});
 notes(s,['Montrer une maquette mobile et desktop pendant la présentation.','Expliquer les choix de contraste noir, blanc et doré.']);
}
// 7
{
 const s=pptx.addSlide('MASTER'); title(s,'Une architecture full-stack séparée','Vue d’ensemble');
 const boxes=[['UTILISATEUR','Navigateur'],['FRONT-END','React • TypeScript'],['API','Node.js • Express'],['DONNÉES','MySQL']];
 boxes.forEach((b,i)=>{const x=.55+i*3.18;s.addShape(pptx.ShapeType.roundRect,{x,y:2.2,w:2.45,h:1.55,rectRadius:.08,fill:{color:i%2?C.ink:C.white},line:{color:i%2?C.ink:C.gold,width:2}});s.addText(b[0],{x:x+.12,y:2.52,w:2.2,h:.28,fontSize:13,bold:true,color:i%2?C.gold:C.gold,align:'center',margin:0});s.addText(b[1],{x:x+.12,y:3.02,w:2.2,h:.3,fontSize:17,bold:true,color:i%2?C.white:C.ink,align:'center',margin:0});if(i<3){s.addShape(pptx.ShapeType.chevron,{x:x+2.56,y:2.75,w:.48,h:.45,fill:{color:C.gold},line:{color:C.gold}})}});
 s.addText('Action utilisateur  →  requête HTTP  →  contrôles métier  →  requête SQL  →  réponse JSON  →  mise à jour de l’interface',{x:.85,y:4.65,w:11.6,h:.75,fontSize:18,bold:true,color:C.ink,align:'center',margin:.08,fit:'shrink'});
 notes(s,['Utiliser un exemple concret : la création d’un rendez-vous traverse toutes les couches.']);
}
// 8
{
 const s=pptx.addSlide('MASTER'); title(s,'Interfaces statiques et responsives','Front-end');
 bullets(s,['Composants React réutilisables','JSX pour structurer les contenus','CSS et variables dans :root','Adaptation mobile, tablette et desktop','Première prise en compte de l’accessibilité'],.75,1.55,5.45,4.7,19);
 const pic=path.join(imgDir,'SecareBarber.png'); if(fs.existsSync(pic))s.addImage({path:pic,x:7.15,y:1.42,w:3.35,h:5.03});
 s.addShape(pptx.ShapeType.roundRect,{x:10.72,y:2.08,w:1.75,h:3.75,rectRadius:.08,fill:{color:C.ink},line:{color:C.gold,width:2}});s.addText('MOBILE\nFIRST',{x:10.92,y:3.15,w:1.35,h:.9,fontSize:20,bold:true,color:C.white,align:'center',valign:'mid',margin:0});
 notes(s,['Préciser que l’espace administrateur a principalement été pensé pour desktop.']);
}
// 9
{
 const s=pptx.addSlide('MASTER'); title(s,'Une interface alimentée par l’API','Front-end dynamique');
 card(s,'1. Charger','Les hooks personnalisés envoient les requêtes et enregistrent les données.',.65,1.65,3.65,2.0,C.blue);
 card(s,'2. Interagir','Les états React conservent recherche, formulaire, chargement et erreurs.',4.82,1.65,3.65,2.0,C.gold);
 card(s,'3. Afficher','Le rendu se met à jour sans rechargement complet de la page.',8.98,1.65,3.65,2.0,C.green);
 s.addText('Exemple personnel : recherche des coiffeurs par nom ou par ville, puis transmission des résultats au carrousel.',{x:1.05,y:4.55,w:11.2,h:1.0,fontSize:23,bold:true,color:C.ink,align:'center',valign:'mid',margin:.08,fit:'shrink'});
 notes(s,['Montrer le code de searchValue et le hook useBarbers.','Expliquer le cycle : saisie, mise à jour de l’état, filtre, nouveau rendu.']);
}
// 10
{
 const s=pptx.addSlide('MASTER'); title(s,'Ma contribution principale','Gestion des prestations');
 s.addText('CRUD complet',{x:.72,y:1.52,w:4.1,h:.55,fontSize:27,bold:true,color:C.gold,margin:0});
 const acts=[['C','Créer','POST'],['R','Consulter','GET'],['U','Modifier','PUT'],['D','Supprimer','DELETE']];
 acts.forEach((a,i)=>{const x=.72+i*3.05;s.addShape(pptx.ShapeType.roundRect,{x,y:2.35,w:2.45,h:1.5,rectRadius:.08,fill:{color:i%2?C.pale:C.white},line:{color:C.gold,width:1.3}});s.addText(a[0],{x:x+.15,y:2.63,w:.55,h:.55,fontSize:25,bold:true,color:C.gold,margin:0});s.addText(a[1],{x:x+.72,y:2.58,w:1.52,h:.32,fontSize:17,bold:true,color:C.ink,margin:0});s.addText(a[2],{x:x+.72,y:3.12,w:1.3,h:.25,fontSize:12,color:C.muted,margin:0})});
 bullets(s,['Formulaire contrôlé','Conversion du prix et de la durée','Appels à l’API protégée','Actualisation après chaque action'],1.0,4.55,11.2,1.55,17);
 notes(s,['Dire clairement : j’ai pris en charge la page BarberPrestation.','Expliquer une opération de bout en bout, de l’interface jusqu’à MySQL.']);
}
// 11
{
 const s=pptx.addSlide('MASTER'); title(s,'Le parcours de réservation','Fonctionnalité représentative');
 const steps=['Choisir un coiffeur','Choisir une prestation','Date, heure et lieu','Vérifier le récapitulatif','Confirmer'];
 steps.forEach((v,i)=>{const y=1.55+i*.95;s.addShape(pptx.ShapeType.ellipse,{x:1.0,y,w:.5,h:.5,fill:{color:i===4?C.green:C.gold},line:{color:i===4?C.green:C.gold}});s.addText(String(i+1),{x:1,y:y+.12,w:.5,h:.2,fontSize:12,bold:true,color:C.white,align:'center',margin:0});s.addText(v,{x:1.78,y:y+.04,w:5.0,h:.36,fontSize:19,bold:true,color:C.ink,margin:0});if(i<4)s.addShape(pptx.ShapeType.line,{x:1.25,y:y+.52,w:0,h:.43,line:{color:'CAB99F',width:2}})});
 card(s,'Gestion de l’interface','booking conserve les choix\nisSubmitting bloque le double clic\nerror affiche un retour compréhensible\nsuccess confirme l’enregistrement',7.2,1.62,5.25,4.72,C.blue);
 notes(s,['Faire le lien entre expérience utilisateur et cohérence des données.']);
}
// 12
{
 const s=pptx.addSlide('MASTER'); title(s,'Une base relationnelle cohérente','MySQL');
 const entities=[['users','Compte commun'],['customer','Profil client'],['barber','Profil professionnel'],['appointment','Rendez-vous'],['prestation','Service'],['review','Avis']];
 entities.forEach((e,i)=>{const col=i%3,row=Math.floor(i/3),x=.7+col*4.15,y=1.55+row*2.15;card(s,e[0],e[1],x,y,3.65,1.45,i<3?C.gold:C.blue)});
 s.addText('Clés primaires + clés étrangères + table de liaison propose',{x:1.2,y:6.05,w:10.9,h:.45,fontSize:18,bold:true,color:C.ink,align:'center',margin:0});
 notes(s,['Montrer ensuite le MCD complet dans le dossier.','Expliquer pourquoi propose est une relation plusieurs-à-plusieurs.']);
}
// 13
{
 const s=pptx.addSlide('MASTER'); title(s,'De la route à la requête SQL','Accès aux données');
 const flow=[['Route','GET /api/barbers'],['Action','browse()'],['Repository','Requête SQL + jointures'],['Réponse','JSON vers React']];
 flow.forEach((v,i)=>{const x=.6+i*3.18;s.addShape(pptx.ShapeType.roundRect,{x,y:2.15,w:2.55,h:1.72,rectRadius:.08,fill:{color:i===2?C.ink:C.white},line:{color:C.gold,width:1.5}});s.addText(v[0],{x:x+.18,y:2.46,w:2.2,h:.3,fontSize:17,bold:true,color:C.gold,align:'center',margin:0});s.addText(v[1],{x:x+.2,y:3.02,w:2.15,h:.48,fontSize:13.5,color:i===2?C.white:C.ink,align:'center',margin:0,fit:'shrink'});if(i<3)s.addShape(pptx.ShapeType.chevron,{x:x+2.62,y:2.8,w:.42,h:.38,fill:{color:C.gold},line:{color:C.gold}})});
 s.addText('La requête rassemble le profil, les prestations, les rendez-vous et les avis ; elle calcule aussi la note moyenne et le prix minimum.',{x:1.1,y:4.75,w:11.1,h:1.0,fontSize:20,bold:true,color:C.ink,align:'center',valign:'mid',margin:.08,fit:'shrink'});
 notes(s,['Contribution personnelle : expliquer barberActions.ts et barberRepository.ts.']);
}
// 14
{
 const s=pptx.addSlide('MASTER'); title(s,'Authentifier puis autoriser','Sécurité');
 const steps=['Validation des champs','Hachage Argon2','Création du compte','Connexion','Signature du JWT','Contrôle du rôle'];
 steps.forEach((v,i)=>{const x=.55+i*2.08;s.addShape(pptx.ShapeType.roundRect,{x,y:2.0,w:1.72,h:1.25,rectRadius:.06,fill:{color:i===5?C.green:C.ink},line:{color:i===5?C.green:C.ink}});s.addText(v,{x:x+.12,y:2.37,w:1.48,h:.5,fontSize:13.5,bold:true,color:C.white,align:'center',valign:'mid',margin:0,fit:'shrink'});if(i<5)s.addShape(pptx.ShapeType.chevron,{x:x+1.75,y:2.43,w:.28,h:.38,fill:{color:C.gold},line:{color:C.gold}})});
 card(s,'Principe essentiel','Masquer un bouton dans React ne suffit pas : le serveur vérifie toujours l’identité, le rôle et la propriété de la ressource.',2.25,4.28,8.85,1.5,C.red);
 notes(s,['Donner l’exemple : un coiffeur ne peut modifier que son propre profil.','En cas de droits insuffisants, le serveur renvoie 403 Forbidden.']);
}
// 15
{
 const s=pptx.addSlide('MASTER'); title(s,'Jeu d’essai : contrôle d’accès','Preuve fonctionnelle');
 const rows=[['Entrée','Un coiffeur authentifié tente de modifier le profil d’un autre coiffeur.'],['Attendu','Le serveur refuse l’opération et ne modifie aucune donnée.'],['Obtenu','Réponse HTTP 403 Forbidden ; profil inchangé en base.'],['Conclusion','Le contrôle d’autorisation est bien appliqué côté serveur.']];
 rows.forEach((r,i)=>{const y=1.48+i*1.2;s.addShape(pptx.ShapeType.roundRect,{x:.75,y,w:2.0,h:.78,rectRadius:.05,fill:{color:i===2?C.green:C.ink},line:{color:i===2?C.green:C.ink}});s.addText(r[0],{x:.9,y:y+.23,w:1.7,h:.25,fontSize:15,bold:true,color:C.white,align:'center',margin:0});s.addText(r[1],{x:3.05,y:y+.08,w:9.4,h:.62,fontSize:17,color:C.ink,margin:.05,fit:'shrink',valign:'mid'});});
 s.addText('À montrer : requête, réponse, puis vérification de la base.',{x:2.2,y:6.42,w:8.9,h:.32,fontSize:15,bold:true,color:C.gold,align:'center',margin:0});
 notes(s,['N’annoncer « obtenu » que si ce comportement a été vérifié avant l’oral. Sinon, effectuer le test avant l’examen.']);
}
// 16
{
 const s=pptx.addSlide('MASTER'); title(s,'Veille et vigilance de sécurité','Amélioration continue');
 card(s,'Risque surveillé','Contrôle d’accès insuffisant : un utilisateur pourrait agir sur une ressource qui ne lui appartient pas.',.72,1.55,5.7,2.05,C.red);
 card(s,'Réponse appliquée','Vérification du JWT, du rôle et de l’identifiant côté serveur avant l’accès aux données.',6.88,1.55,5.7,2.05,C.green);
 bullets(s,['Mots de passe hachés avec Argon2','Secrets placés dans .env','Requêtes SQL paramétrées à expliquer','Pistes : limitation des tentatives, jetons mieux protégés, validation renforcée'],1.2,4.05,10.9,2.05,17);
 notes(s,['Citer les sources de veille réellement consultées : documentation officielle et OWASP si cela correspond à ton travail.','Ne pas inventer une source non consultée.']);
}
// 17
{
 const s=pptx.addSlide('MASTER'); title(s,'Limites identifiées et prochaines étapes','Prise de recul');
 const data=[['Double réservation','Renforcer les contrôles métier'],['Tests automatisés','Couvrir les parcours critiques'],['Mot de passe oublié','Jeton temporaire et envoi d’e-mail'],['RGPD','Durées de conservation et droits'],['Mise en production','Documenter et sécuriser le déploiement']];
 data.forEach((d,i)=>{const y=1.48+i*.98;s.addText(d[0],{x:.82,y,w:3.05,h:.34,fontSize:17,bold:true,color:C.ink,margin:0});s.addShape(pptx.ShapeType.chevron,{x:4.12,y:y+.02,w:.42,h:.36,fill:{color:C.gold},line:{color:C.gold}});s.addText(d[1],{x:4.85,y,w:7.35,h:.4,fontSize:17,color:C.muted,margin:0});s.addShape(pptx.ShapeType.line,{x:.82,y:y+.58,w:11.35,h:0,line:{color:'DED5C9',width:1}})});
 notes(s,['Valoriser cette diapositive : savoir identifier les limites est une compétence professionnelle.']);
}
// 18
{
 const s=pptx.addSlide(); s.background={color:C.ink};
 s.addText('BILAN',{x:.7,y:.65,w:2.8,h:.5,fontSize:18,bold:true,color:C.gold,charSpacing:2,margin:0});
 s.addText('Ce que Secare m’a appris',{x:.7,y:1.35,w:8.8,h:.75,fontSize:38,bold:true,color:C.white,margin:0});
 bullets(s,['Relier l’interface, l’API et la base de données','Concevoir des parcours différents selon les rôles','Protéger les actions sensibles côté serveur','Travailler en équipe avec Git et GitHub','Transformer un besoin réel en MVP fonctionnel'],.8,2.35,7.4,3.4,18);
 s.addText('Merci',{x:9.3,y:2.0,w:2.9,h:.8,fontSize:42,bold:true,color:C.gold,align:'center',margin:0});
 s.addText('Questions ?',{x:9.3,y:3.0,w:2.9,h:.5,fontSize:24,color:C.white,align:'center',margin:0});
 s.addText('Démonstration : accueil → connexion → prestation → réservation',{x:8.55,y:5.15,w:4.25,h:.85,fontSize:15,color:'D7CFC3',align:'center',margin:.05,fit:'shrink'});
 notes(s,['Terminer sur la progression personnelle et la cohérence entre les couches.','Inviter le jury à poser ses questions.']);
}

// HTML imprimable : chaque slide est rendue comme une page 16:9.
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const htmlSlides = [
 ['SECARE','La coiffure à domicile, simplement','Projet de formation • Titre professionnel DWWM'],
 ['Plan de la présentation','01 Projet & besoins • 02 Conception • 03 Front-end • 04 Back-end & données • 05 Sécurité & bilan','35 minutes'],
 ['Le projet en une phrase','Permettre à un client de trouver un coiffeur, choisir une prestation et réserver un rendez-vous.','Trois espaces : client • coiffeur • administrateur'],
 ['Périmètre du MVP','Inclus : comptes, recherche, prestations, disponibilités, réservation, profils et avis.','Hors périmètre : paiement, messagerie, géolocalisation et e-mails complets.'],
 ['Organisation et environnement','Monorepo fourni par la Wild Code School • VS Code • NPM • .env','GitHub • branches • Trello • Biome'],
 ['Du besoin à l’interface','Entretien → wireframes → Figma → React + CSS','Une conception adaptée aux différentes tailles d’écran'],
 ['Architecture full-stack','Navigateur → React / TypeScript → API Express → MySQL','Requête HTTP • contrôles métier • SQL • réponse JSON'],
 ['Interfaces statiques et responsives','Composants réutilisables • JSX • CSS • variables globales','Mobile, tablette et desktop • première prise en compte de l’accessibilité'],
 ['Front-end dynamique','Hooks personnalisés • états React • appels API • rendu conditionnel','Exemple : recherche des coiffeurs par nom ou par ville'],
 ['Ma contribution : prestations','CRUD complet : créer • consulter • modifier • supprimer','Formulaire contrôlé • API protégée • actualisation des données'],
 ['Parcours de réservation','Coiffeur → prestation → date, heure et lieu → récapitulatif → confirmation','Gestion du chargement, des erreurs et de la confirmation'],
 ['Base de données MySQL','users • customer • barber • appointment • prestation • review','Clés primaires, clés étrangères et table de liaison propose'],
 ['De la route à SQL','Route → action → repository → requête SQL → JSON','Exemple personnel : GET /api/barbers'],
 ['Authentification et autorisation','Validation → Argon2 → compte → connexion → JWT → contrôle du rôle','Les protections sensibles sont toujours appliquées côté serveur.'],
 ['Jeu d’essai','Entrée : modification du profil d’un autre coiffeur.','Attendu et obtenu : HTTP 403, aucune modification en base.'],
 ['Veille de sécurité','Risque : contrôle d’accès insuffisant.','Réponse : JWT, rôle et propriété de la ressource vérifiés côté serveur.'],
 ['Limites et prochaines étapes','Double réservation • tests automatisés • mot de passe oublié','RGPD • sécurisation et documentation de la mise en production'],
 ['Ce que Secare m’a appris','Relier l’interface, l’API et la base • travailler en équipe • sécuriser les actions','Merci — Questions ?']
];
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>@page{size:13.333in 7.5in;margin:0}*{box-sizing:border-box}body{margin:0;background:#ddd;font-family:Arial,sans-serif}.slide{width:13.333in;height:7.5in;page-break-after:always;background:#f7f4ee;padding:.7in;position:relative;overflow:hidden;border-top:.11in solid #c8892e}.slide:first-child,.slide:last-child{background:#171512;color:white}.n{position:absolute;right:.45in;bottom:.25in;color:#9a6a27;font-size:11pt}.k{color:#c8892e;font-size:13pt;font-weight:bold;letter-spacing:2px;text-transform:uppercase}.slide h1{font-size:32pt;margin:.28in 0 .55in;color:#171512}.slide:first-child h1,.slide:last-child h1{font-size:50pt;color:white;margin-top:1.05in}.lead{font-size:24pt;font-weight:bold;line-height:1.35;max-width:11.5in}.sub{font-size:17pt;color:#6b6258;line-height:1.5;margin-top:.5in;max-width:11.2in}.slide:first-child .sub,.slide:last-child .sub{color:#ded5c9}.bar{position:absolute;left:.7in;bottom:.72in;width:2.2in;border-top:5px solid #c8892e}</style></head><body>${htmlSlides.map((a,i)=>`<section class="slide"><div class="k">SECARE • DWWM 2026</div><h1>${esc(a[0])}</h1><div class="lead">${esc(a[1])}</div><div class="sub">${esc(a[2])}</div><div class="bar"></div><div class="n">${i+1} / ${htmlSlides.length}</div></section>`).join('')}</body></html>`;
fs.writeFileSync(path.join(outDir,'SECARE-presentation.html'),html,'utf8');

pptx.writeFile({ fileName: path.join(outDir,'SECARE-Presentation-DWWM-Ulrich-Amoussou.pptx') });
