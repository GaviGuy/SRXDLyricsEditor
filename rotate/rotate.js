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
    mode = drop.selectedIndex;
    switch(mode) {
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
    let stringIn = document.getElementById("input").value;
    syllables = [];
    switch(mode) {
        case 0: // horizontal, rotate characters only
            break;
        case 1: // rotate word and position
            break;
        case 2: // horizontal, gradual character rotation
            break;
        case 3: // gradually rotate word and position
            break;
        default:
            console.warn("what.");
    }

}

function generateLyricString() {
    let stringIn = document.getElementById("input").value;
    let retString = `@<size=${textSize}>`;

    console.warn(mode);
    if(mode == 0 || mode == 2 && startAngle == endAngle) {
        // don't use syllables, no need for <pos> or <voffset>
        if(startAngle % 360 != 0) retString += `<rotate=${startAngle % 360}>`;
        retString += stringIn.replace(/ *\\n */, "\n");
    }
    else if(mode == 2) {
        // don't use syllables, no need for <pos> or <voffset>
        // (but you do need to rerotate often)
        
        // lazy approach first, char by char
        //todo: consider going by char spacing instead of char number
        //todo: treat newlines differently? automatic line breaks?
        //todo: optimize? do I really need to <rotate> every character?
        for(let i = 0; i < stringIn.length; i++) {
            if(stringIn.charAt(i) == " ") {
                retString += stringIn.charAt(i);
                continue;
            }
            if(i < stringIn.length - 2 && stringIn.charAt(i) == "\\" && stringIn.charAt(i+1) == "n") {
                retString += "\n";
                i++;
                continue;
            }
            if(i < stringIn.length - 2 && stringIn.charAt(i) == "-" && stringIn.charAt(i+1) == " ") {
                retString += "-";
                continue;
            }
            if(i < stringIn.length - 2 && stringIn.charAt(i) == "=" && stringIn.charAt(i+1) == " ") {
                retString += "=";
                continue;
            }
            
            let rot = Math.round(i / (stringIn.length - 1) * (endAngle - startAngle) + startAngle);
            retString += `<rotate=${rot}>${stringIn.charAt(i)}`;
        }
    }
    else {
        // use syllables
    }
    retString = retString.replace(/ *\n */, "\n")
    navigator.clipboard.writeText(retString);
    console.log(retString);
}