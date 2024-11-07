import { FaPizzaSlice, FaHamburger } from 'react-icons/fa';
import { GiNoodles, GiChopsticks } from 'react-icons/gi';
import { NavLink } from 'react-router-dom';
import './Category.css'

const Category = () => {
    return (
        <div className="category-container">
            <NavLink to={'/cuisine/Italian'}>
                <FaPizzaSlice />
                <p style={{ color: '#fff'}}>Italian</p>
            </NavLink>
            <NavLink to={'/cuisine/American'}>
                <FaHamburger />
                <p style={{ color: '#fff'}}>American</p>
            </NavLink>
            <NavLink to={'/cuisine/Thai'}>
                <GiNoodles />
                <p style={{ color: '#fff'}}>Thai</p>
            </NavLink>
            <NavLink to={'/cuisine/Chinese'}>
                <GiChopsticks />
                <p style={{ color: '#fff'}}>Chinese</p>
            </NavLink>
        </div>
    )
}

export default Category;