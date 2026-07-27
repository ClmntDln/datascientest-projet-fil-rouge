import { Link } from 'react-router-dom';
import HomeHero from '../components/HomeHero';
import HomeSection from '../components/HomeSection';
import HomeLogo from '../components/HomeLogo';
import sectionLearn from '../assets/section-learn.svg';
import sectionTrends from '../assets/section-trends.svg';

const Home = () => {
    return (
        <>
            <HomeHero />
            <HomeLogo />
            <HomeSection
                subtitle="Des ressources pour tous les niveaux"
                title={
                    <>
                        Apprenez <span>et</span> progressez
                    </>
                }
                description="Que vous débutiez en développement web ou que vous soyez un expert cherchant à approfondir vos connaissances, nous vous proposons des tutoriels, guides et bonnes pratiques pour apprendre efficacement."
                buttonLink="/blog"
                buttonText="Explorer les ressources"
                image={sectionLearn}
                imageAlt="Illustration apprentissage et progression web"
                positionImage="left"
            />
            <HomeSection
                subtitle="Le Web, un écosystème en constante évolution"
                title={
                    <>
                        <span>Restez informé des dernières</span> tendances
                    </>
                }
                description="Chaque semaine, nous analysons les nouveautés du web : frameworks émergents, bonnes pratiques SEO, accessibilité, et bien plus encore. Ne manquez aucune actualité du digital !"
                buttonLink="/blog"
                buttonText="Lire les articles récents"
                image={sectionTrends}
                imageAlt="Illustration tendances et actualités du web"
                positionImage="right"
            />
            <section id="newsletter" className="home-newsletter-section">
                <div className="newsletter-box">
                    <h2 className="newsletter-title">Restez informé</h2>
                    <p className="newsletter-description">
                        Consultez le blog Weeb pour nos derniers articles et
                        tutoriels.
                    </p>
                    <Link to="/blog" className="newsletter-button">
                        Découvrir le blog
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Home;
