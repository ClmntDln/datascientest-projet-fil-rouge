import { Link } from 'react-router-dom';

const HomeSection = ({
    subtitle = '',
    title = '',
    description = '',
    buttonLink = '#',
    buttonText = 'Découvrir',
    image = '',
    positionImage = 'left',
}) => {
    return (
        <section className={`home-section-container container-large position-${positionImage}`}>
            <div className='home-section-content'>
                <span className='home-section-subtitle'>{subtitle}</span>
                <h2 className='home-section-title'>{title}</h2>
                <p className='home-section-description'>{description}</p>
                <Link to={buttonLink} className='home-section-button'>{buttonText}</Link>
            </div>
            <div className='home-section-image'>
                <img src={image} alt="" loading="lazy" />
            </div>
        </section>
    );
};

export default HomeSection;
