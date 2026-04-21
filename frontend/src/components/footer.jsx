import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer>
            <div className='footer-container container-large'>
                <div className='footer-content-col'>
                    <h2 className='footer-title'>Weeb</h2>
                    <p className='footer-tagline'>Le blog qui décrypte le web.</p>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Produit</h3>
                    <ul>
                        <li><a href="#">Tarifs</a></li>
                        <li><a href="#">Aperçu</a></li>
                        <li><a href="#">Accessibilité</a></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Solutions</h3>
                    <ul>
                        <li><a href="#">Brainstorming</a></li>
                        <li><a href="#">Idéation</a></li>
                        <li><a href="#">Maquettage</a></li>
                        <li><a href="#">Recherche</a></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Ressources</h3>
                    <ul>
                        <li><a href="#">Centre d'aide</a></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><a href="#">Tutoriels</a></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Entreprise</h3>
                    <ul>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><a href="#">Presse</a></li>
                        <li><a href="#">Événements</a></li>
                        <li><a href="#">Carrières</a></li>
                    </ul>
                </div>
            </div>
            <div className='footer-bottom container-large'>
                <p>© 2026 Weeb. Tous droits réservés.</p>
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
};

export default Footer;
