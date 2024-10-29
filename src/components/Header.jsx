import './Header.css';
import { GiSpoon } from 'react-icons/gi';
import { BiSolidUserCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';  // Import NavBar

const Header = () => {
    return (
        <div className="header-container">
            <Link to={'/'}>
    
            </Link>
            
            <BiSolidUserCircle className='user-img' />
            <NavBar />
        </div>
    );
};

export default Header;
