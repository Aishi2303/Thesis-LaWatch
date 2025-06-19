import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import csvFile from './contamination_prediction.csv';
import './ContaminationMap.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

//Station coordinates
const STATION_COORDINATES = {
  'Central West Bay': [14.417014, 121.174044],
  'East Bay': [14.271983, 121.336441],
  'Central Bay': [14.385799, 121.280192],
  'Northern West Bay': [14.488326, 121.138938],
  'South Bay': [14.238274, 121.232659],
  'San Pedro (West Bay)': [14.370276, 121.094390],
  'Sta. Rosa (West Bay)': [14.325385, 121.133773],
  'Fish Sanctuary (Central Bay)': [14.291274, 121.269698],
  'Pagsanjan (East Bay)': [14.312355, 121.384512]
};

//Match your actual CSV columns
const METAL_KEYS = ['iron', 'chromium_predicted', 'lead_predicted', 'zinc_predicted', 'arsenic_predicted'];
const WATER_QUALITY_KEYS = ['turbidity_calibrated', 'chla_calibrated', 'tss_calibrated'];

//Water quality standards
const metalStandards = {
  Iron: {
    classA: 5,
    classB: 5,
    classC: 7.5,
    classD: 35,
    low: 7.5,
    moderate: 35,
    unit: 'mg/L'
  },
  Lead: {
    classA: 0.02,
    classB: 0.02,
    classC: 0.1,
    classD: 0.2,
    low: 0.1,
    moderate: 0.2,
    unit: 'mg/L'
  },
  Chromium: {
    classA: 0.02,
    classB: 0.02,
    classC: 0.02,
    classD: 0.04,
    low: 0.04,
    moderate: 0.04,
    unit: 'mg/L'
  },
  Arsenic: {
    classA: 0.02,
    classB: 0.02,
    classC: 0.04,
    classD: 0.08,
    low: 0.04,
    moderate: 0.08,
    unit: 'mg/L'
  },
  Zinc: {
    classA: 4,
    classB: 4,
    classC: 4,
    classD: 8,
    low: 8,
    moderate: 8,
    unit: 'mg/L'
  },
  Turbidity: {
    unit: 'NTU'
  },
  Chla: {
    unit: 'μg/L'
  },
  TSS: {
    unit: 'mg/L'
  }
};

