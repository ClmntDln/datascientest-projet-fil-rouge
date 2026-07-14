import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <section className="notfound-container container-narrow">
            <h1 className="notfound-code">404</h1>
            <h2 className="notfound-title">Page introuvable</h2>
            <p className="notfound-description">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link to="/" className="home-hero-button home-hero-button-primary notfound-button">
                Retourner à l'accueil
            </Link>
        </section>
    );
};

export default NotFound;
