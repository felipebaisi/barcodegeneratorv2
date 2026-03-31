// AAMVA Driver's License PDF417 Generator
// AAMVA DL/ID Card Design Standard - Version 9 (2016)

// Constants
const AAMVA_VERSION = {
  '9': { code: '09', year: '2016', description: 'AAMVA Version 9 (2016)' },
  '10': { code: '10', year: '2020', description: 'AAMVA Version 10 (2020)' }
};

// AAMVA Data Element Identifiers (DEIDs)
const DATA_ELEMENTS = {
  // Mandatory
  DCS: { name: 'DCS', description: 'Customer Family Name', required: true, maxLength: 40 },
  DAC: { name: 'DAC', description: 'Customer First Name', required: false, maxLength: 40 },
  DAD: { name: 'DAD', description: 'Customer Middle Name', required: false, maxLength: 40 },
  DBD: { name: 'DBD', description: 'Document Issue Date', required: true, format: 'MMDDYYYY' },
  DBB: { name: 'DBB', description: 'Date of Birth', required: true, format: 'MMDDYYYY' },
  DBA: { name: 'DBA', description: 'Document Expiration Date', required: true, format: 'MMDDYYYY' },
  DBC: { name: 'DBC', description: 'Sex', required: true, values: ['1', '2', '9'] },
  DAY: { name: 'DAY', description: 'Eye Color', required: true, maxLength: 3 },
  DAU: { name: 'DAU', description: 'Height', required: true, format: 'FTTIN or CM' },
  DAG: { name: 'DAG', description: 'Street Address', required: true, maxLength: 35 },
  DAI: { name: 'DAI', description: 'City', required: true, maxLength: 20 },
  DAJ: { name: 'DAJ', description: 'Jurisdiction Code', required: true, length: 2 },
  DAK: { name: 'DAK', description: 'Postal Code', required: true, maxLength: 11 },
  DAQ: { name: 'DAQ', description: 'Customer ID Number', required: true, maxLength: 25 },
  DCF: { name: 'DCF', description: 'Document Discriminator', required: true, maxLength: 25 },
  DCG: { name: 'DCG', description: 'Country Identification', required: true, values: ['USA', 'CAN'] },
  
  // Optional but common
  DAZ: { name: 'DAZ', description: 'Hair Color', required: false, maxLength: 3 },
  DCK: { name: 'DCK', description: 'Inventory Control Number', required: false, maxLength: 25 },
  DDA: { name: 'DDA', description: 'Compliance Type', required: false, values: ['F', 'N', 'M'] },
  DDB: { name: 'DDB', description: 'Card Revision Date', required: false, format: 'MMDDYYYY' },
  DDC: { name: 'DDC', description: 'HAZMAT Endorsement Exp Date', required: false, format: 'MMDDYYYY' },
  DDD: { name: 'DDD', description: 'Limited Duration Document Indicator', required: false, values: ['0', '1'] },
  DAW: { name: 'DAW', description: 'Weight (lbs)', required: false, maxLength: 3 },
  DCL: { name: 'DCL', description: 'Race/Ethnicity', required: false, maxLength: 2 },
  DCA: { name: 'DCA', description: 'Jurisdiction-specific Vehicle Class', required: false, maxLength: 4 },
  DCB: { name: 'DCB', description: 'Jurisdiction-specific Restriction Code', required: false, maxLength: 12 },
  DCD: { name: 'DCD', description: 'Jurisdiction-specific Endorsement Code', required: false, maxLength: 5 },
  DCU: { name: 'DCU', description: 'Name Suffix', required: false, maxLength: 10 },
  DCE: { name: 'DCE', description: 'Physical Description Weight Range', required: false, values: ['0-9'] },
  
  // Additional optional fields
  DBG: { name: 'DBG', description: 'Country of Birth', required: false, maxLength: 3 },
  DCI: { name: 'DCI', description: 'Place of Birth', required: false, maxLength: 33 },
  DCH: { name: 'DCH', description: 'Federal Commercial Vehicle Codes', required: false, maxLength: 4 },
  DAH: { name: 'DAH', description: 'Street Address 2', required: false, maxLength: 35 },
  DBN: { name: 'DBN', description: 'Alias/AKA Family Name', required: false, maxLength: 10 },
  DCJ: { name: 'DCJ', description: 'Audit Information', required: false, maxLength: 25 },
  DDF: { name: 'DDF', description: 'Name Change Flag', required: false, values: ['0', '1'] },
  DDG: { name: 'DDG', description: 'Medical Indicator', required: false, values: ['0', '1'] },
  DDH: { name: 'DDH', description: 'Organ Donor', required: false, values: ['0', '1'] },
  DDI: { name: 'DDI', description: 'Non-Resident Indicator', required: false, values: ['0', '1'] },
  DDJ: { name: 'DDJ', description: 'Unique Customer ID', required: false, maxLength: 25 },
  DDK: { name: 'DDK', description: 'Social Security Number', required: false, length: 9 },
  DBR: { name: 'DBR', description: 'Name Suffix (Redundant)', required: false, maxLength: 5 },
  DBO: { name: 'DBO', description: 'Alias First Name', required: false, maxLength: 10 },
  DAA: { name: 'DAA', description: 'Customer Full Name', required: false, maxLength: 35 },
  DBM: { name: 'DBM', description: 'Alias Middle Name', required: false, maxLength: 10 },
  DDE: { name: 'DDE', description: 'Family Name Truncation', required: false, values: ['T', 'N', 'U'] },
  DDF_FNAME: { name: 'DDF', description: 'First Name Truncation', required: false, values: ['T', 'N', 'U'] },
  DDG_MNAME: { name: 'DDG', description: 'Middle Name Truncation', required: false, values: ['T', 'N', 'U'] },
  
  // Permit and under age
  DCP: { name: 'DCP', description: 'Permit Classification Code', required: false, maxLength: 4 },
  DCQ: { name: 'DCQ', description: 'Permit Expiration Date', required: false, format: 'MMDDYYYY' },
  DCR: { name: 'DCR', description: 'Permit Identifier', required: false, maxLength: 20 },
  DCY: { name: 'DCY', description: 'Under 18 Until', required: false, format: 'MMDDYYYY' },
  DCZ: { name: 'DCZ', description: 'Under 19 Until', required: false, format: 'MMDDYYYY' },
  DDA_UNDER21: { name: 'DDA', description: 'Under 21 Until', required: false, format: 'MMDDYYYY' },
  
  // Veteran
  DDL: { name: 'DDL', description: 'Veteran', required: false, values: ['0', '1'] }
};

