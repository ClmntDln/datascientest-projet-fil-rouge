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
                        <li><Link to="/">Tarifs</Link></li>
                        <li><Link to="/">Aperçu</Link></li>
                        <li><Link to="/">Accessibilité</Link></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Solutions</h3>
                    <ul>
                        <li><Link to="/">Brainstorming</Link></li>
                        <li><Link to="/">Idéation</Link></li>
                        <li><Link to="/">Maquettage</Link></li>
                        <li><Link to="/">Recherche</Link></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Ressources</h3>
                    <ul>
                        <li><Link to="/">Centre d'aide</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/">Tutoriels</Link></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Entreprise</h3>
                    <ul>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/">Presse</Link></li>
                        <li><Link to="/">Événements</Link></li>
                        <li><Link to="/">Carrières</Link></li>
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
