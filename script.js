// Javascript Logic for Premium BMI Tracker & Health Dashboard

// State variables
let currentHeightUnit = 'cm';
let currentWeightUnit = 'kg';
let savedHistory = [];

// DOM Elements
const heightInput = document.getElementById('height-input');
const heightUnitSelect = document.getElementById('height-unit');
const weightInput = document.getElementById('weight-input');
const weightUnitSelect = document.getElementById('weight-unit');
const ageInput = document.getElementById('age-input');
const goalSelect = document.getElementById('goal-select');
const bmiValueText = document.getElementById('bmi-value-text');
const bmiStatusText = document.getElementById('bmi-status-text');
const bmiStatusHeart = document.getElementById('bmi-status-heart');
const bmiStatusContainer = document.getElementById('bmi-status-container');
const feedbackMessage = document.getElementById('feedback-message');
const idealMinWeightEl = document.getElementById('ideal-min-weight');
const idealMaxWeightEl = document.getElementById('ideal-max-weight');
const idealAdvisoryEl = document.getElementById('ideal-weight-advisory');
const needle = document.getElementById('gauge-needle');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const historyModal = document.getElementById('history-modal');
const historyTableBody = document.getElementById('history-table-body');
const historyTableContainer = document.getElementById('history-table-container');
const historyEmpty = document.getElementById('history-list-empty');
const statsCurrentWeight = document.getElementById('stats-current-weight');

// Event Listeners on Page Load
window.addEventListener('DOMContentLoaded', () => {
    // Load Theme Preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Load History
    const historyData = localStorage.getItem('bmi_history');
    if (historyData) {
        savedHistory = JSON.parse(historyData);
    }
    
    // Set initial values and calculate default
    updateStatsWeightDisplay();
    runCalculation();
});

// Theme Toggle Action
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Conversion Constants
const CM_TO_M = 0.01;
const CM_TO_FT = 1 / 30.48;
const CM_TO_IN = 1 / 2.54;

const KG_TO_LBS = 2.20462;
const KG_TO_ST = 1 / 6.35029;

// Convert Height helper
function convertHeight(value, fromUnit, toUnit) {
    if (value === "" || isNaN(value)) return "";
    // Convert to CM first
    let cmVal;
    if (fromUnit === 'cm') cmVal = value;
    else if (fromUnit === 'm') cmVal = value * 100;
    else if (fromUnit === 'ft') cmVal = value * 30.48;
    else if (fromUnit === 'in') cmVal = value * 2.54;

    // Convert from CM to Target
    if (toUnit === 'cm') return Math.round(cmVal);
    if (toUnit === 'm') return parseFloat((cmVal * CM_TO_M).toFixed(2));
    if (toUnit === 'ft') return parseFloat((cmVal * CM_TO_FT).toFixed(2));
    if (toUnit === 'in') return parseFloat((cmVal * CM_TO_IN).toFixed(1));
    return value;
}

// Convert Weight helper
function convertWeight(value, fromUnit, toUnit) {
    if (value === "" || isNaN(value)) return "";
    // Convert to KG first
    let kgVal;
    if (fromUnit === 'kg') kgVal = value;
    else if (fromUnit === 'lbs') kgVal = value / KG_TO_LBS;
    else if (fromUnit === 'st') kgVal = value * 6.35029;

    // Convert from KG to Target
    if (toUnit === 'kg') return Math.round(kgVal);
    if (toUnit === 'lbs') return Math.round(kgVal * KG_TO_LBS);
    if (toUnit === 'st') return parseFloat((kgVal * KG_TO_ST).toFixed(1));
    return value;
}

// Height Unit Handlers
function onHeightUnitChange() {
    const newUnit = heightUnitSelect.value;
    const oldVal = parseFloat(heightInput.value);
    if (!isNaN(oldVal)) {
        const newVal = convertHeight(oldVal, currentHeightUnit, newUnit);
        heightInput.value = newVal;
    }
    currentHeightUnit = newUnit;
    updateHeightPills();
    runCalculation();
}

function setHeightUnit(unit) {
    heightUnitSelect.value = unit;
    onHeightUnitChange();
}

