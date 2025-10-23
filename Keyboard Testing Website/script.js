// Define the w_stag array for the left keyboard
const a = 2 * ((1 + 0.25 ** 2) ** 0.5);
const b = 2 * ((1 + 0.5 ** 2) ** 0.5);
const c = 2 * ((1 + 0.75 ** 2) ** 0.5);
const d = 2 * ((1 + 1 ** 2) ** 0.5);
const e = 2 * ((1 + 1.25 ** 2) ** 0.5);
const f = 2 * ((1 + 1.5 ** 2) ** 0.5);
const w_stag = [a, a, a, a, c, e, a, a, a, a, 0, 0, 0, 0, 1, 1, 0, 0, 0, b, b, b, b, f, b, b];

// Key order for QWERTY layout (default left keyboard layout)
const qwertyLayoutLeft = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

// Custom layouts
const layout1 = ['C', 'G', 'D', 'Y', 'X', 'Z', 'P', 'U', 'H', 'M', 'E', 'O', 'N', 'T', 'L', 'R', 'S', 'I', 'A', 'W', 'V', 'F', 'Q', 'J', 'K', 'B'];
const layout2 = ['Q', 'W', 'M', 'R', 'Y', 'V', 'U', 'G', 'O', 'P', 'T', 'A', 'N', 'S', 'D', 'F', 'I', 'E', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'B'];
const layout3 = ['Q', 'D', 'Y', 'P', 'U', 'F', 'B', 'K', 'G', 'W', 'T', 'I', 'C', 'O', 'M', 'N', 'A', 'E', 'S', 'X', 'H', 'L', 'Z', 'V', 'J', 'R'];

// Map to store layouts
const layouts = {
    qwerty: qwertyLayoutLeft,
    layout1: layout1,
    layout2: layout2,
    layout3: layout3,
};

// Initialize total distances for left and right keyboards
let totalDistanceLeft = 0;
let totalDistanceRight = 0;

// Set default layout as "qwerty" for left and "qwerty" for right
let currentLayoutLeft = 'qwerty';
let currentLayoutRight = 'qwerty';

// Update the distance display elements
const distanceDisplayLeft = document.getElementById('distance-value-left');
const distanceDisplayRight = document.getElementById('distance-value-right');

// Get all keys in both keyboards
const keysLeft = document.querySelectorAll('#keyboard-left .key');
const keysRight = document.querySelectorAll('#keyboard-right .key');

// Get the text area to display typed characters
const textArea = document.createElement('textarea');
textArea.id = 'typed-text';
textArea.rows = 5;
textArea.cols = 50;
document.body.appendChild(textArea);

// Function to map weights based on layout
function getKeyWeight(key, layout, weights) {
    const layoutKeys = layouts[layout];
    const index = layoutKeys.indexOf(key);
    return index !== -1 ? weights[index] : 0;
}

// Function to update keyboard display based on the current layout
function updateKeyboardDisplay(side, layout) {
    const layoutKeys = layouts[layout];
    const keys = side === 'left' ? keysLeft : keysRight;

    keys.forEach((keyElement, index) => {
        keyElement.textContent = layoutKeys[index];
        // Update data-key attribute for right keyboard only
        if (side === 'right') {
            keyElement.setAttribute('data-key', `Key${layoutKeys[index]}`);
        }
    });
}

// Function to calculate distance for left keyboard
function highlightKeyLeft(event) {
    // Check if the space key is pressed
    if (event.code === 'Space') {
        totalDistanceLeft += 0; // Assign a weight of 1 for the space key
        distanceDisplayLeft.textContent = totalDistanceLeft.toFixed(2); // Update display
        textArea.value += ' '; // Append a space to the textarea
    } else {
        const keyElement = document.querySelector(`#keyboard-left .key[data-key="${event.code}"]`);
        if (keyElement) {
            const key = keyElement.textContent.toUpperCase(); // Convert to uppercase
            const weight = getKeyWeight(key, currentLayoutLeft, w_stag);
            totalDistanceLeft += weight; // Add corresponding weight
            distanceDisplayLeft.textContent = totalDistanceLeft.toFixed(2); // Update display
            keyElement.classList.add('active');
            textArea.value += key; // Append the key (in uppercase) to the textarea
        }
    }
}

// Function to calculate distance for right keyboard
function highlightKeyRight(event) {
    // Check if the space key is pressed
    if (event.code === 'Space') {
        totalDistanceRight += 0; // Assign a weight of 1 for the space key
        distanceDisplayRight.textContent = totalDistanceRight.toFixed(2); // Update display
        textArea.value += ''; // Append a space to the textarea
    } else {
        const keyElement = document.querySelector(`#keyboard-right .key[data-key="${event.code}"]`);
        if (keyElement) {
            const key = keyElement.textContent.toUpperCase(); // Convert to uppercase
            const weight = getKeyWeight(key, currentLayoutRight, w_stag);
            totalDistanceRight += weight; // Add corresponding weight
            distanceDisplayRight.textContent = totalDistanceRight.toFixed(2); // Update display
            keyElement.classList.add('active');
        }
    }
}



// Function to remove highlight after key release
function removeHighlight(event) {
    const keyElementLeft = document.querySelector(`#keyboard-left .key[data-key="${event.code}"]`);
    const keyElementRight = document.querySelector(`#keyboard-right .key[data-key="${event.code}"]`);
    
    if (keyElementLeft) keyElementLeft.classList.remove('active');
    if (keyElementRight) keyElementRight.classList.remove('active');
}

// Event listeners for key press and release
window.addEventListener('keydown', highlightKeyLeft);
window.addEventListener('keydown', highlightKeyRight);
window.addEventListener('keyup', removeHighlight);

// Handle layout selection change for the right keyboard
const layoutSelect = document.getElementById('layout-select');
layoutSelect.addEventListener('change', function() {
    currentLayoutRight = this.value;
    totalDistanceRight = 0; // Reset right keyboard distance
    totalDistanceLeft = 0; // Reset left keyboard distance
    distanceDisplayRight.textContent = totalDistanceRight.toFixed(2); // Reset display
    distanceDisplayLeft.textContent = totalDistanceLeft.toFixed(2); // Reset left display
    textArea.value = ''; // Clear textarea
    updateKeyboardDisplay('right', currentLayoutRight); // Update right keyboard layout
    alert(`Selected layout: ${this.value}`);
});

// Initially set the left and right keyboards to their default layouts
updateKeyboardDisplay('left', 'qwerty');
updateKeyboardDisplay('right', 'qwerty');
