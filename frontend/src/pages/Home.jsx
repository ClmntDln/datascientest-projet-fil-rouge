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
        </>
    );
};

export default Home;