const ContaminationMap = ({ geoJSONData = [], selectedDate, activeAreaTypes = {} }) => {
  const [activeLayers, setActiveLayers] = useState({
    metals: METAL_KEYS.reduce((acc, metal) => ({ ...acc, [metal]: false }), {}),
    waterQuality: WATER_QUALITY_KEYS.reduce((acc, param) => ({ ...acc, [param]: false }), {})
  });

  const [csvData, setCsvData] = useState([]);

  //Load and parse CSV data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(csvFile);
      const text = await response.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    };

    fetchData();
  }, []);

  //Determine contamination level and color
  const getContaminationLevel = (param, value) => {
    const paramName = param.replace('_predicted', '').replace('_calibrated', '');
    const standards = metalStandards[paramName.charAt(0).toUpperCase() + paramName.slice(1)];
    
    if (!standards || !standards.low) return { level: 'Unknown', color: '#4575b4' };
    
    if (value <= standards.low) {
      return { level: 'Low', color: '#4CAF50' };
    } else if (value <= standards.moderate) {
      return { level: 'Moderate', color: '#FFC107' };
    } else {
      return { level: 'High', color: '#F44336' };
    }
  };

  //Adjust color intensity based on value
  const getIntensityAdjustedColor = (baseColor, value, maxValue) => {
    if (maxValue === 0) return baseColor;
    
    const ratio = Math.min(value / maxValue, 1);
    const hsl = hexToHSL(baseColor);
    
    
    hsl.l = 50 - (ratio * 30);
    return HSLToHex(hsl);
  };

  //Helper functions for color conversion
  const hexToHSL = (hex) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const HSLToHex = (hsl) => {
    let h = hsl.h / 360;
    let s = hsl.s / 100;
    let l = hsl.l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  //Filter zones
  const filteredZones = useMemo(() => {
    return (geoJSONData || [])
      .filter(geoJSON => {
        if (geoJSON.areaType === 'agricultural' && activeAreaTypes.agricultural) return true;
        if (geoJSON.areaType === 'industrial' && activeAreaTypes.industrial) return true;
        return false;
      });
  }, [geoJSONData, activeAreaTypes]);

  //Filter and process stations
  const filteredStations = useMemo(() => {
    return csvData
      .filter(row => {
        if (!selectedDate) return true;
        try {
          const rowDate = dayjs(row.date, 'M/D/YYYY');
          const selDate = dayjs(selectedDate);
          return rowDate.isValid() && selDate.isValid() && rowDate.isSame(selDate, 'day');
        } catch (e) {
          console.error('Date error:', e);
          return false;
        }
      })
      .map(row => {
        const stationKey = Object.keys(STATION_COORDINATES).find(
          key => key.trim().toLowerCase() === (row.station || '').trim().toLowerCase()
        );
        
        //Ensure numeric values
        const processedRow = { ...row };
        METAL_KEYS.forEach(key => {
          processedRow[key] = Number(processedRow[key]) || 0;
        });
        WATER_QUALITY_KEYS.forEach(key => {
          processedRow[key] = Number(processedRow[key]) || 0;
        });

        return {
          ...processedRow,
          coordinates: stationKey ? STATION_COORDINATES[stationKey] : null,
          stationName: stationKey || row.station || 'Unknown Station'
        };
      })
      .filter(row => row.coordinates);
  }, [csvData, selectedDate]);

  //Calculate max values for intensity scaling
  const maxValues = useMemo(() => {
    const metalsMax = METAL_KEYS.reduce((acc, key) => {
      acc[key] = Math.max(...csvData.map(row => Number(row[key]) || 0));
      return acc;
    }, {});

    const waterQualityMax = WATER_QUALITY_KEYS.reduce((acc, key) => {
      acc[key] = Math.max(...csvData.map(row => Number(row[key]) || 0));
      return acc;
    }, {});

    return { metals: metalsMax, waterQuality: waterQualityMax };
  }, [csvData]);

  //Style functions
  const getZoneStyle = (feature = {}) => {
    const name = feature.properties?.name || '';
    const isAgri = name.toLowerCase().includes('agricultural') || name.toLowerCase().includes('agri');
    return {
      fillColor: isAgri ? '#a3e635' : '#60a5fa', 
      fillOpacity: 0.25,
      weight: 2,
      color: isAgri ? '#65a30d' : '#2563eb', 
      dashArray: '3', 
    };
  };

  //Highlight style for hover
  const highlightStyle = {
    weight: 4,
    color: '#2563eb', 
    fillOpacity: 0.45,
    dashArray: '',
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.name || '';
    const isAgri = name.toLowerCase().includes('agricultural') || name.toLowerCase().includes('agri');
    const areaType = isAgri ? 'Agricultural Area' : 'Industrial Area';

    // Tooltip on hover
    layer.bindTooltip(
      `<strong>${name}</strong><br/>${areaType}`,
      { sticky: true }
    );

    //Highlight on mouseover
    layer.on({
      mouseover: (e) => {
        e.target.setStyle(highlightStyle);
        e.target.openTooltip();
      },
      mouseout: (e) => {
        e.target.setStyle(getZoneStyle(feature));
        e.target.closeTooltip();
      },
    });
  };

  //Returns true if any metal or water quality layer is active
  const hasActiveLayers = () => {
    return (
      Object.values(activeLayers.metals).some(Boolean) ||
      Object.values(activeLayers.waterQuality).some(Boolean)
    );
  };

  const getMetalStyle = (row, metal) => {
    const value = row[metal];
    const { level, color: baseColor } = getContaminationLevel(metal, value);
    const maxValue = maxValues.metals[metal] || 1;
    const adjustedColor = getIntensityAdjustedColor(baseColor, value, maxValue);
    
    return {
      fillColor: adjustedColor,
      fillOpacity: 0.8,
      color: '#333',
      weight: 1,
      radius: 8 + (value / maxValue) * 8
    };
  };

  const getWaterQualityStyle = (row, param) => {
    const value = row[param];
    const { level, color: baseColor } = getContaminationLevel(param, value);
    const maxValue = maxValues.waterQuality[param] || 1;
    const adjustedColor = getIntensityAdjustedColor(baseColor, value, maxValue);
    
    return {
      fillColor: adjustedColor,
      fillOpacity: 0.7,
      color: '#333',
      weight: 1,
      radius: 6 + (value / maxValue) * 6
    };
  };

  const createStationPopup = (row) => {
    const activeMetals = METAL_KEYS.filter(metal => activeLayers.metals[metal]);
    const activeWaterQuality = WATER_QUALITY_KEYS.filter(param => activeLayers.waterQuality[param]);
    
    return (
      <div className="contamination-popup">
        <h3>{row.stationName}</h3>
        <p>Coordinates: {row.coordinates[0].toFixed(6)}, {row.coordinates[1].toFixed(6)}</p>
        
        {activeMetals.length > 0 && (
          <div className="metal-grid">
            <h4>Heavy Metals</h4>
            {activeMetals.map(metal => {
              const metalName = metal.replace('_predicted', '');
              const { level, color } = getContaminationLevel(metal, row[metal]);
              const standards = metalStandards[metalName.charAt(0).toUpperCase() + metalName.slice(1)];
              
              return (
                <div key={metal} className="metal-card" style={{ borderColor: color }}>
                  <h5 style={{ color }}>
                    {metalName.toUpperCase()}: {row[metal].toFixed(4)} {standards?.unit || ''}
                  </h5>
                  <div>Level: <strong style={{ color }}>{level}</strong></div>
                  <div className="classification">
                    {row[`${metalName}_predicted_class`] && (
                      <div>Class: {row[`${metalName}_predicted_class`]}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {activeWaterQuality.length > 0 && (
          <div className="water-quality">
            <h4>Water Quality</h4>
            {activeWaterQuality.map(param => {
              const paramName = param.replace('_calibrated', '');
              const { level, color } = getContaminationLevel(param, row[param]);
              const standards = metalStandards[paramName.charAt(0).toUpperCase() + paramName.slice(1)];
              
              return (
                <div key={param} className="quality-row">
                  <div>
                    <strong style={{ color }}>{paramName.toUpperCase()}:</strong> {row[param].toFixed(2)} {standards?.unit || ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: 'white' }}>
      <MapContainer center={[14.385799, 121.280192]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredZones.map((geoJSON, index) => (
          <GeoJSON
            key={`zone-${index}`}
            data={geoJSON}
            style={() => ({
              fillColor: geoJSON.areaType === 'agricultural' ? '#a3e635' : '#60a5fa',
              fillOpacity: 0.25,
              weight: 2,
              color: geoJSON.areaType === 'agricultural' ? '#65a30d' : '#2563eb',
              dashArray: '3',
            })}
            onEachFeature={(feature, layer) => {
              const name = feature.properties?.name || '';
              const areaType = geoJSON.areaType === 'agricultural' ? 'Agricultural Area' : 'Industrial Area';
              layer.bindTooltip(
                `<strong>${name}</strong><br/>${areaType}`,
                { sticky: true }
              );
              layer.on({
                mouseover: (e) => {
                  e.target.setStyle({
                    weight: 4,
                    color: '#2563eb',
                    fillOpacity: 0.45,
                    dashArray: '',
                  });
                  e.target.openTooltip();
                },
                mouseout: (e) => {
                  e.target.setStyle({
                    fillColor: geoJSON.areaType === 'agricultural' ? '#a3e635' : '#60a5fa',
                    fillOpacity: 0.25,
                    weight: 2,
                    color: geoJSON.areaType === 'agricultural' ? '#65a30d' : '#2563eb',
                    dashArray: '3',
                  });
                  e.target.closeTooltip();
                },
              });
            }}
            pointToLayer={() => null}
          />
        ))}

        {selectedDate && hasActiveLayers() && filteredStations.map((row, idx) => (
          <React.Fragment key={idx}>
            {METAL_KEYS.filter(metal => activeLayers.metals[metal]).map(metal => (
              <CircleMarker
                key={`metal-${metal}-${idx}`}
                center={row.coordinates}
                {...getMetalStyle(row, metal)}
              >
                <Popup>{createStationPopup(row)}</Popup>
              </CircleMarker>
            ))}
            
            {WATER_QUALITY_KEYS.filter(param => activeLayers.waterQuality[param]).map(param => (
              <CircleMarker
                key={`wq-${param}-${idx}`}
                center={row.coordinates}
                {...getWaterQualityStyle(row, param)}
              >
                <Popup>{createStationPopup(row)}</Popup>
              </CircleMarker>
            ))}
          </React.Fragment>
        ))}

        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control" style={{ 
            backgroundColor: 'white', 
            padding: '10px',
            boxShadow: '0 1px 5px rgba(0,0,0,0.4)'
          }}>
            <div className="control-section">
              <h4>Heavy Metals</h4>
              {METAL_KEYS.map(metal => {
                const metalName = metal.replace('_predicted', '');
                const standards = metalStandards[metalName.charAt(0).toUpperCase() + metalName.slice(1)];
                const sampleValue = standards?.moderate || 1;
                const { color } = getContaminationLevel(metal, sampleValue);
                
                return (
                  <div key={metal} className="layer-toggle">
                    <input
                      type="checkbox"
                      checked={!!activeLayers.metals[metal]}
                      onChange={() => setActiveLayers(prev => ({
                        ...prev,
                        metals: { ...prev.metals, [metal]: !prev.metals[metal] }
                      }))}
                      style={{ accentColor: color }}
                    />
                    <label style={{ color, marginLeft: '5px' }}>
                      {metalName.toUpperCase()}
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="control-section">
              <h4>Water Quality</h4>
              {WATER_QUALITY_KEYS.map(param => {
                const paramName = param.replace('_calibrated', '');
                const standards = metalStandards[paramName.charAt(0).toUpperCase() + paramName.slice(1)];
                const sampleValue = 1; 
                const { color } = getContaminationLevel(param, sampleValue);
                
                return (
                  <div key={param} className="layer-toggle">
                    <input
                      type="checkbox"
                      checked={!!activeLayers.waterQuality[param]}
                      onChange={() => setActiveLayers(prev => ({
                        ...prev,
                        waterQuality: { ...prev.waterQuality, [param]: !prev.waterQuality[param] }
                      }))}
                      style={{ accentColor: color }}
                    />
                    <label style={{ color, marginLeft: '5px' }}>
                      {paramName.toUpperCase()}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default ContaminationMap;