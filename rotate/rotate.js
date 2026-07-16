const defaultTextSize = 10;
const defaultVerticalGap = 12;
const defaultMode = 1;
const defaultStartAngle = -30;
const defaultEndAngle = 30;

let textSize = defaultTextSize;
let verticalGap = defaultVerticalGap;
let mode = 1;
let startAngle = defaultStartAngle;
let endAngle = defaultEndAngle;

const parameterList = [
    "config-text-size", "config-vertical-spacing", "config-rotate-all", "config-rotate-start", "config-rotate-end"
]

let syllables = [];

async function init() {
    handleModeDropdown();
}
init();

function handleModeDropdown() {
    let drop = document.getElementById("config-rotation-mode");
    let config = document.getElementById("config");
    switch(drop.selectedIndex) {
        case 0:
        case 1:
            config.setAttribute("mode", "single");
            readParameters(2);
            break;
        case 2:
        case 3:
            config.setAttribute("mode", "double");
            readParameters(3);
            readParameters(4);
            break;
        default:
            console.error("dropdown returned an out of bounds index: " + drop.selectedIndex);
    }
    let tooltip = drop.children[drop.selectedIndex].title;
    drop.title = tooltip;

    generatePreview();
}

function readParameters(index) {
    let element = document.getElementById(parameterList[index]);
    let val;
    switch(index) {
        case 0:
            val = validateNumber(element.value, 0);
            if(val == val) textSize = val;
            element.value = textSize;
            break;
        case 1:
            val = validateNumber(element.value);
            if(val == val) verticalGap = val;
            element.value = verticalGap;
            break;
        case 2:
        case 3:
            val = validateNumber(element.value);
            if(val == val) startAngle = val;
            element.value = startAngle;
            break;
        case 4:
            val = validateNumber(element.value);
            if(val == val) endAngle = val;
            element.value = endAngle;
            break;
    }

    generatePreview();
}

function revertConfig(index) {
    let element = document.getElementById(parameterList[index]);
    let val;
    switch(index) {
        case 0:
            textSize = defaultTextSize;
            element.value = defaultTextSize;
            break;
        case 1:
            verticalGap = defaultVerticalGap;
            element.value = defaultVerticalGap;
            break;
        case 2:
        case 3:
            startAngle = defaultStartAngle;
            element.value = defaultStartAngle;
            break;
        case 4:
            endAngle = defaultEndAngle;
            element.value = defaultEndAngle;
            break;
    }
    
    generatePreview();
}

function generatePreview() {

}

function generateLyricString() {

}