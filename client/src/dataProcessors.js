import Papa from 'papaparse';

const METAL_KEYS = ['iron', 'chromium', 'zinc', 'arsenic', 'lead'];
const WATER_QUALITY_KEYS = ['turbidity', 'chla', 'tss'];

export const processData = async (csvUrl, geoJSONs) => {
  try {
    //Load and parse CSV
    const csvResponse = await fetch(csvUrl);
    const csvText = await csvResponse.text();
    const csvData = await new Promise(resolve => {
      Papa.parse(csvText, { 
        header: true, 
        complete: (results) => resolve(results.data) 
      });
    });

    //Process each GeoJSON
    const processedData = geoJSONs.map(geoJSON => {
      const year = geoJSON.name.split('_').pop(); //Extract year from filename
      const areaType = geoJSON.name.includes('agri') ? 'agricultural' : 'industrial';

      return {
        ...geoJSON,
        features: geoJSON.features.map(feature => {
          const stationData = csvData.filter(row => 
            row.station === feature.properties.name && 
            new Date(row.date).getFullYear() === year
          );

          //Process readings
          const readings = stationData.map(row => ({
            date: row.date,
            waterQuality: {
              satellite: {
                turbidity: parseFloat(row.turbidity_sat),
                chla: parseFloat(row.chla_sat),
                tss: parseFloat(row.tss_sat)
              },
              calibrated: {
                turbidity: parseFloat(row.turbidity_calibrated),
                chla: parseFloat(row.chla_calibrated),
                tss: parseFloat(row.tss_calibrated)
              }
            },
            metals: METAL_KEYS.reduce((acc, metal) => ({
              ...acc,
              [metal]: {
                value: parseFloat(row[`${metal}_predicted`]),
                class: row[`${metal}_predicted_class`],
                classEncoded: parseInt(row[`${metal}_predicted_class_encoded`])
              }
            }), {})
          }));

          return {
            ...feature,
            properties: {
              ...feature.properties,
              areaType,
              year,
              readings,
              stats: calculateStats(readings)
            }
          };
        })
      };
    });

    return processedData; //Return the processed data

  } catch (error) {
    console.error('Error processing data:', error);
    return []; //Return empty array if there's an error
  }
};

const calculateStats = (readings) => {
  if (readings.length === 0) return null;

  const stats = {
    metals: {},
    waterQuality: { satellite: {}, calibrated: {} }
  };

  //Initialize sums
  METAL_KEYS.forEach(metal => {
    stats.metals[metal] = { sum: 0, classCounts: { low: 0, medium: 0, high: 0 } };
  });

  WATER_QUALITY_KEYS.forEach(param => {
    stats.waterQuality.satellite[param] = { sum: 0 };
    stats.waterQuality.calibrated[param] = { sum: 0 };
  });

  //Calculate sums
  readings.forEach(reading => {
    METAL_KEYS.forEach(metal => {
      stats.metals[metal].sum += reading.metals[metal].value;
      const cls = reading.metals[metal].class?.toLowerCase();
      if (cls && stats.metals[metal].classCounts[cls] !== undefined) {
        stats.metals[metal].classCounts[cls]++;
      }
    });

    WATER_QUALITY_KEYS.forEach(param => {
      stats.waterQuality.satellite[param].sum += reading.waterQuality.satellite[param];
      stats.waterQuality.calibrated[param].sum += reading.waterQuality.calibrated[param];
    });
  });

  //Calculate averages
  METAL_KEYS.forEach(metal => {
    stats.metals[metal].average = stats.metals[metal].sum / readings.length;
  });

  WATER_QUALITY_KEYS.forEach(param => {
    stats.waterQuality.satellite[param].average = 
      stats.waterQuality.satellite[param].sum / readings.length;
    stats.waterQuality.calibrated[param].average = 
      stats.waterQuality.calibrated[param].sum / readings.length;
  });

  return stats;
};