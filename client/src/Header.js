import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './Header.css';
import logo from './LaWatch Logo.png';

const Header = () => { 
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => { 
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="logo-container">
                <Link to="/"><img src={logo} alt="LaWatch Logo" className="logo-img" /></Link>
            </div>
            
            <button 
                className={`menu-toggle ${menuOpen ? 'open' : ''}`} 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/" onClick={() => setMenuOpen(false)}>MAIN</Link></li>
                    <li className="nav-item"><Link to="/maps" onClick={() => setMenuOpen(false)}>MAPS</Link></li>
                    <li className="nav-item"><Link to="/ldb" onClick={() => setMenuOpen(false)}>LAGUNA DE BAY</Link></li>
                    <li className="nav-item"><Link to="/about" onClick={() => setMenuOpen(false)}>ABOUT</Link></li>
                    <li className="nav-item"><Link to="/login" onClick={() => setMenuOpen(false)}>LOG IN</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
