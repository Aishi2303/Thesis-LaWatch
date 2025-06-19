import React, { useEffect } from 'react';
import './LDB.css';
import map5 from './Map10.jpg';

const Section = ({ title, children }) => (
  <div className="section">
    <h2 className="section-title">{title}</h2>
    <div className="section-content">{children}</div>
  </div>
);

const LDB = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="article-container">
      {/* Hero Header */}
      <header className="article-header">
        <h1 className="article-title">Laguna de Bay: Lifeblood of Luzon</h1>
        <div className="article-meta">Updated June 9, 2025 | AXIOM BEAP</div>
        <div className="article-divider"></div>
      </header>

      {/* Featured Image */}
      <div className="featured-image-container">
        <img src={map5} alt="Laguna de Bay" className="featured-image" />
      </div>

      {/* Article Content */}
      <main className="article-content">
        <p className="lead-paragraph">
          If you've ever wondered about the ecological importance of Laguna de Bay, you're not alone.
        </p>

        <Section title="Laguna de Bay and Its Importance">
          <p>Laguna de Bay, the Philippines' largest inland body of freshwater, spans approximately 911–949 square kilometers and touches multiple provinces including Laguna, Rizal, and parts of Metro Manila. It serves as a vital life source for over 15 million Filipinos, contributing directly to their livelihood and well-being.</p>
          
          <p>The lake is a major provider of:</p>
          <ul className="article-list">
            <li><strong>Domestic water supply:</strong> It supplements Metro Manila's water needs, especially during dry months.</li>
            <li><strong>Aquaculture and fisheries:</strong> Home to over 20 species of commercially important fish.</li>
            <li><strong>Agriculture:</strong> Its water irrigates vast farmlands around the lake.</li>
            <li><strong>Transportation:</strong> Historically and currently used for boat routes.</li>
            <li><strong>Flood mitigation:</strong> Acts as a natural buffer during typhoons.</li>
            <li><strong>Livelihood:</strong> Thousands rely on fishing, transport, tourism, and related industries supported by the lake.</li>
          </ul>

          Beyond economics, the lake supports cultural and community life, serving as a symbol of resilience and sustainability.
        </Section>


        <Section title="A Glimpse into History">
          The formation of Laguna de Bay is believed to be the result of a long-extinct volcanic caldera. Over thousands of years, the depression filled with water from surrounding rivers and rainfall, creating the lake we see today.

          <br /><br />
          During the Spanish colonial era, the lake became an essential trade and transportation route. Paddleboats and steamships traveled between lakeside towns, facilitating the movement of goods such as rice, sugar, and fish. Towns like Pagsanjan, Bay, and Binangonan flourished as commerce hubs.

          <br /><br />
          The lake was also a spiritual and communal center, where festivals, fishing traditions, and religious processions were held. The term "Laguna de Bay" means "Lake of Bay," named after the lakeshore town of Bay, not the English word “bay.” Its historical relevance is deeply woven into the identity of Southern Luzon.
        </Section>


        <Section title="Why It’s Important to Maintain">
          Laguna de Bay is under increasing pressure due to urbanization, industrial growth, and population density in its surrounding areas. The degradation of the lake puts millions at risk — environmentally, economically, and socially.

          <br /><br />
          <strong>Key reasons to preserve and protect the lake include:</strong>
          <ul className="list">
            <li><strong>Food Security:</strong> The fisheries industry supports thousands of livelihoods and is a source of affordable protein for nearby communities.</li>
            <li><strong>Water Security:</strong> With alternative sources strained, the lake is becoming more important for potable and irrigation water.</li>
            <li><strong>Biodiversity Conservation:</strong> The lake hosts endemic and migratory species, including birds and freshwater life. Ecosystem balance is crucial.</li>
            <li><strong>Climate Resilience:</strong> The lake acts as a sponge during storms. Degraded water quality can reduce this ability and worsen floods.</li>
            <li><strong>Public Health:</strong> Contamination of lake water can directly affect drinking water and fish quality, exposing residents to waterborne diseases and toxins.</li>
          </ul>

          Without proactive management, Laguna de Bay could reach a tipping point that would take decades — and massive investment — to recover from.
        </Section>

        <Section title="Heavy Metals and Their Effects">
          Laguna de Bay has been found to contain several heavy metals due to industrial discharge, agricultural runoff, and improper waste disposal. These include:

          <ul className="list">
            <li><strong>Lead (Pb):</strong> Accumulates in fish tissues; causes neurological damage, developmental delays in children, and kidney dysfunction. Contaminates drinking water if untreated.</li>

            <li><strong>Mercury (Hg):</strong> Highly toxic in its methylated form (methylmercury); affects the nervous system and is especially dangerous for pregnant women and infants. Bioaccumulates in fish such as dalag and kanduli.</li>

            <li><strong>Arsenic (As):</strong> A known carcinogen; long-term exposure increases the risk of skin, lung, and bladder cancers. Found in fish like tilapia from polluted zones. Can also affect aquatic biodiversity and microbial activity.</li>

            <li><strong>Cadmium (Cd):</strong> Damages kidneys and bones over prolonged exposure. In aquatic environments, cadmium inhibits algae growth and affects fish reproduction and enzyme activity.</li>

            <li><strong>Chromium (Cr):</strong> Particularly its hexavalent form (Cr⁶⁺) is toxic; linked to lung cancer, skin irritation, and ulcers in humans. For aquatic life, it can disrupt osmoregulation and gill function in fish.</li>

            <li><strong>Iron (Fe):</strong> While essential in trace amounts, excess iron promotes algal blooms and can suffocate aquatic organisms by clogging fish gills and altering sediment oxygen levels.</li>

            <li><strong>Copper (Cu):</strong> Affects the gills and liver of fish; toxic to plankton, shellfish, and aquatic plants at elevated levels. In humans, high exposure can cause stomach irritation and liver damage.</li>

            <li><strong>Cobalt (Co):</strong> Can accumulate in aquatic organisms, leading to oxidative stress. In humans, long-term exposure may affect thyroid function and cause cardiomyopathy.</li>

            <li><strong>Nickel (Ni):</strong> Known to cause allergic reactions in humans and may lead to cancer with chronic exposure. In water, nickel impacts fish embryo development and plankton diversity.</li>

            <li><strong>Manganese (Mn):</strong> Essential in trace amounts but neurotoxic when overexposed. In water, excessive Mn affects brain health and can cause "manganism" — a neurological condition with Parkinson-like symptoms.</li>
          </ul>

          <p>
            These contaminants not only endanger human health through consumption of fish and contaminated water but also degrade aquatic ecosystems, reducing biodiversity and impacting the overall productivity of the lake.
          </p>
        </Section>

        <Section title="Pathways to Restoration">
          Restoring Laguna de Bay requires a comprehensive and sustained approach that combines government policy, community action, scientific research, and private sector involvement.

          <br /><br />
          <strong>Strategies and actions include:</strong>
          <ul className="list">
            <li><strong>Enforcing industrial and domestic waste regulations:</strong> Monitoring effluents discharged into the lake must be prioritized, and penalties must be enforced for violators.</li>
            <li><strong>Restoring wetlands and riparian zones:</strong> Replanting mangroves and native plants around the lake can help filter pollutants and restore ecological balance.</li>
            <li><strong>Public education and citizen science:</strong> Campaigns on responsible waste disposal, water conservation, and fish consumption can empower residents.</li>
            <li><strong>Sustainable aquaculture:</strong> Encouraging fish cage operators to follow best practices and limit overfishing will preserve aquatic populations.</li>
            <li><strong>Scientific monitoring and data transparency:</strong> Open, accessible, and real-time data on water quality and lake health will improve planning and trust among stakeholders.</li>
            <li><strong>Collaboration:</strong> Partnerships among LGUs, NGOs, DENR, LLDA, academic institutions, and the private sector can fast-track restoration goals.</li>
          </ul>

          Laguna de Bay’s future is a shared responsibility. Collective action today ensures it continues to nourish and sustain generations tomorrow.
        </Section>
    </main>
    </div>
  );
};

export default LDB;
