import React, { useState } from 'react';
import logo from './LaWatch Logoo.png';
import './AboutPage.css';
import pic1 from './Map8.jpg';
import pic2 from './Map2.jpg';

// Import team member photos (you'll need to add these images to your project)
import MarielPhoto from './MarielPhoto.jpg';
import PatPhoto from './PatPhoto.jpg';
import RanenPhoto from './RanenPhoto.png';
import MarkPhoto from './MarkPhoto.jpg';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('howto');

  const teamMembers = [
    {
      name: "Mariel Acuna",
      title: "Database Administrator",
      photo: MarielPhoto,
      email: "202211043@feualabang.edu.ph",
      phone: "0956 058 9385",
      bio: "This team member manages and optimizes LaWatch’s data systems, ensuring accurate, organized, and accessible environmental data to support reliable analysis, visualization, and platform scalability."
    },
    {
      name: "John Patrick Bulanadi",
      title: "Lead Programmer",
      photo: PatPhoto,
      email: "202210584@feualabang.edu.ph",
      phone: "0975 460 1367",
      bio: "This team member develops and maintains LaWatch’s core functionality, builds the interactive map and visualizations, and ensures smooth integration with data systems. They solve technical challenges and optimize performance for a seamless user experience."
    },
    {
      name: "Ranen Ezra Enrique",
      title: "Project Manager",
      photo: RanenPhoto,
      email: "202210693@feualabang.edu.ph",
      phone: "0953 173 3808",
      bio: "This team member provides direction, manages timelines, and ensures all tasks align with LaWatch’s mission. They translates vision into clear goals, oversees the project lifecycle, and fosters collaboration grounded in social and environmental responsibility."
    },
    {
      name: "Mark Jedidiah Padilla",
      title: "GIS Specialist",
      photo: MarkPhoto,
      email: "202210771@feualabang.edu.ph",
      phone: "0966 375 8099",
      bio: "This team member handles the processing and visualization of spatial data, including contamination hotspots and industrial zones. Using GIS tools, they transform raw environmental data into clear, interactive maps that show the spread of pollutants in Laguna de Bay."
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <img src={logo} alt="Company Logo" className="about-logo" />
        <h1 className="about-slogan">Empowering Communities Through Innovation</h1>
      </section>

      <section className="about-section" id="mission">
        <div className="section-container">
          <div className="section-text">
            <h2>Our Mission</h2>
            <p>
              To empower communities, researchers, and environmental authorities with accurate, accessible, and actionable information about heavy metal contamination in Laguna de Bay. We believe that protecting our natural resources begins with awareness, continues through data transparency, and succeeds through collaboration among citizens, scientists, and government bodies.
            </p>
            <p>
              LaWatch is built with a commitment to environmental sustainability, scientific integrity, and technological innovation. We aim to bridge the gap between raw environmental data and public understanding by offering an intuitive, visual, and interactive map platform that highlights contamination hotspots within Laguna de Bay. With this tool, we hope to enable smarter policy-making, community-based action, and informed decisions by the public regarding health, livelihood, and water use.
            </p>
            <p>
              We understand that Laguna de Bay is more than just a lake, it is a lifeline for millions. From fishing and agriculture to drinking water and biodiversity, the lake sustains livelihoods, food sources, and ecosystems. However, increasing industrialization, unchecked urban development, and pollution threaten its fragile balance. LaWatch is here to support the movement toward restoring, protecting, and sustaining the lake for future generations.
              </p>
            </div>
            <div class="section-image">
        <img src={pic1} alt="Mission Illustration" className="section-image" />
        </div>
      </div>
      </section>

      <section className="about-section" id="team">
        <div className="section-container">
          <div className="section-text">
            <h2>About Our Team</h2>
            <p>
              LaWatch is a passion-driven initiative formed by a multidisciplinary team of young developers, environmental advocates, and aspiring scientists who saw the urgent need for digital innovation in environmental monitoring.
            </p>
            <p>
              The LaWatch team is driven not by profit, but by purpose,a deep desire to protect one of the Philippines’ most important water resources. With a foundation in science, community, and digital innovation, LaWatch is more than just a website, it's a movement for transparency, environmental justice, and sustainable living.
            </p>
            <p>
              As LaWatch continues to evolve, the team remains committed to expanding its features, collaborating with environmental agencies, and incorporating real-time data for even greater impact.
            </p>
          </div>
          <div class="section-image">
          <img src={pic2} alt="Teamwork Illustration" className="img" />
          </div>
        </div>
        
        <div className="leadership-team">
          <h3>Development Team</h3>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-card-header">
                  <img src={member.photo} alt={member.name} className="team-photo" />
                  <div className="team-card-titles">
                    <h4>{member.name}</h4>
                    <p className="team-title">{member.title}</p>
                  </div>
                </div>
                <div className="team-card-body">
                  <p className="team-bio">{member.bio}</p>
                  <div className="team-contact">
                    <p><i className="fas fa-envelope"></i> {member.email}</p>
                    <p><i className="fas fa-phone"></i> {member.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="about-section submenu-section">
        <div className="submenu-tabs">
          <button
            className={activeTab === 'howto' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('howto')}
          >
            How-to
          </button>
          <button
            className={activeTab === 'faq' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'howto' && (
            <div className="how-to-guide">
              <h3>How to Use the LaWatch Map</h3>
              
              <div className="guide-section">
                <h4>Understanding the Map Interface</h4>
                <p>The LaWatch map displays water contamination data using a color-coded heatmap system. Here's how to navigate it:</p>
                <ol>
                  <li><strong>Zoom:</strong> Use the + and - buttons or your mouse wheel to zoom in and out.</li>
                  <li><strong>Pan:</strong> Click and drag to move around the map.</li>
                  <li><strong>Date Search:</strong> Use the search bar to find specific dates to explore.</li>
                </ol>
              </div>
              
              <div className="guide-section">
                <h4>Using Toggles and Layers</h4>
                <p>The map includes several interactive elements:</p>
                <ol>
                  <li><strong>Layer Selection:</strong> Toggle between different data layers of heavy metals and water quality parameters using the layer control panel</li>
                  <li><strong>Legend:</strong> Refer to the color-coded legend to understand contamination levels</li>
                  <li><strong>Time Slider:</strong> Adjust the time period to see historical data (if available)</li>
                  <li><strong>Location Pins:</strong> Click on areas to see detailed contamination reports</li>
                </ol>
              </div>
              
              <div className="guide-section">
                <h4>Interpreting the Heatmap Colors</h4>
                <p>The heatmap uses a color gradient to represent contamination levels:</p>
                <ul>
                  <li><span className="color-box green"></span> <strong>Green:</strong> Low contamination (0–33%)</li>
                  <li><span className="color-box yellow"></span> <strong>Yellow:</strong> Moderate contamination (34–66%)</li>
                  <li><span className="color-box red"></span> <strong>Red:</strong> High contamination (67–100%)</li> 

                </ul>
                <p>Darker shades indicate higher concentrations within each range.</p>
              </div>
              
              <div className="guide-section">
                <h4>Getting Detailed Information</h4>
                <p>To access more detailed data:</p>
                <ol>
                  <li>Click on any colored area or pin on the map</li>
                  <li>A popup will appear with specific contamination measurements</li>
                  <li>For predicted values, look for the "Predicted" label and confidence percentage</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              
              <div className="faq-item">
                <h4>What is LaWatch?</h4>
                <p>LaWatch is a water contamination monitoring system that provides predictive data about heavy metal contamination in Laguna de Bay through an interactive map interface.</p>
              </div>
              
              <div className="faq-item">
                <h4>How do I access LaWatch?</h4>
                <p>LaWatch can be accessed through our website at [website URL]. No special software is required beyond a modern web browser.</p>
              </div>
              
              <div className="faq-item">
                <h4>Is LaWatch free to use?</h4>
                <p>Yes, LaWatch is completely free for all users as a public service initiative.</p>
              </div>
              
              <div className="faq-item">
                <h4>Do I need an account to use LaWatch?</h4>
                <p>No account is needed to view the public map and contamination data. However, creating an account allows you to save locations and get detailed reports regarding the contamination levels.</p>
              </div>
              
              <div className="faq-item">
                <h4>Does LaWatch work on mobile phones?</h4>
                <p>Yes, LaWatch is fully responsive and works on smartphones, tablets, and desktop computers.</p>
              </div>
              
              <div className="faq-item">
                <h4>How often is the contamination data updated?</h4>
                <p>Sensor data is updated every 4 hours, while predictive models are recalculated daily. Historical data is available from 2019.</p>
              </div>
              
              <div className="faq-item">
                <h4>How do I interpret the heatmap colors?</h4>
                <p>The colors range from green (safe) to red (dangerous), with intensity indicating concentration levels. See our How-to guide for detailed explanation.</p>
              </div>
              
              <div className="faq-item">
                <h4>What data sources does LaWatch use?</h4>
                <p>We combine data from government water  and heavy metal contaminations  from LLDA, satellite imagery from Sentinel 2A, Geographical Information System usinf QGIS and our predictive models to provide comprehensive coverage.</p>
              </div>
              
              <div className="faq-item">
                <h4>How accurate are the predictions?</h4>
                <p>Our models have an average accuracy of 85-92% based on historical validation. All predictions include confidence indicators to help assess reliability.</p>
              </div>
              
              <div className="faq-item">
                <h4>Who do I contact for technical support?</h4>
                <p>For technical issues, please email lawatch.help@gmail.com or call our helpline at 0975 460 1367 during business hours.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;