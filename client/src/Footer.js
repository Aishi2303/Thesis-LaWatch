import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import logo from './LaWatch Logoo.png';

const Footer = () => {
  return (
    <footer className="laguna-footer">
      <div className="footer-content">
        <div className="footer-column logo-column">
             <Link to="./MainPage.js">
              <img 
                src={logo} 
                alt="LaWatch Logo" 
                className="footer-logo" 
                style={{ width: '250px', height: 'auto' }} 
              />
            </Link>
        </div>

        <div className="footer-column">
          <h4>Information</h4>
          <ul>
            <Link to="./MainPage.js"></Link><li>Main</li>
            <Link to="https://llda.gov.ph/"></Link><li>Laguna Lake Development Authority</li>
            <Link to="./ContaminationMap.js"></Link><li>Maps</li>
            <Link to="./LDB.js"></Link><li>Laguna de Bay</li>
            <Link to="./Login.js"></Link><li>Log in</li>
            <Link to="./About.js"></Link><li>Contacts</li>
          </ul>
        </div>


        <div className="footer-column">
          <h4>Contacts</h4>
          <ul className="contact-list">
            <li>
              <FaMapMarkerAlt className="contact-icon" /> 
              <address>
                LaWatch Team<br />
                Far Eastern University Alabang, C26Q+545 Wood District, Corporate Woods cor. <br />
                South Corporate Avenues, Filinvest City, Muntinlupa City, 1781 Metro Manila
              </address>
            </li>
            <li>
              <FaPhone className="contact-icon" /> 0975 460 1367 <br />
            </li>
            <li>
              <FaEnvelope className="contact-icon" /> lawatch.help@gmail.com
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Social Media</h4>
          <div className="social-media">
            <a href="https://www.facebook.com/LLDAofficial"><FaFacebook className="social-icon" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
          
