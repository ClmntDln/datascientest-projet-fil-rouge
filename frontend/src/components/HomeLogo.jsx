import reactLogo from '../assets/logo-react.svg';
import viteLogo from '../assets/logo-vite.svg';
import nextLogo from '../assets/logo-next.svg';
import tailwindLogo from '../assets/logo-tailwind.svg';
import tsLogo from '../assets/logo-typescript.svg';
import jsLogo from '../assets/logo-javascript.svg';
import htmlLogo from '../assets/logo-html.svg';

const logos = [
    { id: 'react', name: 'React', image: reactLogo },
    { id: 'vite', name: 'Vite', image: viteLogo },
    { id: 'next', name: 'Next.js', image: nextLogo },
    { id: 'tailwind', name: 'Tailwind CSS', image: tailwindLogo },
    { id: 'typescript', name: 'TypeScript', image: tsLogo },
    { id: 'javascript', name: 'JavaScript', image: jsLogo },
    { id: 'html', name: 'HTML', image: htmlLogo },
];

const HomeLogo = () => (
    <section className="home-logo-container container-narrow">
        <h2 className="home-logo-title">Ils nous font confiance</h2>
        <div className="home-logo-marquee">
            <div className="home-logo-track">
                {[...logos, ...logos].map((logo, i) => (
                    <div key={`${logo.id}-${i}`} className="home-logo-item">
                        <img src={logo.image} alt={logo.name} loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default HomeLogo;
