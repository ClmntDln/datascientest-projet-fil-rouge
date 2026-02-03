import React from 'react';

const HomeSection = ({
    subtitle = "Welcome to our website",
    title = "Home Section",
    description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    buttonLink = "#",
    buttonText = "Get Started",
    image = "",
    positionImage = "left"
}) => {
    return (
        <section className={`home-section-container container-large position-${positionImage}`}>
            <div className='home-section-content'>
                <span className="home-section-subtitle">{subtitle}</span>
                <h2 className="home-section-title">{title}</h2>
                <p className="home-section-description">{description}</p>
                <a href={buttonLink} className="home-section-button">{buttonText}</a>
            </div>
            <div className="home-section-image">
                <img src={image} alt={subtitle} loading="lazy" />
            </div>
        </section>
    );
};

export default HomeSection;