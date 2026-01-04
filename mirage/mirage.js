let strings = [];
let counts = [];
let alphas = [];
let spreads = [];
let seed = 0;

let syllables = [];
let xPositions = [];
let yPositions = [];
//2D arrays: array[phrase][syllable]
//eg. array[0] and array[1] might both originate from the same input, if its count is 2

const defaultMaxX = 5;
const defaultMaxY = 5;
const defaultTextSize = 10;
const defaultAlpha = 255;
const defaultCount = 2;

const spreadTypes = ["none", "linear", "circumference", "area"];
const spreadDescs = [
    "text will be perfectly centered",
    "text will be spread linearly from (-x, -y) to (x, y)",
    "text will be spread evenly along the outer circumference of the given range",
    "text will be spread randomly within the range given by x and y"];

let maxX = defaultMaxX;
let maxY = defaultMaxY;
let textSize = defaultTextSize;
let mode = 0;


async function init() {
    addSourceContainer();
    readParameters(0);
    readParameters(1);
    readParameters(2);
    readParameters(4);
    let seed = document.getElementById("config-seed");
    if (seed.value == 0) revertConfig(3);
    else readParameters(3);
}
init();

function readParameters (index) {
    let element, val;
    switch(index) {
        case 0:
            element = document.getElementById("config-max-x");
            val = validateNumber(element.value);
            if(val == val) maxX = val;
            element.value = maxX;
            break;
        case 1:
            element = document.getElementById("config-max-y");
            val = validateNumber(element.value);
            if(val == val) maxY = val;
            element.value = maxY;
            break;
        case 2:
            element = document.getElementById("config-text-size");
            val = validateNumber(element.value, 0);
            if(val == val) textSize = val;
            element.value = textSize;
            break;
        case 3:
            element = document.getElementById("config-seed");
            seed = element.value;
            break;
        case 4:
            element = document.getElementById("config-gradual-mode");
            mode = element.checked;
            break;
    }
    generatePreview();
}

function revertConfig(index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-max-x");
            element.value = defaultMaxX;
            maxX = defaultMaxX;
            break;
        case 1:
            element = document.getElementById("config-max-y");
            element.value = defaultMaxY;
            maxY = defaultMaxY;
            break;
        case 2:
            element = document.getElementById("config-text-size");
            element.value = defaultTextSize;
            textSize = defaultTextSize;
            break;
        case 3:
            element = document.getElementById("config-seed");
            seed = Math.round(Math.random() * 4294967296);
            element.value = seed;
            break;
    }
    generatePreview();
}

function addSourceContainer() {
    let container = document.getElementById("source-container");
    
    let newElem = container.appendChild(document.createElement("div"));
    newElem.setAttribute("class", "phrase");

    let newText = newElem.appendChild(document.createElement("textarea"));
    newText.cols=80;
    newText.title="Phrase input area";
    newText.setAttribute("onchange", "generatePreview()");
    newText.setAttribute("class", "phrase-input");

    newElem.appendChild(document.createElement("br"));

    let newLabel = newElem.appendChild(document.createElement("label"));
    newLabel.classList.add("phrase-config");
    newLabel.setAttribute("for", "count-input");
    newLabel.textContent = "Count";

    let newCount = newElem.appendChild(document.createElement("input"));
    newCount.type = "number";
    newCount.setAttribute("onchange", "generatePreview()");
    newCount.setAttribute("min", "0");
    newCount.value = 2;
    newCount.classList.add("config");
    newCount.classList.add("count-input");

    newLabel = newElem.appendChild(document.createElement("label"));
    newLabel.classList.add("phrase-config");
    newLabel.setAttribute("for", "alpha-input");
    newLabel.textContent = "Opacity";

    let newAlpha = newElem.appendChild(document.createElement("input"));
    newAlpha.type = "number";
    newAlpha.setAttribute("onchange", "generatePreview()");
    newAlpha.setAttribute("min", "0");
    newAlpha.setAttribute("max", "255");
    newAlpha.value = 128;
    newAlpha.classList.add("config");
    newAlpha.classList.add("alpha-input");

    newLabel = newElem.appendChild(document.createElement("label"));
    newLabel.classList.add("phrase-config");
    newLabel.setAttribute("for", "spread-input");
    newLabel.textContent = "Spread";

    let newDrop = newElem.appendChild(document.createElement("select"));
    newDrop.setAttribute("onchange", "updateTooltips()");
    newDrop.classList.add("spread-dropdown");
    newDrop.setAttribute("title", spreadDescs[3]);

    for(let i in spreadTypes) {
        let opt = newDrop.appendChild(document.createElement("option"));
        opt.setAttribute("value", i);
        opt.innerText = spreadTypes[i];
        opt.setAttribute("title", spreadDescs[i]);
        if(i == 3) opt.setAttribute("selected", true);
    }

    // let newCheck = newElem.appendChild(document.createElement("input"));
    // newCheck.type = "checkbox";
    // newCheck.setAttribute("onchange", "generatePreview()");
    // newCheck.checked = true;
    // newCheck.classList.add("spread-input");

    readPhrases();
}

