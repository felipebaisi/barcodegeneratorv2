// Barcode type configurations
const BARCODE_LIMITS = {
    qrcode: {
        maxLength: 4296,
        description: 'Standard 2D barcode for URLs, text, etc.',
        errorLevels: ['L', 'M', 'Q', 'H'],
        defaultErrorLevel: 'M'
    },
    pdf417: {
        maxLength: 1850,
        description: 'High-density 2D barcode for IDs, shipping labels',
        errorLevels: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
        defaultErrorLevel: '2'
    },
    code39: {
        maxLength: 17,
        exactLength: 17,
        description: 'VIN barcode (17 uppercase alphanumeric, excludes I/O/Q)',
        pattern: /^[A-HJ-NPR-Z0-9]*$/,
        errorLevels: null,
        defaultErrorLevel: null
    }
};

// DOM Elements
const form = document.getElementById('barcodeForm');
const typeSelect = document.getElementById('barcodeType');
const textArea = document.getElementById('barcodeText');
const formatSelect = document.getElementById('outputFormat');
const scaleInput = document.getElementById('scale');
const eclevelSelect = document.getElementById('eclevel');
const mod43Checkbox = document.getElementById('mod43');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const previewSvg = document.getElementById('previewSvg');
const downloadBtn = document.getElementById('downloadBtn');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const typeHelp = document.getElementById('typeHelp');
const textHelp = document.getElementById('textHelp');
const charCount = document.getElementById('charCount');
const maxChars = document.getElementById('maxChars');
const validationMessage = document.getElementById('validationMessage');
const eclevelGroup = document.getElementById('eclevelGroup');
const mod43Group = document.getElementById('mod43Group');

let currentBarcodeData = null;
let currentFormat = 'png';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUIForBarcodeType();
    updateCharacterCount();
    
    // Event listeners
    typeSelect.addEventListener('change', updateUIForBarcodeType);
    textArea.addEventListener('input', handleTextInput);
    formatSelect.addEventListener('change', () => {
        currentFormat = formatSelect.value;
    });
    form.addEventListener('submit', handleSubmit);
    clearBtn.addEventListener('click', handleClear);
    downloadBtn.addEventListener('click', handleDownload);
});

// Update UI based on selected barcode type
function updateUIForBarcodeType() {
    const type = typeSelect.value;
    const config = BARCODE_LIMITS[type];
    
    // Update help text
    typeHelp.textContent = config.description;
    maxChars.textContent = config.maxLength.toLocaleString();
    textArea.maxLength = config.maxLength;
    
    // Update error correction level options
    if (config.errorLevels) {
        eclevelGroup.style.display = 'block';
        eclevelSelect.innerHTML = '';
        
        if (type === 'pdf417') {
            config.errorLevels.forEach(level => {
                const option = document.createElement('option');
                option.value = level;
                option.textContent = `Level ${level}`;
                if (level === config.defaultErrorLevel) option.selected = true;
                eclevelSelect.appendChild(option);
            });
            eclevelSelect.parentElement.querySelector('.help-text').textContent = 'Higher = more error recovery (0-8)';
        } else if (type === 'qrcode') {
            const qrLevels = {
                'L': 'Low (7%)',
                'M': 'Medium (15%)',
                'Q': 'Quartile (25%)',
                'H': 'High (30%)'
            };
            config.errorLevels.forEach(level => {
                const option = document.createElement('option');
                option.value = level;
                option.textContent = qrLevels[level];
                if (level === config.defaultErrorLevel) option.selected = true;
                eclevelSelect.appendChild(option);
            });
            eclevelSelect.parentElement.querySelector('.help-text').textContent = 'Higher = more damage recovery';
        }
    } else {
        eclevelGroup.style.display = 'none';
    }
    
    // Show/hide Mod 43 option for Code 39
    mod43Group.style.display = type === 'code39' ? 'block' : 'none';
    
    // Validate current text
    validateText();
}

// Handle text input
function handleTextInput() {
    updateCharacterCount();
    validateText();
}

// Update character count
function updateCharacterCount() {
    const length = textArea.value.length;
    const type = typeSelect.value;
    const config = BARCODE_LIMITS[type];
    
    charCount.textContent = length;
    
    // Color coding
    charCount.classList.remove('warning', 'danger');
    if (length > config.maxLength * 0.9) {
        charCount.classList.add('warning');
    }
    if (length > config.maxLength) {
        charCount.classList.add('danger');
    }
}

