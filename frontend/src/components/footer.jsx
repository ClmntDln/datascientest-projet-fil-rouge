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
                        <li><Link to="/blog">Tarifs</Link></li>
                        <li><Link to="/blog">Aperçu</Link></li>
                        <li><Link to="/contact">Accessibilité</Link></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Solutions</h3>
                    <ul>
                        <li><Link to="/blog">Brainstorming</Link></li>
                        <li><Link to="/blog">Idéation</Link></li>
                        <li><Link to="/blog">Maquettage</Link></li>
                        <li><Link to="/blog">Recherche</Link></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Ressources</h3>
                    <ul>
                        <li><Link to="/contact">Centre d'aide</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/blog">Tutoriels</Link></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Entreprise</h3>
                    <ul>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/contact">Presse</Link></li>
                        <li><Link to="/contact">Événements</Link></li>
                        <li><Link to="/contact">Carrières</Link></li>
                    </ul>
                </div>
            </div>
            <div className='footer-bottom container-large'>
                <p>© 2026 Weeb. Tous droits réservés.</p>
                <div className='footer-social-links'>
                    <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube size={22} /></a>
                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF size={22} /></a>
                    <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter size={22} /></a>
                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram size={22} /></a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn size={22} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
