let strings = [];
let counts = [];
let alphas = [];
let seed = Math.random() * 4294967296;

let syllables = [];
let xPositions = [];
let yPositions = [];

//todo: set up syllables, count them, keep them consistent between lines
//todo: manual positioning of each WORD, not syllable
//todo: 


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
    readParameters(3);
}
init();

function readParameters (index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-max-x");
            maxX = element.value;
            break;
        case 1:
            element = document.getElementById("config-max-y");
            maxY = element.value;
            break;
        case 2:
            element = document.getElementById("config-text-size");
            textSize = element.value;
            break;
        case 3:
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
                counts[i] = inputElems[i].children[j].value;
            else if(inputElems[i].children[j].classList.contains("alpha-input"))
                alphas[i] = inputElems[i].children[j].value; 
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

    for(let i = 0; i < syllables1.length; i++) {
        for(let j = 0; j < syllables1[i].length; j++) {
            if(syllables1[i]) {
                appendToPreview(previewElement, xPositions[i][j], yPositions[i][j], textSize, syllables1[i][j], alphas[0]);
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

function generateLyricString() {
    buildStrings();
    let stillHasWords = true;
    let sylInd = 0;
    let retString = `@<size=${textSize}><align=left><line-height=0><alpha=#` + Number(alphas[0]).toString(16) + '>';
    console.log(syllables1);
    while(stillHasWords) {
        stillHasWords = false;
        for(let i = 0; i < syllables1.length; i++) {
            if(syllables1[i] && sylInd < syllables1[i].length) {
                let xPos = Math.round(xPositions[i][sylInd]);
                let yPos = -1 * Math.round(yPositions[i][sylInd])
                retString += `<pos=${xPos}>`
                        + `<voffset=${yPos}>`
                        + syllables1[i][sylInd].trim();
                if(mode) retString += ' ';
                stillHasWords = true;
            }
        }
        retString += ' ';
        sylInd++;
    }
    navigator.clipboard.writeText(retString);
    console.log(retString);
}

function buildStrings() {
    let rando = Math.seed(seed);
    syllables1 = [];
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

        for(let i = Number(prevP); i < Number(counts[pInd]) + Number(prevP); i++) { //repeat for each count in phrase
            syllables1[i] = [];
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

                syllables1[i][j] = trimSyllable(newSyl);
                xPositions[i][j] = startPos[numNewlines] + accumulatedOffset + Math.cos(randoAngle) * randoDistance * maxX;
                yPositions[i][j] = yPos + Math.sin(randoAngle) * randoDistance * maxY;
                
                accumulatedOffset += getWordWidth(trimSyllable(newSyl), textSize);
                if(newSyl[newSyl.length-1] != '-' && newSyl[newSyl.length-1] != '=') {
                    accumulatedOffset += textSize * 0.3;
                    randoAngle = rando() * 2 * Math.PI;
                    randoDistance = rando();
                }
            }
        }
        prevP += counts[pInd];
    }
}

function rerollSeed() {
    seed = Math.random() * 4294967296;
    generatePreview();
}