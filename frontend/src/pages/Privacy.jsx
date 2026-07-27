import { Link } from 'react-router-dom';

const Privacy = () => (
    <section className="login-container container-narrow page-message">
        <h1 className="login-title">Politique de confidentialité</h1>
        <div className="privacy-content">
            <p>
                Weeb collecte uniquement les données nécessaires au
                fonctionnement du service : identité, email, articles publiés et
                messages de contact.
            </p>
            <p>
                Les mots de passe sont hachés et ne sont jamais stockés en
                clair. L'authentification repose sur des tokens JWT à durée
                limitée.
            </p>
            <p>
                Conformément au RGPD, vous pouvez exporter ou supprimer vos
                données depuis la page{' '}
                <Link to="/compte" className="login-signup-link">
                    Mon compte
                </Link>
                .
            </p>
            <p>
                Le formulaire de contact requiert un consentement explicite au
                traitement des données personnelles.
            </p>
            <p>
                Pour toute question :{' '}
                <Link to="/contact" className="login-signup-link">
                    contactez-nous
                </Link>
                .
            </p>
        </div>
    </section>
);

export default Privacy;
