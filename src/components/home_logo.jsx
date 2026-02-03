const logos = [
    {
        id: 1,
        name: "React",
        image: "https://placehold.co/150"
    },
    {
        id: 2,
        name: "Vite",
        image: "https://placehold.co/150"
    },
    {
        id: 3,
        name: "Next.js",
        image: "https://placehold.co/150"
    },
    {
        id: 4,
        name: "Tailwind CSS",
        image: "https://placehold.co/150"
    },
    {
        id: 5,
        name: "TypeScript",
        image: "https://placehold.co/150"
    },
    {
        id: 6,
        name: "JavaScript",
        image: "https://placehold.co/150"
    },
    {
        id: 7,
        name: "HTML",
        image: "https://placehold.co/150"
    }
]

const HomeLogo = () => {
    return (
        <section className='home-logo-container container-narrow'>
            <h2 className='home-logo-title'>Ils nous font confiance</h2>
            <div className='home-logo-liste'>
                {logos.map((logo) => (
                    <div key={logo.id} className='home-logo-item'>
                        <img src={logo.image} alt={logo.name} loading="lazy" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeLogo;
