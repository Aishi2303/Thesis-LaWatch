import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './MainPage.css';
import laguna1 from './Map2.jpg';
import laguna2 from './Map3.jpg';
import laguna3 from './Map4.jpg';
import LDB from './LDB';


const MainPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const map = L.map("map").setView([14.3667, 121.2167], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div>
      <section id="main" className="main-container">
        <div className="main-left">
          <h1 className="main-title">
            LaWatch <br /><span className="main-bold">Map</span>
          </h1>
          <p className="main-description">
            Utilize and explore to view heavy metal contamination hotspots that can be found in Laguna de Bay!
          </p>
          <Link to="/maps" className="read-more-button">
            VIEW MAP →
          </Link>
        </div>
        <div className="main-right">
        <div id="map" className="main-image"></div>
      </div>

      </section>

      <section className="laguna-section">
        <div className='laguna-bg'>
        <div className="laguna-images">
          <img src={laguna1} alt="Laguna view 1" className="laguna-img" />
          <img src={laguna2} alt="Laguna view 2" className="laguna-img" />
          <img src={laguna3} alt="Laguna view 3" className="laguna-img" />
        </div>
        <div className="laguna-text">
          <h2>Laguna de Bay</h2>
          <p>
            Laguna de Bay is the largest lake in the Philippines, located between the provinces of Laguna and Rizal.
            It serves as an important resource for irrigation, fishing, and transportation. The lake is monitored by the Laguna Lake Development Authority (LLDA), 
            which oversees its conservation, water quality, and sustainable development, aiming to protect the lake from pollution and ensure its long-term health and productivity.
          </p>
          <Link to="/ldb" className="read-more-button">
            READ MORE →
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
