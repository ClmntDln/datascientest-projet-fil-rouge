import { Link } from 'react-router-dom';

const HomeHero = () => {
    return (
        <section className='home-hero-container container-narrow'>
            <h1 className='home-hero-title'>Explorez le <span className="thin">Web</span> sous toutes ses <span className="underline">facettes</span></h1>
            <p className='home-hero-description'>Le monde du web évolue constamment, et nous sommes là pour vous guider à travers ses tendances, technologies et meilleures pratiques. Que vous soyez développeur, designer ou passionné du digital, notre blog vous offre du contenu de qualité pour rester à la pointe.</p>
            <div className='home-hero-buttons'>
                <Link to="/blog" className='home-hero-button home-hero-button-primary'>Découvrir les articles</Link>
                <a href="#newsletter" className='home-hero-button home-hero-button-secondary'>S'abonner à la newsletter</a>
            </div>
        </section>
    );
};

export default HomeHero;
