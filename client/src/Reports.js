import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { CSVLink } from 'react-csv';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import Papa from 'papaparse';
import './Reports.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import the CSV file directly
import contaminationData from './contamination_prediction.csv';

// Parameter Classification System
const parameterGroups = {
  metals: [
    { 
      value: 'Iron', 
      label: 'Iron (Fe)', 
      category: 'Metal',
      explanation: 'Essential element but excessive amounts cause water discoloration and bacterial growth.',
      healthEffects: 'High levels may cause metallic taste, staining, and in extreme cases, liver damage.'
    },
    { 
      value: 'Lead', 
      label: 'Lead (Pb)', 
      category: 'Heavy Metal',
      explanation: 'Toxic heavy metal that accumulates in the body affecting multiple systems.',
      healthEffects: 'Causes neurological damage (especially in children) and cardiovascular issues.'
    },
    { 
      value: 'Chromium', 
      label: 'Chromium (Cr)', 
      category: 'Heavy Metal',
      explanation: 'Hexavalent chromium is carcinogenic while trivalent is an essential nutrient.',
      healthEffects: 'Can cause lung cancer, liver damage, and skin irritation.'
    },
    { 
      value: 'Arsenic', 
      label: 'Arsenic (As)', 
      category: 'Metalloid',
      explanation: 'Naturally occurring toxic element that contaminates groundwater in many regions.',
      healthEffects: 'Chronic exposure leads to skin lesions, cancer, and cardiovascular disease.'
    },
    { 
      value: 'Zinc', 
      label: 'Zinc (Zn)', 
      category: 'Essential Metal',
      explanation: 'Essential nutrient but toxic at high concentrations in aquatic environments.',
      healthEffects: 'Excess zinc can cause nausea, vomiting, and impaired immune function.'
    }
  ],
  waterQuality: [
    { 
      value: 'Turbidity', 
      label: 'Turbidity', 
      category: 'Physical Parameter',
      unit: 'NTU',
      importance: 'Measures water clarity. High turbidity reduces light penetration and indicates potential contamination.',
      interpretation: 'Higher values suggest more suspended particles which may carry pollutants.',
      metalRelevance: 'Turbid waters often contain particle-bound metals and reduce treatment effectiveness.'
    },
    { 
      value: 'Chla', 
      label: 'Chlorophyll-a', 
      category: 'Biological Parameter',
      unit: 'μg/L',
      importance: 'Indicator of algal biomass. Correlates with nutrient pollution and potential toxin producers.',
      interpretation: 'Elevated levels indicate eutrophication and harmful algal bloom risks.',
      metalRelevance: 'Algae can bioaccumulate metals and affect their cycling in aquatic systems.'
    },
    { 
      value: 'TSS', 
      label: 'Total Suspended Solids', 
      category: 'Physical Parameter',
      unit: 'mg/L',
      importance: 'Measures suspended solids that can transport pollutants and reduce water quality.',
      interpretation: 'High TSS can smother aquatic habitats and indicate erosion or runoff issues.',
      metalRelevance: 'Many heavy metals adsorb to suspended particles, making TSS a proxy for metal transport.'
    }
  ]
};

// Water Quality Standards
const metalStandards = {
  Iron: {
    classA: 5,
    classB: 5,
    classC: 7.5,
    classD: 35,
    low: 7.5,
    moderate: 35,
    unit: 'mg/L',
    classification: {
      AA: "Public water supply class I (intended primarily for waters having watersheds which are uninhabited and otherwise protected and which require only approved disinfection to meet the National Standards for Drinking Water (NSDW) of the Philippines",
      A: "Public water supply class II (for sources that require complete treatment (coagulation, sedimentation, filtration, and disinfection) to meet NSDW)",
      B: "Recreational water class I (for primary contact recreation such as bathing, swimming, skin diving, etc.)",
      C: "Fishery water for the propagation and growth of fish and other aquatic resources",
      D: "For agriculture, irrigation, livestock watering, etc."
    }
  },
  Lead: {
    classA: 0.02,
    classB: 0.02,
    classC: 0.1,
    classD: 0.2,
    low: 0.1,
    moderate: 0.2,
    unit: 'mg/L',
    classification: {
      AA: "Public water supply class I",
      A: "Public water supply class II",
      B: "Recreational water class I",
      C: "Fishery water",
      D: "Agriculture, irrigation"
    }
  },
  Chromium: {
    classA: 0.02,
    classB: 0.02,
    classC: 0.02,
    classD: 0.04,
    low: 0.04,
    moderate: 0.04,
    unit: 'mg/L',
    classification: {
      AA: "Public water supply class I",
      A: "Public water supply class II",
      B: "Recreational water class I",
      C: "Fishery water",
      D: "Agriculture, irrigation"
    }
  },
  Arsenic: {
    classA: 0.02,
    classB: 0.02,
    classC: 0.04,
    classD: 0.08,
    low: 0.04,
    moderate: 0.08,
    unit: 'mg/L',
    classification: {
      AA: "Public water supply class I",
      A: "Public water supply class II",
      B: "Recreational water class I",
      C: "Fishery water",
      D: "Agriculture, irrigation"
    }
  },
  Zinc: {
    classA: 4,
    classB: 4,
    classC: 4,
    classD: 8,
    low: 8,
    moderate: 8,
    unit: 'mg/L',
    classification: {
      AA: "Public water supply class I",
      A: "Public water supply class II",
      B: "Recreational water class I",
      C: "Fishery water",
      D: "Agriculture, irrigation"
    }
  },
  Turbidity: {
    unit: 'NTU',
    classification: {
      AA: "Public water supply class I",
      A: "Public water supply class II",
      B: "Recreational water class I",
      C: "Fishery water",
      D: "Agriculture, irrigation"
    }
  },
  Chla: {
    unit: 'μg/L',
    classification: {
      AA: "Public water supply class I",
      A: "Public water supply class II",
      B: "Recreational water class I",
      C: "Fishery water",
      D: "Agriculture, irrigation"
    }
  },
  TSS: {
    unit: 'mg/L',
    classification: {
      AA: "Public water supply class I",
      A: "Public water supply class II",
      B: "Recreational water class I",
      C: "Fishery water",
      D: "Agriculture, irrigation"
    }
  }
};


