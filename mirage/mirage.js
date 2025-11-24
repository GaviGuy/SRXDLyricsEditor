let strings = [];
let counts = [];
let alphas = [];
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

let maxX = defaultMaxX;
let maxY = defaultMaxY;
let textSize = defaultTextSize;
let mode = 0;


async function init() {
    readParameters(0);
    readParameters(1);
    readParameters(2);
    readParameters(4);
    revertConfig(3);
}
init();

function readParameters (index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-max-x");
            maxX = Number(element.value);
            break;
        case 1:
            element = document.getElementById("config-max-y");
            maxY = Number(element.value);
            break;
        case 2:
            element = document.getElementById("config-text-size");
            textSize = Number(element.value);
            break;
        case 3:
            element = document.getElementById("config-seed");
            seed = Number(element.value);
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
            maxM = defaultMaxX;
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

    let newCount = newElem.appendChild(document.createElement("input"));
    newCount.type = "number";
    newCount.setAttribute("onchange", "generatePreview()");
    newCount.value = 2;
    newCount.textContent = "Count";
    newCount.setAttribute("class", "count-input");

    let newAlpha = newElem.appendChild(document.createElement("input"));
    newAlpha.type = "number";
    newAlpha.setAttribute("onchange", "generatePreview()");
    newAlpha.value = 128;
    newAlpha.textContent = "Alpha";
    newAlpha.setAttribute("class", "alpha-input");
}

function readPhrases() {
    let inputElems = document.getElementById("source-container").children;
    strings = [];
    counts = [];
    alphas = [];
    for(let i = 0; i < inputElems.length; i++) {
        for(let j = 0; j < inputElems[i].children.length; j++) {
            if(inputElems[i].children[j].classList.contains("phrase-input"))
                strings[i] = inputElems[i].children[j].value;
            else if(inputElems[i].children[j].classList.contains("count-input"))
                counts[i] = Number(inputElems[i].children[j].value);
            else if(inputElems[i].children[j].classList.contains("alpha-input"))
                alphas[i] = Number(inputElems[i].children[j].value); 
        }
    }
}

function generatePreview () {
    let previewElement = document.getElementById("preview");
    readPhrases();
    buildStrings();
    clearPreview(previewElement);

    // let x = [],
    //     y = [],
    //     s = [],
    //     t = [],
    //     a = [];
    // let ind = 0;

    for(let i = 0; i < syllables.length; i++) {
        for(let j = 0; j < syllables[i].length; j++) {
            if(syllables[i]) {
                appendToPreview(previewElement, xPositions[i][j], yPositions[i][j], textSize, syllables[i][j], getAlphaByIndex(i));
                // x[ind] = Math.round(xPositions[i][j]);
                // y[ind] = Math.round(yPositions[i][j]);
                // s[ind] = Number(textSize);
                // t[ind] = syllables[i][j];
                // a[ind] = Number(alphas[0]);
                // ind++;
            }
        }
    }
    // console.log(x);
    // console.log(y);
    // console.log(s);
    // console.log(t);
    // console.log(a);
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
    console.log("error");
}

function generateLyricString() {
    buildStrings();
    let stillHasWords = true;
    let sylInd = 0;
    let prevAlpha = alphas[0].toString(16);
    let alphaExtra = "";
    if(prevAlpha < 16) alphaExtra = '0';
    let retString = `@<size=${textSize}><align=left><line-height=0><alpha=#${alphaExtra}${prevAlpha}>`;
    while(stillHasWords) {
        stillHasWords = false;
        for(let i = 0; i < syllables.length; i++) {
            if(syllables[i] && sylInd < syllables[i].length) {
                let xPos = Math.round(xPositions[i][sylInd]);
                let yPos = -1 * Math.round(yPositions[i][sylInd])

                let alpha = getAlphaByIndex(i).toString(16);
                if(alpha < 16) alphaExtra = '0';
                else alphaExtra = "";

                if(alpha != prevAlpha) retString += `<alpha=#${alphaExtra}${alpha}>`;
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

        for(let i = prevP; i < Number(counts[pInd]) + prevP; i++) { //repeat for each count in phrase
            syllables[i] = [];
            xPositions[i] = [];
            yPositions[i] = [];

            let yPos = 0;

            let accumulatedOffset = 0;
            let numNewlines = 0;

            let randoAngle = rando() * 2 * Math.PI;
            let randoDistance = rando();
            for(let j = 0; j + numNewlines < syl.length; j++) { //for each syllable in phrase
                while(syl[j + numNewlines] == "\\n") {
                    numNewlines++;
                    yPos += textSize * 1.2;
                    accumulatedOffset = 0;
                }

                let newSyl = syl[j + numNewlines]

                syllables[i][j] = trimSyllable(newSyl);
                xPositions[i][j] = startPos[numNewlines] + accumulatedOffset + Math.cos(randoAngle) * randoDistance * maxX;
                yPositions[i][j] = yPos + Math.sin(randoAngle) * randoDistance * maxY;
                
                accumulatedOffset += getWordWidth(trimSyllable(newSyl), textSize);
                if(newSyl[newSyl.length-1] != '-' && newSyl[newSyl.length-1] != '=') {
                    accumulatedOffset += textSize * 0.2;
                    randoAngle = rando() * 2 * Math.PI;
                    randoDistance = rando();
                }
            }
        }
        prevP += counts[pInd];
    }
}

// function rerollSeed() {
//     seed = Math.random() * 4294967296;
//     generatePreview();
// }