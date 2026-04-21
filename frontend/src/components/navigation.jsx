import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ logo }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const close = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        close();
        navigate('/');
    };

    return (
        <header className='navigation-wrapper'>
            <div className='navigation-container'>
                <Link to="/" className='navigation-brand' onClick={close}>
                    <img src={logo} alt="Weeb" className='navigation-logo' />
                </Link>

                <button
                    type="button"
                    className='navigation-toggle'
                    aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>

                <nav className={`navigation-menu ${menuOpen ? 'open' : ''}`}>
                    <ul className='navigation-list'>
                        <li className='navigation-item'><Link to="/blog" onClick={close}>Blog</Link></li>
                        <li className='navigation-item'><Link to="/contact" onClick={close}>Contact</Link></li>
                        {user?.is_active && (
                            <li className='navigation-item'><Link to="/blog/nouveau" onClick={close}>Nouvel article</Link></li>
                        )}
                        {user?.is_staff && (
                            <li className='navigation-item'><Link to="/admin/utilisateurs" onClick={close}>Admin</Link></li>
                        )}
                    </ul>
                    <div className='navigation-buttons'>
                        {user ? (
                            <>
                                <span className='navigation-user'>{user.first_name}</span>
                                <button type="button" className='navigation-button' onClick={handleLogout}>Déconnexion</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className='navigation-button navigation-button-primary' onClick={close}>Connexion</Link>
                                <Link to="/signup" className='navigation-button' onClick={close}>S'enregistrer</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navigation;