function updateHeightPills() {
    document.querySelectorAll('.unit-selector-pills').forEach(group => {
        group.querySelectorAll('button.pill').forEach(pill => {
            const onclickAttr = pill.getAttribute('onclick') || '';
            if (onclickAttr.includes('setHeightUnit')) {
                const match = onclickAttr.match(/'([^']+)'/);
                if (match) {
                    pill.classList.toggle('active', match[1] === currentHeightUnit);
                }
            }
        });
    });
}

// Weight Unit Handlers
function onWeightUnitChange() {
    const newUnit = weightUnitSelect.value;
    const oldVal = parseFloat(weightInput.value);
    if (!isNaN(oldVal)) {
        const newVal = convertWeight(oldVal, currentWeightUnit, newUnit);
        weightInput.value = newVal;
    }
    currentWeightUnit = newUnit;
    updateWeightPills();
    updateStatsWeightDisplay();
    runCalculation();
}

function setWeightUnit(unit) {
    weightUnitSelect.value = unit;
    onWeightUnitChange();
}

function updateWeightPills() {
    document.querySelectorAll('.unit-selector-pills').forEach(group => {
        group.querySelectorAll('button.pill').forEach(pill => {
            const onclickAttr = pill.getAttribute('onclick') || '';
            if (onclickAttr.includes('setWeightUnit')) {
                const match = onclickAttr.match(/'([^']+)'/);
                if (match) {
                    pill.classList.toggle('active', match[1] === currentWeightUnit);
                }
            }
        });
    });
}

// Update weight display in the current stats box (element may be absent in HTML)
function updateStatsWeightDisplay() {
    if (!statsCurrentWeight) return;
    const currentVal = parseFloat(weightInput.value);
    statsCurrentWeight.innerText = !isNaN(currentVal)
        ? `${currentVal} ${currentWeightUnit}`
        : `-- ${currentWeightUnit}`;
}

// Perform calculation and update UI (real-time or on form submit)
function calculateBMI(event) {
    if (event) event.preventDefault();
    runCalculation();
}

function runCalculation() {
    const heightVal = parseFloat(heightInput.value);
    const weightVal = parseFloat(weightInput.value);
    
    if (isNaN(heightVal) || isNaN(weightVal) || heightVal <= 0 || weightVal <= 0) {
        // Set UI to blank/empty state
        bmiValueText.innerText = "--";
        bmiStatusText.innerText = "No Data";
        bmiStatusHeart.innerText = "📊";
        bmiStatusContainer.className = 'bmi-status-pill';
        needle.style.transform = `rotate(-90deg)`; // Reset needle to start
        feedbackMessage.innerText = "Enter your details and click Calculate BMI to see your results.";
        idealAdvisoryEl.innerHTML = "Enter your height to see your ideal normal weight range.";
        
        // Deactivate all segments in Category Guide
        const segments = document.querySelectorAll('.category-segment');
        segments.forEach(segment => {
            segment.classList.remove('active');
            const arrow = segment.querySelector('.category-indicator-arrow');
            if (arrow) arrow.remove();
        });
        
        // Update weight display in stats card to blank
        if (statsCurrentWeight) {
            statsCurrentWeight.innerText = `-- ${currentWeightUnit}`;
        }
        return;
    }

    // Convert height to meters
    let heightM;
    if (currentHeightUnit === 'cm') heightM = heightVal / 100;
    else if (currentHeightUnit === 'm') heightM = heightVal;
    else if (currentHeightUnit === 'ft') heightM = heightVal * 0.3048;
    else if (currentHeightUnit === 'in') heightM = heightVal * 0.0254;

    // Convert weight to kg
    let weightKg;
    if (currentWeightUnit === 'kg') weightKg = weightVal;
    else if (currentWeightUnit === 'lbs') weightKg = weightVal / KG_TO_LBS;
    else if (currentWeightUnit === 'st') weightKg = weightVal * 6.35029;

    // BMI Formula: weight (kg) / height^2 (m^2)
    const bmi = weightKg / (heightM * heightM);
    const bmiScore = parseFloat(bmi.toFixed(1));

    // Update value text
    bmiValueText.innerText = bmiScore;

    // Determine Category & UI properties
    let category = '';
    let heart = '💚';
    let statusClass = 'normal';
    let feedback = '';

    if (bmiScore < 18.5) {
        category = 'Underweight';
        heart = '🥗';
        statusClass = 'underweight';
    } else if (bmiScore >= 18.5 && bmiScore < 25) {
        category = 'Normal';
        heart = '✅';
        statusClass = 'normal';
    } else if (bmiScore >= 25 && bmiScore < 30) {
        category = 'Overweight';
        heart = '⚠️';
        statusClass = 'overweight';
    } else if (bmiScore >= 30 && bmiScore < 40) {
        category = 'Obese';
        heart = '🏃';
        statusClass = 'obese';
    } else {
        category = 'Severe Obese';
        heart = '🩺';
        statusClass = 'severe';
    }

    // Set Needle Angle
    // Min BMI mapped is 15 (angle -90deg), Max BMI mapped is 40 (angle 90deg)
    const cappedBmi = Math.max(15, Math.min(40, bmiScore));
    const percent = (cappedBmi - 15) / 25; // 0 to 1
    const angle = -90 + (percent * 180);
    needle.style.transform = `rotate(${angle}deg)`;

    // Update Status Pill
    bmiStatusText.innerText = category;
    bmiStatusHeart.innerText = heart;
    
    // Style status pill
    bmiStatusContainer.className = 'bmi-status-pill';
    bmiStatusContainer.classList.add(`status-${statusClass}`);

    // Update active segment indicator in Category Guide
    updateCategoryGuideIndicator(statusClass);

    // Dynamic Advisory Message based on Goal and Category
    const goal = goalSelect.value;
    feedback = generateAdvisory(category, goal);
    feedbackMessage.innerText = feedback;

    // Ideal Weight Range Calculation (Standard normal range is 18.5 to 24.9)
    const idealMinKg = 18.5 * (heightM * heightM);
    const idealMaxKg = 24.9 * (heightM * heightM);

    let idealMinConverted = convertWeight(idealMinKg, 'kg', currentWeightUnit);
    let idealMaxConverted = convertWeight(idealMaxKg, 'kg', currentWeightUnit);

    idealMinWeightEl.innerText = `${idealMinConverted} ${currentWeightUnit}`;
    idealMaxWeightEl.innerText = `${idealMaxConverted} ${currentWeightUnit}`;
    
    // Format height in advisory text
    let heightFormatted = `${heightVal} ${currentHeightUnit}`;
    idealAdvisoryEl.innerHTML = `For your height (${heightFormatted}), a weight between <strong>${idealMinConverted} ${currentWeightUnit}</strong> - <strong>${idealMaxConverted} ${currentWeightUnit}</strong> is considered normal.`;
}

