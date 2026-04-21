import { NavLink } from 'react-router-dom';

const AdminSubnav = () => (
    <nav className='admin-subnav' aria-label="Sections administration">
        <NavLink
            to="/admin/utilisateurs"
            className={({ isActive }) => `admin-subnav-link${isActive ? ' admin-subnav-link-active' : ''}`}
        >
            Utilisateurs
        </NavLink>
        <NavLink
            to="/admin/messages"
            className={({ isActive }) => `admin-subnav-link${isActive ? ' admin-subnav-link-active' : ''}`}
        >
            Messages
        </NavLink>
    </nav>
);

export default AdminSubnav;