// Validate text input
function validateText() {
    const type = typeSelect.value;
    const text = textArea.value;
    const config = BARCODE_LIMITS[type];
    
    validationMessage.className = 'validation-message';
    validationMessage.style.display = 'none';
    
    if (!text) {
        return true;
    }
    
    // Check length
    if (text.length > config.maxLength) {
        validationMessage.textContent = `Text exceeds maximum length of ${config.maxLength} characters`;
        validationMessage.classList.add('error');
        return false;
    }
    
    // Code 39 / VIN specific validation
    if (type === 'code39') {
        if (config.exactLength && text.length !== config.exactLength) {
            validationMessage.textContent = `VIN must be exactly ${config.exactLength} characters (currently ${text.length})`;
            validationMessage.classList.add('warning');
            return text.length === 0; // Allow empty for now
        }
        
        if (!config.pattern.test(text)) {
            const invalidChars = text.split('').filter(c => !config.pattern.test(c)).join(', ');
            validationMessage.textContent = `VIN contains invalid characters: ${invalidChars}. Only A-Z and 0-9 allowed (excluding I, O, Q)`;
            validationMessage.classList.add('error');
            return false;
        }
        
        if (text !== text.toUpperCase()) {
            validationMessage.textContent = 'VIN must be uppercase. Click Generate to auto-convert.';
            validationMessage.classList.add('warning');
            return true; // Allow but warn
        }
        
        if (text.length === config.exactLength) {
            validationMessage.textContent = '✓ Valid VIN format';
            validationMessage.classList.add('success');
        }
    }
    
    return true;
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateText()) {
        return;
    }
    
    const type = typeSelect.value;
    let text = textArea.value.trim();
    
    // Auto-uppercase for Code 39
    if (type === 'code39') {
        text = text.toUpperCase();
        textArea.value = text;
    }
    
    if (!text) {
        showError('Please enter text to encode');
        return;
    }
    
    // Build request payload
    console.log('Reading form values:');
    console.log('- Scale:', scaleInput.value);
    console.log('- Error Level Display:', eclevelGroup.style.display);
    
    const payload = {
        type: type,
        text: text,
        format: formatSelect.value,
        options: {
            scale: parseInt(scaleInput.value, 10)
        }
    };
    
    // Add error correction level
    if (eclevelGroup.style.display !== 'none') {
        const eclevel = eclevelSelect.value;
        payload.options.eclevel = type === 'pdf417' ? parseInt(eclevel, 10) : eclevel;
    }
    
    // Add Mod 43 for Code 39
    if (type === 'code39') {
        payload.options.mod43 = mod43Checkbox.checked;
    }
    
    // Debug logging
    console.log('Generating barcode with payload:', JSON.stringify(payload, null, 2));
    
    // Show loading state
    setLoading(true);
    hideError();
    hidePreview();
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate barcode');
        }
        
        // Get the barcode data
        if (payload.format === 'svg') {
            const svgText = await response.text();
            currentBarcodeData = svgText;
            currentFormat = 'svg';
            displaySvgPreview(svgText);
        } else {
            const blob = await response.blob();
            currentBarcodeData = blob;
            currentFormat = 'png';
            displayImagePreview(blob);
        }
        
        showPreview();
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

// Display PNG preview
function displayImagePreview(blob) {
    const url = URL.createObjectURL(blob);
    previewImage.src = url;
    previewImage.style.display = 'block';
    previewSvg.style.display = 'none';
    
    const sizeKB = (blob.size / 1024).toFixed(2);
    document.getElementById('previewInfo').textContent = `PNG image (${sizeKB} KB)`;
}

// Display SVG preview
function displaySvgPreview(svgText) {
    previewSvg.innerHTML = svgText;
    previewSvg.style.display = 'block';
    previewImage.style.display = 'none';
    
    const sizeKB = (new Blob([svgText]).size / 1024).toFixed(2);
    document.getElementById('previewInfo').textContent = `SVG image (${sizeKB} KB) - Scalable vector format`;
}

// Handle download
function handleDownload() {
    if (!currentBarcodeData) return;
    
    const type = typeSelect.value;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const filename = `barcode-${type}-${timestamp}.${currentFormat}`;
    
    if (currentFormat === 'svg') {
        const blob = new Blob([currentBarcodeData], { type: 'image/svg+xml' });
        downloadBlob(blob, filename);
    } else {
        downloadBlob(currentBarcodeData, filename);
    }
}

// Download blob as file
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Handle clear
function handleClear() {
    form.reset();
    hidePreview();
    hideError();
    updateUIForBarcodeType();
    updateCharacterCount();
    currentBarcodeData = null;
}

// UI Helper Functions
function setLoading(loading) {
    const btnText = generateBtn.querySelector('.btn-text');
    const spinner = generateBtn.querySelector('.spinner');
    
    if (loading) {
        btnText.textContent = 'Generating...';
        spinner.style.display = 'inline-block';
        generateBtn.disabled = true;
    } else {
        btnText.textContent = 'Generate Barcode';
        spinner.style.display = 'none';
        generateBtn.disabled = false;
    }
}

function showPreview() {
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hidePreview() {
    previewSection.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    errorSection.style.display = 'none';
}
