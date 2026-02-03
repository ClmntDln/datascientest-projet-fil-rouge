import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer>
            <div className='footer-container container-large'>
                <div className='footer-content-col'>
                    <h2 className='footer-title'>Weeb</h2>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Product</h3>
                    <ul>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Overview</a></li>
                        <li><a href="#">Browse</a></li>
                        <li><a href="#">Accessibility</a></li>
                        <li><a href="#">Five</a></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Solutions</h3>
                    <ul>
                        <li><a href="#">Brainstorming</a></li>
                        <li><a href="#">Ideation</a></li>
                        <li><a href="#">Wireframing</a></li>
                        <li><a href="#">Research</a></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Resources</h3>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Tutorials</a></li>
                    </ul>
                </div>
                <div className='footer-content-col'>
                    <h3 className='footer-content-col-title'>Company</h3>
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Events</a></li>
                        <li><a href="#">Careers</a></li>  
                    </ul>
                </div>
                
            </div>
            <div className='footer-bottom container-large'>
                <p>© 2025 Weeb, Inc. All rights reserved.</p>
                
                <div className='footer-social-links'>
                    <a href="#" aria-label="YouTube"><FaYoutube size={24} /></a>
                    <a href="#" aria-label="Facebook"><FaFacebookF size={24} /></a>
                    <a href="#" aria-label="Twitter"><FaTwitter size={24} /></a>
                    <a href="#" aria-label="Instagram"><FaInstagram size={24} /></a>
                    <a href="#" aria-label="LinkedIn"><FaLinkedinIn size={24} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;