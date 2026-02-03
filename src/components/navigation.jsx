import { Link } from 'react-router-dom'

const Navigation = ({ logo }) => {
    return (
        <div className='navigation-container'>
            <div className='navigation-content'>
                <Link to="/">
                    <img src={logo} alt="logo" className='navigation-logo' />
                </Link>
                <ul className='navigation-list'>
                    <li className='navigation-item'>
                        <Link to="/">About us</Link>
                    </li>
                    <li className='navigation-item'>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
            </div>
            <div className='navigation-buttons'>
                <Link to="/login" className='navigation-button navigation-button-primary'>Login</Link>
                <button className='navigation-button'>Join Now</button>
            </div>
        </div>
    );
};

export default Navigation;