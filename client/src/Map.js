import React, { useState, useEffect } from 'react';
import DateSelector from './DateSelector'; 
import ContaminationMap from './ContaminationMap'; 
import { processData } from './dataProcessors'; 

const Map = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  const [geoJSONData, setGeoJSONData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [activeAreaTypes, setActiveAreaTypes] = useState({
    agricultural: false,
    industrial: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const geoJSONs = await Promise.all([
          fetch('/agricultural_areas_2023.geojson').then(r => r.json()).then(data => ({...data, areaType: 'agricultural'})),
          fetch('/agricultural_areas_2024.geojson').then(r => r.json()).then(data => ({...data, areaType: 'agricultural'})),
          fetch('/agricultural_areas_2025.geojson').then(r => r.json()).then(data => ({...data, areaType: 'agricultural'})),
          fetch('/industrial_areas_2023.geojson').then(r => r.json()).then(data => ({...data, areaType: 'industrial'})),
          fetch('/industrial_areas_2024.geojson').then(r => r.json()).then(data => ({...data, areaType: 'industrial'})),
          fetch('/industrial_areas_2025.geojson').then(r => r.json()).then(data => ({...data, areaType: 'industrial'})),
        ]);

        const processedData = await processData('/contamination_prediction.csv', geoJSONs);
        setGeoJSONData(processedData);
        
        //Extract all unique dates from the processed data
        const allDates = processedData.flatMap(g => 
          g.features.flatMap(f => 
            f.properties.readings?.map(r => r.date) || []
          )
        );
        setAvailableDates([...new Set(allDates)]);
        
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="app">
      <div className="map-controls">
        <DateSelector 
          availableDates={availableDates} 
          onDateChange={setSelectedDate} 
        />
        <div className="area-type-toggles">
          <label>
            <input
              type="checkbox"
              checked={activeAreaTypes.agricultural}
              onChange={() => setActiveAreaTypes(prev => ({
                ...prev,
                agricultural: !prev.agricultural
              }))}
            />
            Agricultural
          </label>
          <label>
            <input
              type="checkbox"
              checked={activeAreaTypes.industrial}
              onChange={() => setActiveAreaTypes(prev => ({
                ...prev,
                industrial: !prev.industrial
              }))}
            />
            Industrial
          </label>
        </div>
      </div>
      <ContaminationMap 
        geoJSONData={geoJSONData} 
        selectedDate={selectedDate}
        activeAreaTypes={activeAreaTypes}
      />
    </div>
  );
};

export default Map;