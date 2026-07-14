import HomeHero from '../components/home_hero';
import HomeSection from '../components/home_section';
import HomeLogo from '../components/home_logo';
import sectionLearn from '../assets/section-learn.svg';
import sectionTrends from '../assets/section-trends.svg';

const Home = () => {
    return (
        <>
            <HomeHero />
            <HomeLogo />
            <HomeSection
                subtitle="Des ressources pour tous les niveaux"
                title={<>Apprenez <span>et</span> progressez</>}
                description="Que vous débutiez en développement web ou que vous soyez un expert cherchant à approfondir vos connaissances, nous vous proposons des tutoriels, guides et bonnes pratiques pour apprendre efficacement."
                buttonLink="/blog"
                buttonText="Explorer les ressources"
                image={sectionLearn}
                positionImage="left"
            />
            <HomeSection
                subtitle="Le Web, un écosystème en constante évolution"
                title={<><span>Restez informé des dernières</span> tendances</>}
                description="Chaque semaine, nous analysons les nouveautés du web : frameworks émergents, bonnes pratiques SEO, accessibilité, et bien plus encore. Ne manquez aucune actualité du digital !"
                buttonLink="/blog"
                buttonText="Lire les articles récents"
                image={sectionTrends}
                positionImage="right"
            />
            <section id="newsletter" className="home-newsletter-section">
                <div className="newsletter-box">
                    <h2 className="newsletter-title">Abonnez-vous à notre newsletter</h2>
                    <p className="newsletter-description">Recevez chaque semaine nos meilleurs articles, tutoriels et astuces directement dans votre boîte mail.</p>
                    <form className="newsletter-form" onSubmit={(e) => {
                        e.preventDefault();
                        alert("Merci pour votre abonnement ! Vous recevrez bientôt nos actualités.");
                        e.target.reset();
                    }}>
                        <input type="email" placeholder="Votre adresse email" required className="newsletter-input" />
                        <button type="submit" className="newsletter-button">S'abonner</button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Home;