// State/Province Jurisdiction Codes and IINs
const JURISDICTIONS = {
  'AL': { name: 'Alabama', iin: '636033' },
  'AK': { name: 'Alaska', iin: '636059' },
  'AZ': { name: 'Arizona', iin: '636026' },
  'AR': { name: 'Arkansas', iin: '636021' },
  'CA': { name: 'California', iin: '636014' },
  'CO': { name: 'Colorado', iin: '636020' },
  'CT': { name: 'Connecticut', iin: '636006' },
  'DE': { name: 'Delaware', iin: '636011' },
  'DC': { name: 'District of Columbia', iin: '636043' },
  'FL': { name: 'Florida', iin: '636010' },
  'GA': { name: 'Georgia', iin: '636055' },
  'HI': { name: 'Hawaii', iin: '636047' },
  'ID': { name: 'Idaho', iin: '636050' },
  'IL': { name: 'Illinois', iin: '636035' },
  'IN': { name: 'Indiana', iin: '636037' },
  'IA': { name: 'Iowa', iin: '636018' },
  'KS': { name: 'Kansas', iin: '636022' },
  'KY': { name: 'Kentucky', iin: '636046' },
  'LA': { name: 'Louisiana', iin: '636007' },
  'ME': { name: 'Maine', iin: '636041' },
  'MD': { name: 'Maryland', iin: '636003' },
  'MA': { name: 'Massachusetts', iin: '636002' },
  'MI': { name: 'Michigan', iin: '636032' },
  'MN': { name: 'Minnesota', iin: '636038' },
  'MS': { name: 'Mississippi', iin: '636051' },
  'MO': { name: 'Missouri', iin: '636030' },
  'MT': { name: 'Montana', iin: '636008' },
  'NE': { name: 'Nebraska', iin: '636054' },
  'NV': { name: 'Nevada', iin: '636049' },
  'NH': { name: 'New Hampshire', iin: '636039' },
  'NJ': { name: 'New Jersey', iin: '636036' },
  'NM': { name: 'New Mexico', iin: '636009' },
  'NY': { name: 'New York', iin: '636001' },
  'NC': { name: 'North Carolina', iin: '636004' },
  'ND': { name: 'North Dakota', iin: '636034' },
  'OH': { name: 'Ohio', iin: '636023' },
  'OK': { name: 'Oklahoma', iin: '636058' },
  'OR': { name: 'Oregon', iin: '636029' },
  'PA': { name: 'Pennsylvania', iin: '636025' },
  'RI': { name: 'Rhode Island', iin: '636052' },
  'SC': { name: 'South Carolina', iin: '636005' },
  'SD': { name: 'South Dakota', iin: '636042' },
  'TN': { name: 'Tennessee', iin: '636053' },
  'TX': { name: 'Texas', iin: '636015' },
  'UT': { name: 'Utah', iin: '636040' },
  'VT': { name: 'Vermont', iin: '636024' },
  'VA': { name: 'Virginia', iin: '636000' },
  'WA': { name: 'Washington', iin: '636045' },
  'WV': { name: 'West Virginia', iin: '636061' },
  'WI': { name: 'Wisconsin', iin: '636031' },
  'WY': { name: 'Wyoming', iin: '636060' },
  // Canadian provinces
  'AB': { name: 'Alberta', iin: '604426' },
  'BC': { name: 'British Columbia', iin: '636028' },
  'MB': { name: 'Manitoba', iin: '636048' },
  'NB': { name: 'New Brunswick', iin: '636017' },
  'NL': { name: 'Newfoundland and Labrador', iin: '636016' },
  'NT': { name: 'Northwest Territories', iin: '604429' },
  'NS': { name: 'Nova Scotia', iin: '636013' },
  'NU': { name: 'Nunavut', iin: '604430' },
  'ON': { name: 'Ontario', iin: '636012' },
  'PE': { name: 'Prince Edward Island', iin: '604428' },
  'QC': { name: 'Quebec', iin: '604428' },
  'SK': { name: 'Saskatchewan', iin: '636044' },
  'YT': { name: 'Yukon', iin: '604427' }
};