// Action Plans
const actionPlans = {
  high: {
    title: "High Contamination Immediate Response Plan (Exceeds Class D)",
    steps: [
      "1. EMERGENCY NOTIFICATION:",
      "   Issue public health advisory within 24 hours",
      "   Notify DENR-EMB and local health department immediately",
      "   Post warning signs in affected areas (500m radius)",
      "   Activate community alert system (text, radio, social media)",
      "2. SOURCE IDENTIFICATION:",
      "   Conduct immediate tracer study upstream",
      "   Identify all potential industrial/commercial sources",
      "   Implement 24/7 monitoring at suspected discharge points",
      
      "3. IMMEDIATE MITIGATION:",
      "   Install temporary sediment barriers",
      "   Deploy aerators to increase dissolved oxygen",
      "   Begin emergency dredging if sediment contamination >50cm deep",
      
      "4. COMMUNITY PROTECTION:",
      "   Distribute bottled water to affected households",
      "   Provide free medical checkups for exposed residents",
      "   Establish alternative water sources (water tanks)",
      "   Set up community health monitoring stations",

      "5. LONG-TERM ACTIONS:",
      "   Require industries to install advanced treatment systems",
      "   Implement watershed rehabilitation program",
      "   Establish continuous monitoring network",
      "   Conduct public awareness campaigns on contamination risks",
      "   Review and update emergency response protocols"
    ],
    residentGuidance: [
      "DO NOT use water for drinking, cooking, or bathing",
      "Avoid all contact with contaminated water",
      "Report any health symptoms immediately",
      "Attend community briefings for updates",
      "Follow all posted advisories and warnings"
    ],
    classificationImpact: "Water exceeds Class D standards - unsuitable for any use without treatment"
  },
  moderate: {
    title: "Moderate Contamination Management Plan (Exceeds Class B/C)",
    steps: [
      "1. ENHANCED MONITORING:",
      "   Increase sampling frequency to weekly",
      "   Install 3 additional monitoring stations upstream",
      "   Conduct 24-hour composite sampling at key points",
      "   Publish weekly water quality reports",
      "2. SOURCE CONTROL:",
      "   Audit all permitted dischargers in watershed",
      "   Require pollution control plans from industries",
      "   Implement stricter wastewater discharge limits",
      "   Require regular compliance reporting from industries",
      "3. COMMUNITY ENGAGEMENT:",
      "   Conduct monthly community water forums",
      "   Train local water monitors from the community",
      "   Distribute water testing kits to barangays",
      "   Launch public awareness campaign on pollution sources",
      "4. PREVENTIVE MEASURES:",
      "   Establish 50m vegetative buffer zones",
      "   Implement erosion control projects",
      "   Upgrade stormwater management systems",
      "5. CONTINGENCY PLANNING:",
      "   Develop emergency response protocols",
      "   Identify alternative water sources",
      "   Prepare public notification templates"
    ],
    residentGuidance: [
      "Boil water before drinking if advised",
      "Limit recreational water contact",
      "Report any unusual water conditions",
      "Participate in community monitoring",
      "Practice proper waste disposal"
    ],
    classificationImpact: "Water exceeds Class B/C standards - limited recreational use, not suitable for drinking without treatment"
  },
  low: {
    title: "Low Contamination Maintenance Plan (Class A/B)",
    steps: [
      "1. ROUTINE MONITORING:",
      "   Maintain monthly water quality sampling",
      "   Calibrate monitoring equipment quarterly",
      "   Conduct annual watershed surveys",
      "   Distribute annual water quality brochures",
      "2. PREVENTIVE MAINTENANCE:",
      "   Inspect and maintain sewage systems",
      "   Clear drainage channels monthly",
      "   Maintain vegetative buffers",

      "3. COMMUNITY EDUCATION:",
      "   Conduct annual water conservation workshops",
      "   Distribute pollution prevention materials",
      "   Organize river clean-up events",
      "   Promote responsible land use practices",

      "4. REGULATORY COMPLIANCE:",
      "   Verify all dischargers have valid permits",
      "   Conduct unannounced industry inspections",
      "   Review zoning near water bodies",
      "   Update pollution control regulations annually",
      "5. CONTINUOUS IMPROVEMENT:",
      "   Update water quality database",
      "   Evaluate new treatment technologies",
      "   Benchmark against similar watersheds",
      "   Review and revise action plans annually",
    ],
    residentGuidance: [
      "Continue normal water use with routine testing",
      "Maintain proper septic system care",
      "Use eco-friendly cleaning products",
      "Participate in watershed protection activities",
      "Report any pollution incidents immediately"
    ],
    classificationImpact: "Water meets Class A/B standards - suitable for drinking with appropriate treatment"
  }
};