function readPhrases() {
    let inputElems = document.getElementById("source-container").children;
    strings = [];
    spreads = [];
    let newAlphas = [], newCounts = [];
    for(let i = 0; i < inputElems.length; i++) {
        for(let j = 0; j < inputElems[i].children.length; j++) {
            let val = inputElems[i].children[j].value;
            if(inputElems[i].children[j].classList.contains("phrase-input"))
                strings[i] = val;
            else if(inputElems[i].children[j].classList.contains("count-input")) {
                val = validateNumber(val, 0);
                if(val == val) {
                    newCounts[i] = val;
                    inputElems[i].children[j].value = val;
                }
                else inputElems[i].children[j].value = counts[i];
            }
            else if(inputElems[i].children[j].classList.contains("alpha-input")) {
                val = validateNumber(val, 0, 255);
                if(val == val) {
                    newAlphas[i] = val;
                    inputElems[i].children[j].value = val;
                }
                else inputElems[i].children[j].value = alphas[i];
            }
            else if(inputElems[i].children[j].classList.contains("spread-dropdown"))
                spreads[i] = Number(inputElems[i].children[j].value);
        }
    }
    counts = newCounts;
    alphas = newAlphas;
}

function generatePreview () {
    let previewElement = document.getElementById("preview");
    readPhrases();
    buildStrings();
    clearPreview(previewElement);

    for(let i = 0; i < syllables.length; i++) {
        for(let j = 0; j < syllables[i].length; j++) {
            if(syllables[i]) {
                appendToPreview(previewElement, xPositions[i][j], yPositions[i][j] + 24, textSize, syllables[i][j], getAlphaByIndex(i));
            }
        }
    }
}

function updateTooltips () {
    let inputElems = document.getElementById("source-container").children;
    for(let i in inputElems) {
        if(typeof inputElems[i] == "object") {
            let selectElem = inputElems[i].querySelector(".spread-dropdown");
            let selectChildren = selectElem.children;
            selectElem.setAttribute("title", selectChildren[selectElem.value].title);
        }
    }
    generatePreview();
}

function getAlphaByIndex (index) {
    let count = 0;
    while(count < counts.length) {
        if(index < counts[count]) return alphas[count];
        else {
            index -= counts[count];
            count++;
        }
    }
    console.error("getAlphaByIndex() failed");
}

