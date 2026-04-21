import reactLogo from '../assets/logo-react.svg';
import viteLogo from '../assets/logo-vite.svg';
import nextLogo from '../assets/logo-next.svg';
import tailwindLogo from '../assets/logo-tailwind.svg';
import tsLogo from '../assets/logo-typescript.svg';
import jsLogo from '../assets/logo-javascript.svg';
import htmlLogo from '../assets/logo-html.svg';

const logos = [
    { id: 1, name: 'React', image: reactLogo },
    { id: 2, name: 'Vite', image: viteLogo },
    { id: 3, name: 'Next.js', image: nextLogo },
    { id: 4, name: 'Tailwind CSS', image: tailwindLogo },
    { id: 5, name: 'TypeScript', image: tsLogo },
    { id: 6, name: 'JavaScript', image: jsLogo },
    { id: 7, name: 'HTML', image: htmlLogo },
];

const HomeLogo = () => {
    return (
        <section className='home-logo-container container-narrow'>
            <h2 className='home-logo-title'>Ils nous font confiance</h2>
            <div className='home-logo-marquee'>
                <div className='home-logo-track'>
                    {[...logos, ...logos].map((logo, i) => (
                        <div key={`${logo.id}-${i}`} className='home-logo-item'>
                            <img src={logo.image} alt={logo.name} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeLogo;
