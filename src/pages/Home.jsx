import HomeHero from '../components/home_hero'
import HomeSection from '../components/home_section'
import HomeLogo from '../components/home_logo'


const Home = () => {
    return (
        <>
            <HomeHero />
            <HomeLogo />
            <HomeSection
                subtitle="Des ressources pour tous les niveaux"
                title={<>Apprenez <span>et</span> progressez</>}
                description="Que vous débutiez en développement web ou que vous soyez un expert cherchant à approfondir vos connaissances, nous vous proposons des tutoriels, guides et bonnes pratiques pour apprendre efficacement"
                buttonLink="#"
                buttonText="Explorer les ressources"
                image="https://placehold.co/415"
                positionImage="left"
            />
            <HomeSection 
                subtitle="Le Web, un écosystème en constante évolution" 
                title={<><span>Restez informé des dernières</span> tendances</>} 
                description="Chaque semaine, nous analysons les nouveautés du web : frameworks émergents, bonnes pratiques SEO, accessibilité, et bien plus encore. Ne manquez aucune actualité du digital !" 
                buttonLink="#" 
                buttonText="Lire les articles récents" 
                image="https://placehold.co/415" 
                positionImage="right" 
            />
        </>
    );
};

export default Home;
