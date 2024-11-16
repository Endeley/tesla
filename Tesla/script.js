const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');

const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');

const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDriving = document.querySelector('#full-self-driving-checkbox');
const accessories = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Gray';
const selectedOptions = {
    'Performance Wheels': false,
    'Performance Package': false,
    'Full Self-Driving': false,
};

const pricing = {
    'Performance Wheels': 2500,
    'Performance Package': 5000,
    'Full Self-Driving': 8500,
    Accessories: {
        'Center Console Trays': 35,
        'All-Weather Interior Liners': 25,
        Sunshade: 105,
    },
};

// updateTotalPrice in the UI

const updateTotalPrice = () => {
    // Reset the current price to base price
    currentPrice = basePrice;
    // performance wheels option
    if (selectedOptions['Performance Wheels']) {
        currentPrice += pricing['Performance Wheels'];
    }

    // performance package option
    if (selectedOptions['Performance Package']) {
        currentPrice += pricing['Performance Package'];
    }

    //self driving mode option
    if (selectedOptions['Full Self-Driving']) {
        currentPrice += pricing['Full Self-Driving'];
    }

    // Accessories checkboxes
    accessories.forEach((checkbox) => {
        const accessoryLabel = checkbox.closest('label').querySelector('span').textContent.trim();

        const accessoryPrice = pricing['Accessories'][accessoryLabel];
        if (checkbox.checked) {
            currentPrice += accessoryPrice;
        }
    });

    // update the total price in the UI
    totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;
    updatePaymentBreakdown();
};

// update payment breakdown based on current price

const updatePaymentBreakdown = () => {
    const downPayment = currentPrice * 0.1;
    downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

    // Calculate Loan Details by (Assumning loan is 60months and 3% interest rate)

    const loanTermMonths = 60; // Loan term in months
    const annualInterestRate = 0.03; // Annual interest rate in percent
    const loanAmount = currentPrice - downPayment;

    // Monthly payment formula: p*(r(1+r)^n) / ((1+r)^n-1)

    const monthlyInterestRate = annualInterestRate / 12;

    const monthlyPayment = (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths))) / Math.pow(1 + monthlyInterestRate, loanTermMonths - 1);
    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
};

// Handle top scroll bar
const handleScrollBar = () => {
    const atTop = window.scrollY === 0;
    topBar.classList.toggle('visible-bar', atTop);
    topBar.classList.toggle('hidden-bar', !atTop);
};

// image mapping
// exterior images
const exteriorImages = {
    'Stealth Gray': './images/model-y-stealth-grey.jpg',
    'Pearl White': './images/model-y-pearl-white.jpg',
    'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
    'Solid Black': './images/model-y-solid-black.jpg',
    'Ultra Red': './images/model-y-ultra-red.jpg',
    Quicksilver: './images/model-y-quicksilver.jpg',
};

// interior images

const interiorImages = {
    Dark: './images/model-y-interior-dark.jpg',
    Light: './images/model-y-interior-light.jpg',
};

// Color Selection

const handleColorButtonClick = (e) => {
    let button;
    if (e.target.tagName === 'IMG') {
        button = e.target.closest('button');
    } else if (e.target.tagName === 'BUTTON') {
        button = e.target;
    }

    if (button) {
        const buttons = e.currentTarget.querySelectorAll('button');
        buttons.forEach((button) => button.classList.remove('btn-selected'));
        button.classList.add('btn-selected');
    }
    // Change exterior image colors
    if (e.currentTarget === exteriorColorSection) {
        selectedColor = button.querySelector('img').alt;

        updateExteriorImage();
    }

    // Change interior image colors
    if (e.currentTarget === interiorColorSection) {
        const color = button.querySelector('img').alt;
        interiorImage.src = interiorImages[color];
    }
};

//

const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
    const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Gray';
    exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
};

// wheel selection
const handleWheelButtonClick = (e) => {
    if (e.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('#wheel-buttons button');
        buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

        // add style class to the button
        e.target.classList.add('bg-gray-700', 'text-white');
        //
        selectedOptions['Performance Wheels'] = e.target.textContent.includes('Performance');
        updateExteriorImage();
        updateTotalPrice();
    }
};

// performance package selections
const handlePerformanceButtonClick = () => {
    const isSelected = performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    selectedOptions['Performance Package'] = isSelected;
    updateTotalPrice();
};

const fullSelfDrivingMode = () => {
    const isSelected = fullSelfDriving.checked;

    selectedOptions['Full Self-Driving'] = isSelected;
    updateTotalPrice();
};

// handle accessories

accessories.forEach((checkbox) => {
    checkbox.addEventListener('change', () => updateTotalPrice());
});

// Initial update Total Price
updateTotalPrice();

// Event Listerners
window.addEventListener('scroll', () => requestAnimationFrame(handleScrollBar));
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick);
fullSelfDriving.addEventListener('change', fullSelfDrivingMode);

//
// Select all image elements within the #exterior-buttons container