/**
 * Format date from YYYY-MM-DD to MMDDYYYY for AAMVA
 */
function formatDateForAAMVA(dateString) {
  if (!dateString) return '';
  // Handle YYYY-MM-DD format from HTML date input
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${month}${day}${year}`;
  }
  return '';
}

/**
 * Format date from MMDDYYYY to readable format
 */
function formatDateForDisplay(aamvaDate) {
  if (!aamvaDate || aamvaDate.length !== 8) return aamvaDate;
  const month = aamvaDate.substring(0, 2);
  const day = aamvaDate.substring(2, 4);
  const year = aamvaDate.substring(4, 8);
  return `${month}/${day}/${year}`;
}

/**
 * Format height from feet and inches to AAMVA format (total inches with unit)
 * AAMVA spec: 3 digits + space + IN (e.g., "070 IN" for 5'10")
 */
function formatHeight(feet, inches) {
  if (!feet) return '';
  const totalInches = (parseInt(feet) * 12) + (parseInt(inches) || 0);
  return `${String(totalInches).padStart(3, '0')} IN`;
}

/**
 * Validate required fields
 */
function validateForm() {
  const errors = [];
  
  // Required fields
  const requiredFields = [
    { id: 'lastName', name: 'Last Name' },
    { id: 'dateOfBirth', name: 'Date of Birth' },
    { id: 'sex', name: 'Sex' },
    { id: 'eyeColor', name: 'Eye Color' },
    { id: 'heightFt', name: 'Height' },
    { id: 'streetAddress', name: 'Street Address' },
    { id: 'city', name: 'City' },
    { id: 'state', name: 'State' },
    { id: 'postalCode', name: 'Postal Code' },
    { id: 'licenseNumber', name: 'License Number' },
    { id: 'documentDiscriminator', name: 'Document Discriminator' },
    { id: 'issueDate', name: 'Issue Date' },
    { id: 'expirationDate', name: 'Expiration Date' }
  ];
  
  requiredFields.forEach(field => {
    const element = document.getElementById(field.id);
    if (!element.value.trim()) {
      errors.push(`${field.name} is required`);
      element.classList.add('invalid');
    } else {
      element.classList.remove('invalid');
      element.classList.add('valid');
    }
  });
  
  // Date validation
  const dob = document.getElementById('dateOfBirth').value;
  const issueDate = document.getElementById('issueDate').value;
  const expirationDate = document.getElementById('expirationDate').value;
  
  if (dob && issueDate && new Date(dob) >= new Date(issueDate)) {
    errors.push('Issue date must be after date of birth');
  }
  
  if (issueDate && expirationDate && new Date(issueDate) >= new Date(expirationDate)) {
    errors.push('Expiration date must be after issue date');
  }
  
  return errors;
}

/**
 * Display validation errors
 */
function displayValidationErrors(errors) {
  // Remove existing validation summary
  const existing = document.querySelector('.validation-summary');
  if (existing) existing.remove();
  
  if (errors.length === 0) return;
  
  const summary = document.createElement('div');
  summary.className = 'validation-summary';
  summary.innerHTML = `
    <h3>Please correct the following errors:</h3>
    <ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>
  `;
  
  const form = document.getElementById('dlForm');
  form.insertBefore(summary, form.firstChild);
  summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Generate AAMVA data string
 */
function generateAAMVAString(formData) {
  const version = formData.aamvaVersion || '9';
  const versionInfo = AAMVA_VERSION[version];
  const jurisdiction = formData.jurisdiction;
  const jurisdictionInfo = JURISDICTIONS[jurisdiction];
  
  // Build header
  const header = '@\n\x1e\rANSI '; // Compliance indicator + Record separator + Segment terminator + File type
  const iin = jurisdictionInfo.iin;
  const versionNumber = versionInfo.code;
  const numberOfEntries = '01'; // Typically 1 for DL/ID
  const subfileType = 'DL'; // Driver License
  
  // Header format: @\n\x1e\rANSI IINVVNNSubfile
  const headerString = `${header}${iin}${versionNumber}${numberOfEntries}${subfileType}`;
  
  // Build data elements
  const elements = [];
  
  // Mandatory fields
  if (formData.jurisdiction) elements.push(`DAJ${formData.jurisdiction}`);
  if (formData.licenseNumber) elements.push(`DAQ${formData.licenseNumber}`);
  if (formData.lastName) elements.push(`DCS${formData.lastName.toUpperCase()}`);
  if (formData.firstName) elements.push(`DAC${formData.firstName.toUpperCase()}`);
  if (formData.middleName) elements.push(`DAD${formData.middleName.toUpperCase()}`);
  if (formData.dateOfBirth) elements.push(`DBB${formatDateForAAMVA(formData.dateOfBirth)}`);
  if (formData.sex) elements.push(`DBC${formData.sex}`);
  if (formData.eyeColor) elements.push(`DAY${formData.eyeColor.toUpperCase()}`);
  if (formData.heightFt) elements.push(`DAU${formatHeight(formData.heightFt, formData.heightIn)}`);
  if (formData.streetAddress) elements.push(`DAG${formData.streetAddress.toUpperCase()}`);
  if (formData.city) elements.push(`DAI${formData.city.toUpperCase()}`);
  if (formData.postalCode) elements.push(`DAK${formData.postalCode}`);
  if (formData.documentDiscriminator) elements.push(`DCF${formData.documentDiscriminator}`);
  if (formData.issueDate) elements.push(`DBD${formatDateForAAMVA(formData.issueDate)}`);
  if (formData.expirationDate) elements.push(`DBA${formatDateForAAMVA(formData.expirationDate)}`);
  
  // Country (default USA)
  const country = formData.country || (['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].includes(jurisdiction) ? 'CAN' : 'USA');
  elements.push(`DCG${country}`);
  
  // Optional common fields
  if (formData.hairColor) elements.push(`DAZ${formData.hairColor.toUpperCase()}`);
  if (formData.weightLbs) elements.push(`DAW${formData.weightLbs}`);
  if (formData.classCode) elements.push(`DCA${formData.classCode.toUpperCase()}`);
  if (formData.restrictions) elements.push(`DCB${formData.restrictions.toUpperCase()}`);
  if (formData.endorsements) elements.push(`DCD${formData.endorsements.toUpperCase()}`);
  
  // Optional advanced fields
  if (formData.nameSuffix) elements.push(`DCU${formData.nameSuffix.toUpperCase()}`);
  // Note: Name Prefix (namePrefix) not in AAMVA V9 standard - omitting
  // Note: Inventory Control Number (DCK) not in AAMVA V9 - omitting
  // Note: Audit Information (DCJ) not in AAMVA V9 - omitting
  // DDB can be Card Revision Date OR Under 21 Until (AAMVA overloaded code)
  // Priority: Under 21 is more critical for age verification
  if (formData.under21) {
    elements.push(`DDB${formatDateForAAMVA(formData.under21)}`);
  } else if (formData.revisionDate) {
    elements.push(`DDB${formatDateForAAMVA(formData.revisionDate)}`);
  }
  if (formData.complianceType) elements.push(`DDA${formData.complianceType}`);
  if (formData.hazmatExpDate) elements.push(`DDC${formatDateForAAMVA(formData.hazmatExpDate)}`);
  if (formData.limitedDuration) elements.push(`DDD${formData.limitedDuration}`);
  if (formData.organDonor) elements.push(`DDH${formData.organDonor}`);
  if (formData.veteran) elements.push(`DDL${formData.veteran}`);
  if (formData.race) elements.push(`DCL${formData.race}`);
  if (formData.placeOfBirth) elements.push(`DCI${formData.placeOfBirth.toUpperCase()}`);
  if (formData.streetAddress2) elements.push(`DAH${formData.streetAddress2.toUpperCase()}`);
  
  // Alias names
  if (formData.aliasLastName) elements.push(`DBN${formData.aliasLastName.toUpperCase()}`);
  if (formData.aliasFirstName) elements.push(`DBO${formData.aliasFirstName.toUpperCase()}`);
  // Note: Alias middle name (DBM) not in AAMVA V9 - omitting
  
  // Age milestones (AAMVA V9)
  if (formData.under18) elements.push(`DCY${formatDateForAAMVA(formData.under18)}`);
  if (formData.under19) elements.push(`DCZ${formatDateForAAMVA(formData.under19)}`);
  // Under 21 handled above with DDB (overloaded code - priority given to age verification)
  
  // Permit information
  if (formData.permitClass) elements.push(`DCP${formData.permitClass.toUpperCase()}`);
  if (formData.permitExpDate) elements.push(`DCQ${formatDateForAAMVA(formData.permitExpDate)}`);
  if (formData.permitIdentifier) elements.push(`DCR${formData.permitIdentifier}`);
  // Note: Permit issue date not in AAMVA V9 standard - omitting
  
  // Join elements with line feed and add segment terminator
  const dataString = elements.join('\n') + '\r';
  
  return headerString + dataString;
}

/**
 * Format AAMVA string for display with descriptions
 */
function formatAAMVAForDisplay(aamvaString) {
  const lines = [];
  
  // Parse header
  const headerMatch = aamvaString.match(/@\n\x1e\rANSI (\d{6})(\d{2})(\d{2})(DL)/);
  if (headerMatch) {
    lines.push(`<div class="data-header">AAMVA PDF417 BARCODE HEADER</div>`);
    lines.push(`<div class="data-line"><span class="data-field">IIN:</span><span class="data-value">${headerMatch[1]}</span><span class="data-desc">Issuer Identification Number</span></div>`);
    lines.push(`<div class="data-line"><span class="data-field">VER:</span><span class="data-value">${headerMatch[2]}</span><span class="data-desc">AAMVA Version ${headerMatch[2]}</span></div>`);
    lines.push(`<div class="data-line"><span class="data-field">NUM:</span><span class="data-value">${headerMatch[3]}</span><span class="data-desc">Number of Entries</span></div>`);
    lines.push(`<div class="data-line"><span class="data-field">TYPE:</span><span class="data-value">${headerMatch[4]}</span><span class="data-desc">Driver License</span></div>`);
    lines.push(`<div class="data-header" style="margin-top: 15px;">DATA ELEMENTS</div>`);
  }
  
  // Parse data elements
  const dataSection = aamvaString.split(headerMatch[0])[1];
  if (dataSection) {
    const elements = dataSection.split('\n').filter(e => e.trim() && e !== '\r');
    elements.forEach(element => {
      const code = element.substring(0, 3);
      const value = element.substring(3).replace(/\r$/, '');
      const elementInfo = Object.values(DATA_ELEMENTS).find(e => e.name === code);
      const description = elementInfo ? elementInfo.description : 'Unknown';
      
      // Format dates for display
      let displayValue = value;
      if (elementInfo && elementInfo.format === 'MMDDYYYY' && value.length === 8) {
        displayValue = `${value} (${formatDateForDisplay(value)})`;
      }
      
      lines.push(`<div class="data-line"><span class="data-field">${code}:</span><span class="data-value">${displayValue}</span><span class="data-desc">${description}</span></div>`);
    });
  }
  
  return lines.join('');
}

/**
 * Collect form data
 */
function collectFormData() {
  return {
    // Document info
    aamvaVersion: document.getElementById('aamvaVersion').value,
    jurisdiction: document.getElementById('jurisdiction').value,
    
    // Personal info
    lastName: document.getElementById('lastName').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    dateOfBirth: document.getElementById('dateOfBirth').value,
    sex: document.getElementById('sex').value,
    
    // License info
    licenseNumber: document.getElementById('licenseNumber').value,
    documentDiscriminator: document.getElementById('documentDiscriminator').value,
    issueDate: document.getElementById('issueDate').value,
    expirationDate: document.getElementById('expirationDate').value,
    classCode: document.getElementById('classCode').value,
    restrictions: document.getElementById('restrictions').value,
    endorsements: document.getElementById('endorsements').value,
    
    // Physical description
    eyeColor: document.getElementById('eyeColor').value,
    heightFt: document.getElementById('heightFt').value,
    heightIn: document.getElementById('heightIn').value,
    hairColor: document.getElementById('hairColor').value,
    weightLbs: document.getElementById('weightLbs').value,
    
    // Address
    streetAddress: document.getElementById('streetAddress').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    postalCode: document.getElementById('postalCode').value,
    
    // Advanced fields
    nameSuffix: document.getElementById('nameSuffix').value,
    namePrefix: document.getElementById('namePrefix').value,
    aliasLastName: document.getElementById('aliasLastName').value,
    aliasFirstName: document.getElementById('aliasFirstName').value,
    aliasMiddleName: '', // Not in HTML form
    hazmatExpDate: document.getElementById('hazmatExpiry').value,
    under18: document.getElementById('under18Until').value,
    under19: document.getElementById('under19Until').value,
    under21: document.getElementById('under21Until').value,
    complianceType: document.getElementById('complianceType').value,
    limitedDuration: document.getElementById('limitedDuration').value,
    organDonor: document.getElementById('organDonor').value,
    veteran: document.getElementById('veteran').value,
    inventoryControl: document.getElementById('inventoryControl').value,
    auditInfo: document.getElementById('auditInfo').value,
    revisionDate: document.getElementById('revisionDate').value,
    race: document.getElementById('race').value,
    placeOfBirth: document.getElementById('placeOfBirth').value,
    streetAddress2: document.getElementById('streetAddress2').value,
    country: document.getElementById('country').value,
    permitClass: document.getElementById('permitClass').value,
    permitExpDate: document.getElementById('permitExpiry').value,
    permitIdentifier: document.getElementById('permitIdentifier') ? document.getElementById('permitIdentifier').value : '',
    permitIssueDate: '' // Removed from form - not in AAMVA V9 standard
  };
}

/**
 * Handle form submission
 */
async function handleGenerate(event) {
  event.preventDefault();
  
  // Validate form
  const errors = validateForm();
  if (errors.length > 0) {
    displayValidationErrors(errors);
    return;
  }
  
  // Remove validation summary if exists
  const existing = document.querySelector('.validation-summary');
  if (existing) existing.remove();
  
  // Collect form data
  const formData = collectFormData();
  
  // Generate AAMVA string
  const aamvaString = generateAAMVAString(formData);
  
  // Display raw data string
  document.getElementById('rawDataString').value = aamvaString;
  
  // Display formatted data string
  const formattedHtml = formatAAMVAForDisplay(aamvaString);
  document.getElementById('formattedDataString').innerHTML = formattedHtml;
  
  // Show data display section
  document.getElementById('dataStringSection').style.display = 'block';
  
  // Generate barcode
  try {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    
    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'pdf417',
        text: aamvaString,
        format: 'png',
        options: {
          scale: 2,
          padding: 10
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate barcode: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    // Display barcode
    const barcodeImage = document.getElementById('barcodeImage');
    barcodeImage.src = imageUrl;
    barcodeImage.style.display = 'block';
    
    // Enable download button
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'inline-block';
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `drivers-license-${formData.licenseNumber || 'barcode'}.png`;
      a.click();
    };
    
    // Show preview section
    document.getElementById('barcodePreviewSection').style.display = 'block';
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = '✓ AAMVA PDF417 barcode generated successfully!';
    document.getElementById('barcodePreviewSection').insertBefore(
      successMsg,
      document.getElementById('barcodePreviewSection').firstChild
    );
    setTimeout(() => successMsg.remove(), 5000);
    
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate PDF417 Barcode';
    
  } catch (error) {
    console.error('Error generating barcode:', error);
    alert('Error generating barcode: ' + error.message);
    
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate PDF417 Barcode';
  }
}

/**
 * Fill form with example data
 */
function fillExampleData() {
  document.getElementById('aamvaVersion').value = '9';
  document.getElementById('jurisdiction').value = 'CA';
  document.getElementById('lastName').value = 'SAMPLE';
  document.getElementById('firstName').value = 'JOHN';
  document.getElementById('middleName').value = 'MICHAEL';
  document.getElementById('dateOfBirth').value = '1985-06-15';
  document.getElementById('sex').value = '1';
  document.getElementById('licenseNumber').value = 'D1234567';
  document.getElementById('documentDiscriminator').value = '20240115AB123456789';
  document.getElementById('issueDate').value = '2024-01-15';
  document.getElementById('expirationDate').value = '2029-06-15';
  document.getElementById('classCode').value = 'C';
  document.getElementById('restrictions').value = 'NONE';
  document.getElementById('endorsements').value = '';
  document.getElementById('eyeColor').value = 'BRO';
  document.getElementById('heightFt').value = '5';
  document.getElementById('heightIn').value = '10';
  document.getElementById('hairColor').value = 'BRN';
  document.getElementById('weightLbs').value = '175';
  document.getElementById('streetAddress').value = '123 MAIN ST';
  document.getElementById('city').value = 'SACRAMENTO';
  document.getElementById('state').value = 'CA';
  document.getElementById('postalCode').value = '95814';
  document.getElementById('complianceType').value = 'F';
  document.getElementById('organDonor').value = '1';
}

/**
 * Clear form
 */
function clearForm() {
  document.getElementById('dlForm').reset();
  document.getElementById('dataStringSection').style.display = 'none';
  document.getElementById('barcodePreviewSection').style.display = 'none';
  document.querySelectorAll('.invalid, .valid').forEach(el => {
    el.classList.remove('invalid', 'valid');
  });
  const existing = document.querySelector('.validation-summary');
  if (existing) existing.remove();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('DL Generator: DOM loaded, initializing...');
  
  const generateBtn = document.getElementById('generateBtn');
  const fillExampleBtn = document.getElementById('fillExampleBtn');
  const clearBtn = document.getElementById('clearBtn');
  
  if (!generateBtn || !fillExampleBtn || !clearBtn) {
    console.error('DL Generator: Required buttons not found!', {
      generateBtn: !!generateBtn,
      fillExampleBtn: !!fillExampleBtn,
      clearBtn: !!clearBtn
    });
    return;
  }
  
  generateBtn.addEventListener('click', handleGenerate);
  fillExampleBtn.addEventListener('click', fillExampleData);
  clearBtn.addEventListener('click', clearForm);
  
  console.log('DL Generator: Event listeners attached successfully');
  
  // Real-time validation on blur
  const requiredInputs = document.querySelectorAll('input[required], select[required]');
  requiredInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        input.classList.remove('invalid');
        input.classList.add('valid');
      } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
      }
    });
  });
  
  console.log(`DL Generator: Attached blur listeners to ${requiredInputs.length} required inputs`);
});