// Set active category guide indicator in bottom bar
function updateCategoryGuideIndicator(statusClass) {
    const segments = document.querySelectorAll('.category-segment');
    segments.forEach(segment => {
        segment.classList.remove('active');
        // remove arrow
        const arrow = segment.querySelector('.category-indicator-arrow');
        if (arrow) arrow.remove();
        
        if (segment.getAttribute('data-category') === statusClass) {
            segment.classList.add('active');
            // Add arrow back
            const arrowEl = document.createElement('div');
            arrowEl.className = 'category-indicator-arrow';
            arrowEl.innerText = '▼';
            segment.appendChild(arrowEl);
        }
    });
}

// Generate health advice tailored to goal & category
function generateAdvisory(category, goal) {
    if (goal === 'loss') {
        if (category === 'Underweight') {
            return "Your goal is Weight Loss, but you are currently Underweight. Please consult a nutritionist to establish a healthy weight gain plan first! 💙";
        } else if (category === 'Normal') {
            return "Your BMI is normal. To lose weight safely, maintain a small, healthy calorie deficit and focus on fitness and toning! 🏃‍♀️";
        } else if (category === 'Overweight') {
            return "Great goal! Aim for a gradual weight loss of 0.5 kg/week through a balanced calorie deficit and regular activity. You've got this! 💪";
        } else {
            return "Let's work on your health together! A steady path of portion control, hydration, and low-impact active habits will yield amazing progress! 🚀";
        }
    } else if (goal === 'gain') {
        if (category === 'Underweight') {
            return "Excellent goal! Focus on a clean caloric surplus with nutrient-dense foods (nuts, protein, whole grains) and strength training to build lean mass. 💪";
        } else if (category === 'Normal') {
            return "Your BMI is in the healthy range. To build clean muscle, focus on progressive strength training and a mild, protein-rich caloric surplus! 🏋️‍♀️";
        } else {
            return "You have selected Weight Gain, but your BMI is in the overweight/obese range. Focus on body recomposition (building muscle, losing fat) instead! ⚖️";
        }
    } else if (goal === 'maintain') {
        if (category === 'Underweight') {
            return "You are Underweight. Focus on reaching a normal BMI first by gradually increasing your daily intake of nourishing foods! 🍏";
        } else if (category === 'Normal') {
            return "Perfect! Maintain your current healthy weight by balancing your daily activity with healthy, satisfying nutrition habits! 💚";
        } else {
            return "Aim to bring your weight into a normal range gradually before focusing on long-term maintenance. You can do it! 🌟";
        }
    } else { // General health
        if (category === 'Underweight') {
            return "You are in the Underweight range. Focus on regular, nutrient-rich meals to build energy, strength, and immune health. 🍏";
        } else if (category === 'Normal') {
            return "Great job! You have a normal BMI. You're in the healthy range. Keep up the consistent wellness habits! 🎉";
        } else if (category === 'Overweight') {
            return "You're in the Overweight range. Small adjustments like drinking more water and adding a daily 30-minute walk make a huge difference! 🚶‍♀️";
        } else {
            return "Small steps today, healthier tomorrow. Focus on daily wellness habits, stay active, and consult a healthcare provider for custom guidance! 🌟";
        }
    }
}