// Helper function to get parameter values
const getParameterValue = (item, parameter) => {
  const paramLower = parameter.toLowerCase();
  
  // Special handling for iron
  if (paramLower === 'iron') {
    return parseFloat(item.iron || item.iron_predicted || 0);
  }
  
  // Standard handling for other parameters
  const predictedValue = item[`${paramLower}_predicted`];
  const calibratedValue = item[`${paramLower}_calibrated`];
  const satValue = item[`${paramLower}_sat`];
  
  return parseFloat(predictedValue || calibratedValue || satValue || 0);
};

// Helper function to get contamination level
const getLevel = (metal, concentration) => {
  if (concentration === undefined || concentration === null) return 'Unknown';
  const stds = metalStandards[metal];
  if (!stds) return 'N/A';
  
  if (concentration < stds.low) return 'Low';
  if (concentration < stds.moderate) return 'Moderate';
  return 'High';
};

// Helper function to get level color
const getLevelColor = (level) => {
  if (level === 'Low') return '#4CAF50';
  if (level === 'Moderate') return '#FFC107';
  if (level === 'High') return '#F44336';
  return '#9E9E9E';
};

// Helper function to get present levels
const getPresentLevels = (filteredData, selectedParameter, isMetal) => {
  if (!isMetal) return [];
  const levels = new Set();
  filteredData.forEach(item => {
    const value = getParameterValue(item, selectedParameter);
    levels.add(getLevel(selectedParameter, value));
  });
  return Array.from(levels).sort((a, b) => {
    if (a === 'High') return -1;
    if (b === 'High') return 1;
    if (a === 'Moderate') return -1;
    if (b === 'Moderate') return 1;
    return 0;
  });
};

// Helper function to get valid present levels
const getValidPresentLevels = (filteredData, selectedParameter, isMetal) => {
  if (!isMetal) return [];
  
  const levels = new Set();
  filteredData.forEach(item => {
    const value = getParameterValue(item, selectedParameter);
    const level = getLevel(selectedParameter, value);
    if (level !== 'Unknown') {
      levels.add(level);
    }
  });
  
  // Return in order of severity: High, Moderate, Low
  return ['High', 'Moderate', 'Low'].filter(level => levels.has(level));
};

const getParameterUnit = (parameter) => {
  return metalStandards[parameter]?.unit || parameterGroups.waterQuality.find(p => p.value === parameter)?.unit || '';
};

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 10,
    paddingBottom: 13
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 5,
    borderBottom: '1 solid #eee',
    paddingBottom: 5,
    color: '#333',
    fontWeight: 'bold',
    keepWithNext: true 
  },
  text: {
    fontSize: 12,
    lineHeight: 1.9
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableColHeader: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f5f5f5',
    padding: 5
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  textHeader: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  //Chart styles
  chartContainer: {
    marginTop: 15,
    marginBottom: 20
  },
  chartTitle: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 24
  },
  chartStation: {
    width: '35%',
    fontSize: 10,
    paddingRight: 8
  },
  chartBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden'
  },
  chartBar: {
    height: '100%',
    borderRadius: 3
  },
  chartValue: {
    width: 80,
    fontSize: 10,
    textAlign: 'right',
    paddingLeft: 8
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2
  },
  //Action Plan styles
  planCard: {
    borderTopWidth: 4,
    borderTopStyle: 'solid',
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 0,
    breakInside: 'auto', 
    flexGrow: 1, 
    flexShrink: 1,
    flexDirection: 'column',
  },
  planTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    keepWithNext: true
  },
  planStepText: {
    fontSize: 10,
    lineHeight: 1.5
  },
  residentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
    keepWithNext: true
  },
  guidanceStep: {
    marginBottom: 6,
    paddingLeft: 15,
    textIndent: -15
  },
  guidanceText: {
    fontSize: 10,
    lineHeight: 1.4
  },
  footer: {
    marginTop: 30,
    borderTop: '1 solid #eee',
    paddingTop: 10,
    fontSize: 8,
    textAlign: 'center'
  },
  planSteps: {
    marginTop: 8
  },
  guidanceList: {
    marginTop: 8
  },
  guidanceItem: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 5,
    marginLeft: 10
  },
  planStep: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 6,
    keepWithNext: true,
    marginBottom: 8,
    paddingLeft: 10
  },
  cardSpacer: {
    height: 20
  },
  numberedStep: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bulletStep: {
    fontSize: 11,
    marginLeft: 15,
    marginBottom: 5,
  }
});

