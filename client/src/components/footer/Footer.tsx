import "./Footer.css";
import { FaInstagram } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h2 className="footer__brand-name">Secare</h2>

          <p className="footer__description">
            Réservez votre coiffeur en quelques clics grâce à une expérience
            simple, rapide et élégante.
          </p>

          <div className="footer__socials">
            <button
              type="button"
              className="footer__social"
              onClick={() =>
                (window.location.href = "mailto:contact@secare.com")
              }
            >
              <FiMail />
            </button>

            <a
              href="https://www.instagram.com/secare.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer__column">
          <h3>Navigation</h3>

          <a href="/">Accueil</a>
          <a href="/search">Coiffeurs</a>
          <a href="/booking">Réserver</a>
          <a href="/login">Mon profil</a>
        </div>

        <div className="footer__column">
          <h3>Informations</h3>

          <a href="/mentions-legales">Mentions légales</a>
          <a href="/confidentialite">Confidentialité</a>
          <a href="/cgu">CGU</a>
        </div>
      </div>

      <div className="footer__bottom">
        © {new Date().getFullYear()} Secare — Projet réalisé à la Wild Code
        School
      </div>
    </footer>
  );
}
export default Footer;