// Reset inputs and needle
function resetForm() {
    heightInput.value = "";
    weightInput.value = "";
    ageInput.value = "";
    goalSelect.value = "general";
    
    // Reset unit dropdowns to defaults
    heightUnitSelect.value = "cm";
    weightUnitSelect.value = "kg";
    currentHeightUnit = "cm";
    currentWeightUnit = "kg";
    
    // Reset unit pills
    updateHeightPills();
    updateWeightPills();
    updateStatsWeightDisplay();
    
    // Clear gender selectors
    document.getElementById('gender-male').checked = false;
    document.getElementById('gender-female').checked = false;
    
    // Recalculate based on default (which will trigger empty state)
    runCalculation();
}

// History Management using localStorage
function saveCurrentResult() {
    const heightVal = parseFloat(heightInput.value);
    const weightVal = parseFloat(weightInput.value);
    const bmiScore = bmiValueText.innerText;
    const category = bmiStatusText.innerText;

    if (isNaN(heightVal) || isNaN(weightVal) || bmiScore === "--") {
        alert("Please calculate your BMI first!");
        return;
    }

    const newRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        height: `${heightVal} ${currentHeightUnit}`,
        weight: `${weightVal} ${currentWeightUnit}`,
        bmi: bmiScore,
        category: category
    };

    savedHistory.unshift(newRecord);
    localStorage.setItem('bmi_history', JSON.stringify(savedHistory));

    // Show button success state temporarily
    const saveBtnLabel = document.getElementById('save-btn-label');
    const originalText = saveBtnLabel.innerText;
    saveBtnLabel.innerText = "Saved! ✓";
    
    setTimeout(() => {
        saveBtnLabel.innerText = originalText;
    }, 2000);
}

function toggleHistoryModal() {
    historyModal.classList.toggle('active');
    if (historyModal.classList.contains('active')) {
        renderHistory();
    }
}

function renderHistory() {
    historyTableBody.innerHTML = '';
    
    if (savedHistory.length === 0) {
        historyEmpty.style.display = 'block';
        historyTableContainer.style.display = 'none';
    } else {
        historyEmpty.style.display = 'none';
        historyTableContainer.style.display = 'block';
        
        savedHistory.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.height}</td>
                <td>${record.weight}</td>
                <td style="font-weight: 700;">${record.bmi}</td>
                <td>${record.category}</td>
                <td><button class="history-delete-btn" onclick="deleteHistoryItem(${record.id})">Delete</button></td>
            `;
            historyTableBody.appendChild(row);
        });
    }
}

function deleteHistoryItem(id) {
    savedHistory = savedHistory.filter(record => record.id !== id);
    localStorage.setItem('bmi_history', JSON.stringify(savedHistory));
    renderHistory();
}

function clearAllHistory() {
    if (confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
        savedHistory = [];
        localStorage.removeItem('bmi_history');
        renderHistory();
    }
}

// Close Modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === historyModal) {
        toggleHistoryModal();
    }
});