// PDF Document Component
// PDF Document Component with Classification Thresholds
const MyDocument = ({ reportData, selectedParameter, selectedDate, isMetal }) => {
  const validPresentLevels = getValidPresentLevels(reportData, selectedParameter, isMetal);
  const worstStation = reportData.reduce((worst, current) => {
    const currentValue = getParameterValue(current, selectedParameter);
    const worstValue = getParameterValue(worst, selectedParameter);
    return currentValue > worstValue ? current : worst;
  }, reportData[0]);

  const worstLevel = isMetal ? getLevel(selectedParameter, 
    getParameterValue(worstStation, selectedParameter)) : 'N/A';

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...reportData.map(item => getParameterValue(item, selectedParameter)),
    isMetal ? (metalStandards[selectedParameter]?.moderate || 0) : 0
  ) * 1.2;

  const renderMetalExecutiveSummary = () => {
    const paramInfo = parameterGroups.metals.find(p => p.value === selectedParameter) || {};
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Heavy Metal Contamination Report</Text>
        <Text style={styles.text}>
          Parameter: {selectedParameter} ({paramInfo.category})
        </Text>
        <Text style={styles.text}>Date: {selectedDate}</Text>
        <Text style={styles.text}>
          Scientific Background: {paramInfo.explanation}
        </Text>
        <Text style={styles.text}>
          Health Implications: {paramInfo.healthEffects}
        </Text>
        <Text style={styles.text}>
          Worst Affected Station: {worstStation.station} with {
            getParameterValue(worstStation, selectedParameter).toFixed(2)
          } {metalStandards[selectedParameter]?.unit || ''} ({worstLevel} level)
        </Text>
      </View>
    );
  };

  const renderWaterQualityExecutiveSummary = () => {
    const paramInfo = parameterGroups.waterQuality.find(p => p.value === selectedParameter) || {};
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Heavy Metal Contamination & Water Quality Parameter Report</Text>
        <Text style={styles.text}>
          Parameter: {selectedParameter} ({paramInfo.category})
        </Text>
        <Text style={styles.text}>Date: {selectedDate}</Text>
        <Text style={styles.text}>
          Importance: {paramInfo.importance}
        </Text>
        <Text style={styles.text}>
          Interpretation: {paramInfo.interpretation}
        </Text>
        <Text style={styles.text}>
          Metal Detection Relevance: {paramInfo.metalRelevance}
        </Text>
        <Text style={styles.text}>
          Highest Reading: {worstStation.station} with {getParameterValue(worstStation, selectedParameter).toFixed(2)} {selectedParameter === 'Chla' ? 'micrograms per liter' : getParameterUnit(selectedParameter)}
        </Text>
      </View>
    );
  };

  const renderThresholds = () => {
    if (!isMetal) return null;
    const stds = metalStandards[selectedParameter];
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water Quality Classification Thresholds</Text>
        
        <Text style={[styles.text, {marginBottom: 10}]}>
          {selectedParameter} Standards by Water Class ({stds?.unit || 'N/A'})
        </Text>
        
        {/* Water Class Standards Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, {width: '20%'}]}>
              <Text style={styles.textHeader}>Class</Text>
            </View>
            <View style={[styles.tableColHeader, {width: '20%'}]}>
              <Text style={styles.textHeader}>Threshold</Text>
            </View>
            <View style={[styles.tableColHeader, {width: '60%'}]}>
              <Text style={styles.textHeader}>Permissible Use</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>AA</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>{stds?.classA || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={styles.text}>{stds?.classification?.AA || 'Public water supply class I'}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>A</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>{stds?.classA || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={styles.text}>{stds?.classification?.A || 'Public water supply class II'}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>B</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>{stds?.classB || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={styles.text}>{stds?.classification?.B || 'Recreational water class I'}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>C</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>{stds?.classC || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={styles.text}>{stds?.classification?.C || 'Fishery water'}</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>D</Text>
            </View>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>{stds?.classD || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '60%'}]}>
              <Text style={styles.text}>{stds?.classification?.D || 'Agriculture, irrigation'}</Text>
            </View>
          </View>
        </View>
        
        {/* Contamination Levels Table */}
        <Text style={[styles.text, {marginTop: 15, marginBottom: 10}]}>
          Contamination Levels Interpretation
        </Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, {width: '20%'}]}>
              <Text style={styles.textHeader}>Level</Text>
            </View>
            <View style={[styles.tableColHeader, {width: '30%'}]}>
              <Text style={styles.textHeader}>Threshold</Text>
            </View>
            <View style={[styles.tableColHeader, {width: '50%'}]}>
              <Text style={styles.textHeader}>Classification Impact</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>Low</Text>
            </View>
            <View style={[styles.tableCol, {width: '30%'}]}>
              <Text style={styles.text}>&lt; {stds?.low || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '50%'}]}>
              <Text style={styles.text}>Meets Class A/B standards</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>Moderate</Text>
            </View>
            <View style={[styles.tableCol, {width: '30%'}]}>
              <Text style={styles.text}>{stds?.low || 'N/A'} – &lt; {stds?.moderate || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '50%'}]}>
              <Text style={styles.text}>Exceeds Class B/C standards</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, {width: '20%'}]}>
              <Text style={styles.text}>High</Text>
            </View>
            <View style={[styles.tableCol, {width: '30%'}]}>
              <Text style={styles.text}>greater than or equal to {stds?.moderate || 'N/A'}</Text>
            </View>
            <View style={[styles.tableCol, {width: '50%'}]}>
              <Text style={styles.text}>Exceeds Class D standards</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderWaterQualityInfo = () => {
    if (isMetal) return null;
    const paramInfo = parameterGroups.waterQuality.find(p => p.value === selectedParameter) || {};
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parameter Information</Text>
        <Text style={styles.text}>Measurement Unit: {selectedParameter === 'Chla' ? 'micrograms per liter' : getParameterUnit(selectedParameter)}</Text>
        <Text style={styles.text}>Scientific Significance: {paramInfo.importance}</Text>
        <Text style={styles.text}>Environmental Interpretation: {paramInfo.interpretation}</Text>
        <Text style={styles.text}>Metal Detection Significance: {paramInfo.metalRelevance}</Text>
      </View>
    );
  };

  const renderComparativeAnalysis = () => (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>Comparative Analysis</Text>
      <Text style={styles.chartTitle}>
        {selectedParameter} Levels by Station ({selectedDate})
      </Text>
      
      {reportData.map((item, index) => {
        const value = getParameterValue(item, selectedParameter);
        const level = isMetal ? getLevel(selectedParameter, value) : 'Measured';
        const widthPercent = Math.min((value / maxValue) * 100, 100);
        
        return (
          <View key={index} style={styles.chartRow}>
            <Text style={styles.chartStation}>{item.station}</Text>
            <View style={styles.chartBarContainer}>
              <View style={[
                styles.chartBar,
                { 
                  width: `${widthPercent}%`,
                  backgroundColor: isMetal ? getLevelColor(level) : '#4285F4'
                }
              ]}/>
            </View>
            <Text style={styles.chartValue}>
              {value.toFixed(2)} {selectedParameter === 'Chla' ? 'ng/mL' : getParameterUnit(selectedParameter)}
            </Text>
          </View>
        );
      })}
      
      {isMetal && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
            <Text>Moderate</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text>High</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderActionPlans = () => {
    if (!isMetal) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Action Plan</Text>
        {validPresentLevels.map((level) => {
          const levelKey = level.toLowerCase();
          const plan = actionPlans[levelKey];
          
          return (
            <View key={levelKey} style={[
              styles.planCard, 
              { borderTopColor: getLevelColor(level) }
            ]}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={[styles.text, {fontStyle: 'italic', marginBottom: 10}]}>
                {plan.classificationImpact}
              </Text>
              
              <View>
                {plan.steps.map((step, i) => (
                  <Text key={i} style={step.startsWith(' ') ? styles.bulletStep : styles.numberedStep}>
                    {step.startsWith(' ') ? '• ' + step.trim() : step}
                  </Text>
                ))}
              </View>
              
              <Text style={styles.residentTitle}>Resident Guidance:</Text>
              <View>
                {plan.residentGuidance.map((guidance, i) => (
                  <Text key={`g-${i}`} style={styles.guidanceItem}>
                    • {guidance}
                  </Text>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Document>
      <Page style={styles.page}>
        {isMetal ? renderMetalExecutiveSummary() : renderWaterQualityExecutiveSummary()}
        {renderComparativeAnalysis()}
      </Page>
      
      <Page style={styles.page}>
        {renderThresholds()}
        {renderWaterQualityInfo()}
        {renderActionPlans()}
        <View style={styles.footer}>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          <Text>LLDA Water Quality Monitoring System</Text>
        </View>
      </Page>
    </Document>
  );
};

const Reports = () => {
  const [csvData, setCsvData] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState('Iron');
  const [selectedParameterType, setSelectedParameterType] = useState('metals');
  const [selectedDate, setSelectedDate] = useState(null); 
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(contaminationData);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csvString = decoder.decode(result.value);
      
      Papa.parse(csvString, {
        header: true,
        complete: (results) => {
          // Normalize dates and filter out empty ones
          const processedData = results.data
            .map(row => {
              if (row.date) {
                // Convert from "1/1/2024" to "2024-01-01" format
                const [month, day, year] = row.date.split('/');
                const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                return {
                  ...row,
                  date: normalizedDate,
                  originalDate: row.date // Keep original format if needed
                };
              }
              return null;
            })
            .filter(Boolean);

          console.log('First 5 rows with iron values:', processedData.slice(0, 5).map(row => ({
            station: row.station,
            iron: row.iron,
            date: row.date,
            originalDate: row.originalDate
          })));

          const dates = [...new Set(processedData.map(row => row.date))].sort();
          setAvailableDates(dates);
          if (dates.length > 0) setSelectedDate(dates[0]);
          setCsvData(processedData);
          setIsLoading(false);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
      setIsLoading(false);
    }
  };

  loadData();
}, []);

  const handleDateChange = (e) => {
  const selected = e.target.value;
  if (availableDates.includes(selected)) {
    setSelectedDate(selected);
  } else {
    // Show error or select nearest available date
    alert('No data available for this date');
  }
};

  const handleParameterChange = (e) => {
    setSelectedParameter(e.target.value);
    setSelectedParameterType(
      parameterGroups.metals.some(m => m.value === e.target.value) ? 'metals' : 'waterQuality'
    );
  };

  const filteredData = csvData ? csvData.filter(row => row.date === selectedDate) : [];
  const isMetal = selectedParameterType === 'metals';
  const validPresentLevels = getValidPresentLevels(filteredData, selectedParameter, isMetal);

  const generateChartData = () => {
    if (!filteredData.length) return [];
    
    const data = [
      ['Station', 'Value', { role: 'style' }, { role: 'annotation' }]
    ];
    
    filteredData.forEach(item => {
      const value = getParameterValue(item, selectedParameter);
      const level = isMetal ? getLevel(selectedParameter, value) : 'Measured';
      
      let color;
      if (level === 'Low') color = '#4CAF50';
      else if (level === 'Moderate') color = '#FFC107';
      else if (level === 'High') color = '#F44336';
      else color = '#4285F4';
      
      data.push([
        item.station, 
        value, 
        color, 
        `${value.toFixed(2)} ${isMetal ? metalStandards[selectedParameter]?.unit || '' : ''}`
      ]);
    });
    
    return data;
  };

  const generateCSVData = () => {
    if (!filteredData.length) return [];
    
    const headers = [
      'Station', 
      'Location', 
      `${selectedParameter} Value`, 
      ...(isMetal ? ['Level'] : []),
      'Recommended Actions'
    ];
    
    const data = filteredData.map(item => {
      const value = getParameterValue(item, selectedParameter);
      const level = isMetal ? getLevel(selectedParameter, value) : 'N/A';
      
      let actions;
      if (isMetal) {
        if (level === 'High') {
          actions = "1. Issue public advisory 2. Identify pollution source 3. Install barriers";
        } else if (level === 'Moderate') {
          actions = "1. Increase monitoring 2. Audit industries 3. Community education";
        } else {
          actions = "1. Routine monitoring 2. Maintain buffers 3. Public awareness";
        }
      } else {
        actions = "1. Monitor trends 2. Investigate sources 3. Compare to historical data";
      }
      
      return [
        item.station,
        item.location || 'Unknown',
        `${value.toFixed(2)} ${isMetal ? metalStandards[selectedParameter]?.unit || '' : ''}`,
        ...(isMetal ? [level] : []),
        actions
      ];
    });
    
    return [headers, ...data];
  };

  const worstStation = filteredData.reduce((worst, current) => {
    const currentValue = getParameterValue(current, selectedParameter);
    const worstValue = getParameterValue(worst, selectedParameter);
    return currentValue > worstValue ? current : worst;
  }, filteredData[0] || {});

  const worstLevel = worstStation && isMetal ? 
    getLevel(selectedParameter, getParameterValue(worstStation, selectedParameter)) : 'N/A';

   const renderParameterSelect = () => (
    <div className="form-container">
      <div className="form-group">
        <label>Parameter Group:</label>
        <select
          value={selectedParameterType}
          onChange={(e) => setSelectedParameterType(e.target.value)}
        >
          <option value="metals">Metals</option>
          <option value="waterQuality">Water Quality</option>
        </select>
        
        <label>Parameter:</label>
        <select 
          value={selectedParameter} 
          onChange={handleParameterChange}
        >
          {parameterGroups[selectedParameterType].map(param => (
            <option key={param.value} value={param.value}>
              {param.label} ({param.category})
            </option>
          ))}
        </select>

        <label>Report Date:</label>
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
            min={availableDates[0]}
            max={availableDates[availableDates.length - 1]}
          />
      </div>
    </div>
);

  const formatOriginalDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  return `${parseInt(month)}/${parseInt(day)}/${year}`;
};

  const renderMetalExecutiveSummary = () => {
    const paramInfo = parameterGroups.metals.find(p => p.value === selectedParameter) || {};
    return (
      <section className="executive-summary">
        <h2>1. Detailed Metal Contamination Report</h2>
        <div className="parameter-info">
          <h3>{selectedParameter} ({paramInfo.category})</h3>
          <p><strong>Scientific Background:</strong> {paramInfo.explanation}</p>
          <p><strong>Health Implications:</strong> {paramInfo.healthEffects}</p>
        </div>
        <div className="findings-summary">
          <h3>Key Findings</h3>
          <p>
            The {selectedDate} monitoring shows {selectedParameter} levels across stations.
            {worstLevel === 'High' && 
              ` Critical contamination detected at ${worstStation.station} station (${getParameterValue(worstStation, selectedParameter).toFixed(2)} ${metalStandards[selectedParameter]?.unit || ''}), requiring immediate action.`}
            {worstLevel === 'Moderate' && 
              ` Elevated levels at ${worstStation.station} station (${getParameterValue(worstStation, selectedParameter).toFixed(2)} ${metalStandards[selectedParameter]?.unit || ''}), needing preventive measures.`}
            {worstLevel === 'Low' && 
              ' All stations show acceptable levels for this parameter.'}
          </p>
        </div>
      </section>
    );
  };

  const renderWaterQualityExecutiveSummary = () => {
    const paramInfo = parameterGroups.waterQuality.find(p => p.value === selectedParameter) || {};
    const value = getParameterValue(worstStation, selectedParameter);
    return (
      <section className="executive-summary">
        <h2>1. Comprehensive Water Quality Report</h2>
        <div className="parameter-info">
          <h3>{selectedParameter} ({paramInfo.category})</h3>
          <p><strong>Measurement Unit:</strong> {value.toFixed(2)} {selectedParameter === 'Chla' ? 'micrograms per liter' : getParameterUnit(selectedParameter)}</p>
          <p><strong>Scientific Significance:</strong> {paramInfo.importance}</p>
          <p><strong>Environmental Interpretation:</strong> {paramInfo.interpretation}</p>
        </div>
        <div className="findings-summary">
          <h3>Key Findings</h3>
          <p>
            The {selectedDate} monitoring shows {selectedParameter} levels across stations.
            {worstStation && ` Highest reading at ${worstStation.station} station (${getParameterValue(worstStation, selectedParameter).toFixed(2)} ${getParameterUnit(selectedParameter)}).`}
          </p>
          <p>
            <strong>Metal Detection Relevance:</strong> {paramInfo.metalRelevance}
          </p>
        </div>
      </section>
    );
  };

  const renderThresholds = () => {
  if (!isMetal) return null;
  const stds = metalStandards[selectedParameter];
  
  return (
    <section className="parameter-assessment">
      <h2>3. Heavy Metal Contamination Assessment</h2>
      <h3>{selectedParameter} Thresholds</h3>
      <table className="threshold-table">
        <thead>
          <tr>
            <th>Water Class</th>
            <th>Standard ({stds?.unit || 'N/A'})</th>
            <th>Permissible Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Class AA</td>
            <td>{stds?.classA || 'N/A'}</td>
            <td>{stds?.classification?.AA || 'Public water supply class I'}</td>
          </tr>
          <tr>
            <td>Class A</td>
            <td>{stds?.classA || 'N/A'}</td>
            <td>{stds?.classification?.A || 'Public water supply class II'}</td>
          </tr>
          <tr>
            <td>Class B</td>
            <td>{stds?.classB || 'N/A'}</td>
            <td>{stds?.classification?.B || 'Recreational water class I'}</td>
          </tr>
          <tr>
            <td>Class C</td>
            <td>{stds?.classC || 'N/A'}</td>
            <td>{stds?.classification?.C || 'Fishery water'}</td>
          </tr>
          <tr>
            <td>Class D</td>
            <td>{stds?.classD || 'N/A'}</td>
            <td>{stds?.classification?.D || 'Agriculture, irrigation'}</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Contamination Levels</h3>
      <table className="threshold-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Threshold ({stds?.unit || 'N/A'})</th>
            <th>Classification Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Low</td>
            <td>&lt; {stds?.low || 'N/A'}</td>
            <td>Meets Class A/B standards</td>
          </tr>
          <tr>
            <td>Moderate</td>
            <td>{stds?.low || 'N/A'} – &lt; {stds?.moderate || 'N/A'}</td>
            <td>Exceeds Class B/C standards</td>
          </tr>
          <tr>
            <td>High</td>
            <td>≥ {stds?.moderate || 'N/A'}</td>
            <td>Exceeds Class D standards</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

  const renderWaterQualityInfo = () => {
    if (isMetal) return null;
    const paramInfo = parameterGroups.waterQuality.find(p => p.value === selectedParameter) || {};
    return (
      <section className="parameter-assessment">
        <h2>3. Water Quality Parameter Analysis</h2>
        <div className="water-quality-info">
          <h3>About {selectedParameter}</h3>
          <p><strong>Measurement Unit:</strong> {paramInfo.unit || 'N/A'}</p>
          <p><strong>Scientific Significance:</strong> {paramInfo.importance}</p>
          <p><strong>Environmental Interpretation:</strong> {paramInfo.interpretation}</p>
          <p><strong>Metal Detection Relevance:</strong> {paramInfo.metalRelevance}</p>
        </div>
      </section>
    );
  };

  const renderActionPlans = () => {
  if (!isMetal) return null;
  
  const presentLevels = getValidPresentLevels(filteredData, selectedParameter, isMetal);
  if (!presentLevels.length) return null;

  // Get the worst level to highlight in the summary
  const worstLevel = presentLevels[0]; // Since they're ordered High -> Moderate -> Low

  return (
    <section className="recommendations">
      <h2>4. Comprehensive Action Plan</h2>
      <p>
        Based on {selectedParameter} levels across stations (Highest contamination level: {worstLevel}):
      </p>
      
      <div className="recommendation-cards">
        {presentLevels.map((level) => {
          const levelKey = level.toLowerCase();
          const plan = actionPlans[levelKey];
          
          return (
            <div key={levelKey} className={`card ${levelKey}`}>
              <h3 style={{fontSize: '16px', marginBottom: '15px'}}>{plan.title}</h3>
              <p style={{fontStyle: 'italic', marginBottom: '15px'}}>
                <strong>Classification Impact:</strong> {plan.classificationImpact}
              </p>
              <div className="action-steps" style={{marginBottom: '15px'}}>
                {plan.steps.map((step, i) => (
                  <div key={i} style={{marginBottom: step.match(/^\d+\./) ? '10px' : '5px'}}>
                    {step.startsWith('   ') ? (
                      <div style={{marginLeft: '20px'}}>• {step.trim()}</div>
                    ) : (
                      <div style={{fontWeight: 'bold'}}>{step}</div>
                    )}
                  </div>
                ))}
              </div>
              <h4 style={{fontSize: '14px', margin: '15px 0 10px 0'}}>Resident Guidance:</h4>
              <ul style={{fontSize: '13px', lineHeight: '1.6', paddingLeft: '20px'}}>
                {plan.residentGuidance.map((item, i) => (
                  <li key={i} style={{marginBottom: '8px'}}> {item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

  const renderWaterQualityGuidance = () => {
    if (isMetal) return null;
    return (
      <section className="recommendations">
        <h2>4. Monitoring Recommendations</h2>
        <div className="recommendation-cards">
          <div className="card">
            <h3>General Monitoring Guidance</h3>
            <ul>
              <li>Compare current readings to historical trends</li>
              <li>Correlate with rainfall and seasonal patterns</li>
              <li>Review upstream land use changes</li>
              <li>Coordinate with metal concentration data</li>
              <li>Consider follow-up testing if values are anomalous</li>
            </ul>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="report-container">
      <h1>Heavy Metal Concentration and Water Quality Monitoring Report</h1>
      
      {isLoading ? (
        <div className="loading">Loading data...</div>
      ) : csvData ? (
        <>
          <div className="report-controls">
            {renderParameterSelect()}
            
            <CSVLink 
              data={generateCSVData()} 
              filename={`heavy-metal-contamination-${selectedParameter}-${selectedDate}.csv`}
              className="export-btn"
              asyncOnClick={true}
            >
              Export to CSV
            </CSVLink>
            
            <PDFDownloadLink
              document={<MyDocument 
                reportData={filteredData} 
                selectedParameter={selectedParameter} 
                selectedDate={selectedDate}
                isMetal={isMetal}
              />}
              fileName={`heavy-metal-contamination-report-${selectedParameter}-${selectedDate}.pdf`}
              className="export-btn pdf-btn"
            >
              {({ loading }) => (loading ? 'Preparing PDF...' : 'Export to PDF')}
            </PDFDownloadLink>
          </div>
          
          {isMetal ? renderMetalExecutiveSummary() : renderWaterQualityExecutiveSummary()}
          
          <section className="charts-section">
            <h2>2. Comparative Analysis</h2>
            
            <div className="chart-container">
              <Chart
                width={'100%'}
                height={'400px'}
                chartType="BarChart"
                loader={<div>Loading Chart</div>}
                data={generateChartData()}
                options={{
                  title: `${selectedParameter} Levels by Station (${selectedDate})`,
                  chartArea: { width: '50%' },
                  hAxis: {
                    title: `Value (${getParameterUnit(selectedParameter)})`,
                    minValue: 0,
                  },
                  vAxis: {
                    title: 'Station',
                  },
                  legend: { position: 'none' },
                  colors: isMetal ? ['#4CAF50', '#FFC107', '#F44336'] : ['#4285F4']
                }}
              />
            </div>
          </section>
          
          {renderThresholds()}
          {renderWaterQualityInfo()}
          
          <h4>Station Readings for {selectedDate}</h4>
          <table className="readings-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Value ({getParameterUnit(selectedParameter)})</th>
                {isMetal && <th>Level</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const value = getParameterValue(item, selectedParameter);
                const level = isMetal ? getLevel(selectedParameter, value) : 'N/A';
                
                return (
                  <tr key={index}>
                    <td>{item.station}</td>
                    <td>
                      {value.toFixed(2)} {getParameterUnit(selectedParameter)}
                    </td>
                    {isMetal && (
                      <td className={`level-${level.toLowerCase()}`}>{level}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {renderActionPlans()}
          {renderWaterQualityGuidance()}
          
          <section className="summary-action">
            <h2>{isMetal ? '5. Implementation Roadmap' : '5. Additional Considerations'}</h2>
            
            <div className="timeline">
              {isMetal ? (
                <>
                  <h3>Immediate Actions (0-7 days):</h3>
                  <ul>
                    <li>Issue public notification within 24 hours</li>
                    <li>Deploy rapid response team to worst affected areas</li>
                    <li>Establish emergency water supply if needed</li>
                  </ul>
                  
                  <h3>Short-Term Actions (1-4 weeks):</h3>
                  <ul>
                    <li>Complete source identification investigation</li>
                    <li>Implement temporary mitigation measures</li>
                    <li>Conduct community awareness sessions</li>
                  </ul>
                  
                  <h3>Medium-Term Actions (1-6 months):</h3>
                  <ul>
                    <li>Install permanent treatment systems</li>
                    <li>Complete infrastructure upgrades</li>
                    <li>Establish community monitoring program</li>
                  </ul>
                  
                  <h3>Long-Term Actions (6+ months):</h3>
                  <ul>
                    <li>Implement watershed management plan</li>
                    <li>Conduct annual review of water quality trends</li>
                    <li>Update contingency plans based on lessons learned</li>
                  </ul>
                </>
              ) : (
                <>
                  <h3>Data Interpretation:</h3>
                  <ul>
                    <li>Compare with historical data for trends</li>
                    <li>Review correlations with metal concentrations</li>
                    <li>Consider seasonal variations in parameter levels</li>
                    <li>Evaluate against water quality objectives</li>
                  </ul>
                  
                  <h3>Follow-Up Actions:</h3>
                  <ul>
                    <li>Schedule additional sampling if values are anomalous</li>
                    <li>Review upstream activities and potential sources</li>
                    <li>Coordinate with metal monitoring data</li>
                    <li>Update monitoring protocols as needed</li>
                  </ul>
                </>
              )}
            </div>
            
            <div className="contact-info">
              <h3>Emergency Contacts:</h3>
              <p>LLDA: (02) 8332 2346</p>
              <p>DENR Hotline: 0939-918-0169</p>
              <p>Local Health Center: Check barangay notice board</p>
            </div>
          </section>
        </>
      ) : (
        <div className="no-data">No data available</div>
      )}
    </div>
  );
};

export default Reports;