function generateLyricString() {
    buildStrings();
    let stillHasWords = true;
    let sylInd = 0;
    let prevAlpha = alphas[0].toString(16).toUpperCase();
    if(alphas[0] < 16) prevAlpha = '0' + prevAlpha;
    let retString = `@<size=${textSize}><align=left><line-height=0><alpha=#${prevAlpha}>`;
    while(stillHasWords) {
        stillHasWords = false;
        for(let i = 0; i < syllables.length; i++) {
            if(syllables[i] && sylInd < syllables[i].length) {
                let xPos = Math.round(xPositions[i][sylInd]);
                let yPos = -1 * Math.round(yPositions[i][sylInd])

                let alpha = getAlphaByIndex(i);
                if(alpha < 16) alpha = '0' + alpha.toString(16).toUpperCase();
                else alpha = alpha.toString(16).toUpperCase();

                if(alpha != prevAlpha) retString += `<alpha=#${alpha}>`;
                prevAlpha = alpha;

                retString += `<pos=${xPos}>`
                        + `<voffset=${yPos}>`
                        + syllables[i][sylInd].trim();
                if(mode) retString += ' ';
                stillHasWords = true;
            }
        }
        if(!mode) retString += ' ';
        sylInd++;
    }
    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);
}

function buildStrings() {
    let rando = Math.seed(seed);
    if(seed != 0 && !Number(seed)) {
        let hash = 0;
        for(let i = 0; i < seed.length; i++) {
            hash += seed.charCodeAt(i)
            hash *= 7;
        }
        rando = Math.seed(hash);
    }
    syllables = [];
    xPositions = [];
    yPositions = [];

    let prevP = 0;
    for(let pInd = 0; pInd < strings.length; pInd++) { //for each phrase
        let startPos = [];
        let syl = convertStringToSyllables(strings[pInd]);
        for(let i = 0, sylInd = 0; sylInd < syl.length; i++) { //calculate start positions for each line
            let lineLength = 0;
            let lineStr = "";
            while(sylInd < syl.length && syl[sylInd] != "\\n") {
                lineStr += trimSyllable(syl[sylInd]);
                sylInd++;
            }
            sylInd++;
            lineLength = getWordWidth(lineStr, textSize);
            startPos[i] = 80 - lineLength / 2;
        }

        let randomStart = rando();
        for(let i = prevP; i < Number(counts[pInd]) + prevP; i++) { //repeat for each count in phrase
            syllables[i] = [];
            xPositions[i] = [];
            yPositions[i] = [];

            let yPos = 0;

            let accumulatedOffset = 0;
            let numNewlines = 0;
            for(let j = 0; j + numNewlines < syl.length; j++) { //for each syllable in phrase
                while(syl[j + numNewlines] == "\\n") {
                    numNewlines++;
                    yPos += textSize * 1.2;
                    accumulatedOffset = 0;
                }

                let newSyl = syl[j + numNewlines]

                syllables[i][j] = trimSyllable(newSyl);
                xPositions[i][j] = startPos[numNewlines] + accumulatedOffset
                yPositions[i][j] = yPos;

                switch(spreads[pInd]) {
                    case 0:
                        // no spread
                        break;
                    case 1:
                        // linear spread
                        if(Number(counts[pInd]) < 2) break;
                        let progress = (i-prevP) / Number(counts[pInd] - 1);
                        xPositions[i][j] += -maxX + maxX * 2 * progress;
                        yPositions[i][j] += -maxY + maxY * 2 * progress;
                        break;
                    case 2:
                        // circumference spread
                        let angle = randomStart * 2 * Math.PI;
                        angle += 2 * Math.PI / Number(counts[pInd]) * (i - prevP);
                        xPositions[i][j] += Math.cos(angle) * maxX;
                        yPositions[i][j] += Math.sin(angle) * maxY;
                        break;
                    case 3:
                        // area spread
                        let randoDistance = rando();
                        let randoAngle = rando() * 2 * Math.PI;
                        xPositions[i][j] += Math.cos(randoAngle) * randoDistance * maxX;
                        yPositions[i][j] += Math.sin(randoAngle) * randoDistance * maxY;
                        break;
                    default:
                        console.warn("unknown spread mode: " + spreads[pInd]);
                }
                
                accumulatedOffset += getWordWidth(trimSyllable(newSyl), textSize);
                if(newSyl[newSyl.length-1] != '-' && newSyl[newSyl.length-1] != '=') {
                    accumulatedOffset += textSize * 0.25;
                    randoAngle = rando() * 2 * Math.PI;
                    randoDistance = rando();
                }
            }
        }
        prevP += counts[pInd];
    }
}