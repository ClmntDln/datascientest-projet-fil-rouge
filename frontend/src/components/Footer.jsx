import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => (
    <footer>
        <div className='footer-container container-large'>
            <div className='footer-content-col'>
                <h2 className='footer-title'>Weeb</h2>
                <p className='footer-tagline'>Le blog qui décrypte le web.</p>
            </div>
            <div className='footer-content-col'>
                <h3 className='footer-content-col-title'>Navigation</h3>
                <ul>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/confidentialite">Confidentialité</Link></li>
                </ul>
            </div>
            <div className='footer-content-col'>
                <h3 className='footer-content-col-title'>Compte</h3>
                <ul>
                    <li><Link to="/login">Connexion</Link></li>
                    <li><Link to="/signup">Inscription</Link></li>
                    <li><Link to="/compte">Mon compte</Link></li>
                </ul>
            </div>
        </div>
        <div className='footer-bottom container-large'>
            <p>© 2026 Weeb. Tous droits réservés. <Link to="/confidentialite">Confidentialité</Link></p>
            <div className='footer-social-links'>
                <a href="#" aria-label="YouTube"><FaYoutube size={22} /></a>
                <a href="#" aria-label="Facebook"><FaFacebookF size={22} /></a>
                <a href="#" aria-label="Twitter"><FaTwitter size={22} /></a>
                <a href="#" aria-label="Instagram"><FaInstagram size={22} /></a>
                <a href="#" aria-label="LinkedIn"><FaLinkedinIn size={22} /></a>
            </div>
        </div>
    </footer>
);

export default Footer;
