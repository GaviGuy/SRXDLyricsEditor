const defaultTextSize = 10;
const defaultVerticalGap = 12;
const defaultStartAngle = 45;
const defaultEndAngle = 45;
const defaultSpacingMult = 1;

let textSize = defaultTextSize;
let verticalGap = defaultVerticalGap;
let startAngle = defaultStartAngle;
let endAngle = defaultEndAngle;
let spacingMult = defaultSpacingMult;

let chars = [];
let wordBoundaries = [];


async function init() {
    readParameters(0);
    readParameters(1);
    readParameters(2);
    readParameters(3);
    readParameters(4);
    readParameters(5);
}
init();

function readParameters (index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-text-size");
            textSize = Number(element.value);
            break;
        case 1:
            element = document.getElementById("config-vertical-spacing");
            verticalGap = Number(element.value);
            break;
        case 2:
            element = document.getElementById("config-start-angle");
            startAngle = Number(element.value);
            break;
        case 3:
            element = document.getElementById("config-end-angle");
            endAngle = Number(element.value);
            break;
        case 4:
            element = document.getElementById("config-spacing-multiplier");
            spacingMult = Number(element.value);
            break;
    }
    generatePreview();
}

function revertConfig(index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-text-size");
            element.value = defaultTextSize;
            textSize = defaultTextSize;
            break;
        case 1:
            element = document.getElementById("config-vertical-spacing");
            element.value = defaultVerticalGap;
            verticalGap = defaultVerticalGap;
            break;
        case 2:
            element = document.getElementById("config-start-angle");
            element.value = defaultStartAngle;
            startAngle = defaultStartAngle;
            break;
        case 3:
            element = document.getElementById("config-end-angle");
            element.value = defaultEndAngle;
            endAngle = defaultEndAngle;
            break;
        case 4:
            element = document.getElementById("config-spacing-multiplier");
            element.value = defaultSpacingMult;
            spacingMult = defaultSpacingMult;
            break;
    }
    generatePreview();
}


function generatePreview() {
    let previewElement = document.getElementById("preview");
    clearPreview(previewElement);

    chars = [];
    wordBoundaries = [];

    let str = document.getElementById("input").value;
    let syl = convertStringToSyllables(str);

    let lineLengths = getLineLengths(syl, textSize);

    let nNewlines = 0;
    let aOffset = 0;
    let charInd = 0;
    let charsSinceLastSpace = 0;

    let c = Math.cos(2 * Math.PI * startAngle / 360);
    let s = Math.sin(2 * Math.PI * startAngle / 360);


    for(let i = 0; i < syl.length; i++) {
        if(syl[i] == "\\n") {
            nNewlines++;
            aOffset = 0;
            continue;
        }
        let word = trimSyllable(syl[i]).trim();
        for(let j = 0; j < word.length; j++) {
            chars [charInd] = {
                x: 80 + (10 * c * (lineLengths[nNewlines] / -2 + aOffset) + s * nNewlines * verticalGap) / 10,
                y: 0 + (10 * s * (lineLengths[nNewlines] / -2 + aOffset) + c * nNewlines * verticalGap) / 10,
                s: textSize,
                t: word[j],
                r: startAngle
            };
            aOffset += getWordWidth(word[j]);
            appendToPreview2(previewElement, chars[charInd])
            charInd++;
            charsSinceLastSpace++;
        }
        if(syl[i][syl[i].length-1] != '-') {
            aOffset += 0.3 * textSize;
            wordBoundaries.push(charsSinceLastSpace);
            charsSinceLastSpace = 0;
        }
    }
}

function generateLyricString() {
    let retString = `@<size=${textSize}><align=left><line-height=0><rotate="${-startAngle}">`;
    let wordLength = 0;
    let wordInd = 0;
    for(let i = 0; i < chars.length; i++) {
        retString += `<pos=${chars[i].x}>`
                + `<voffset=${-chars[i].y}>`
                + chars[i].t;
        wordLength++;
        if(wordLength >= wordBoundaries[wordInd]) {
            wordInd++;
            wordLength = 0;
            retString += ' ';
        }
    }
    navigator.clipboard.writeText(retString);
    console.log(retString);
}