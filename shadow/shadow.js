const defaultTextSize = 10;
const defaultVerticalGap = 12;
const defaultXOffset = 0;
const defaultYOffset = 0;
const defaultOpacity = 221;
const defaultColor = 0;

let textSize = defaultTextSize;
let verticalGap = defaultVerticalGap;
let xOffset = defaultXOffset;
let yOffset = defaultYOffset;
let opacity = defaultOpacity;
let color = defaultColor;

let startPos = [];
let newlinesCount = 0;

let syllables = [];

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
            element = document.getElementById("config-shadow-x");
            xOffset = Number(element.value);
            break;
        case 3:
            element = document.getElementById("config-shadow-y");
            yOffset = Number(element.value);
            break;
        case 4:
            element = document.getElementById("config-shadow-opacity");
            opacity = Number(element.value);
            break;
        case 5:
            element = document.getElementById("config-shadow-color");
            color = Number(element.value);
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
            element = document.getElementById("config-shadow-x");
            element.value = defaultXOffset;
            xOffset = defaultXOffset;
            break;
        case 3:
            element = document.getElementById("config-shadow-y");
            element.value = defaultYOffset;
            yOffset = defaultYOffset;
            break;
        case 4:
            element = document.getElementById("config-shadow-opacity");
            element.value = defaultOpacity;
            opacity = defaultOpacity;
            break;
        case 5:
            element = document.getElementById("config-shadow-color");
            element.value = defaultColor;
            color = defaultColor;
            break;
    }
    generatePreview();
}

function generatePreview () {
    let previewElement = document.getElementById("preview");
    clearPreview(previewElement);

    let str = document.getElementById("input").value;
    let syl = convertStringToSyllables(str);
    
    str = "";
    startPos = getLineStartingPositions(syl, textSize);

    let numNewlines = 0;
    let aOffset = 0;
    let sInd = 0;
    syllables = [];
    for(let i = 0; i < syl.length; i++) {
        while(syl[i] == "\\n") {
            numNewlines++;
            i++
            aOffset = 0;
        }
        syllables[sInd] = {
            x: Math.round(startPos[numNewlines] + aOffset + xOffset),
            y: Math.round(verticalGap * numNewlines + yOffset),
            s: textSize,
            t: syl[i],
            a: opacity,
            c: color
        }
        appendToPreview2(previewElement, syllables[sInd]);
        sInd++;
        syllables[sInd] = {
            x: Math.round(Number(startPos[numNewlines]) + aOffset),
            y: Math.round(verticalGap * numNewlines),
            t: syl[i],
            s: textSize
        }
        appendToPreview2(previewElement, syllables[sInd]);
        sInd++;

        aOffset += getWordWidth(trimSyllable(syl[i]), textSize);
        if(syl[i][syl[i].length-1] != '-') {
            aOffset += textSize * 0.25;
        }
    }
}

function generateLyricString() {
    let retString = `@<size=${textSize}><align=left><line-height=0>`;

    let prevC = 255;
    let prevA = 255;
    let prevY = 0;
    for(let i = 0; i < syllables.length; i++) {
        if(!(prevC == syllables[i].c && prevA == syllables[i].a)) {
            retString += `<color=${toColorString2(syllables[i].c, syllables[i].a)}>`
        }

        if(!(prevY == syllables[i].y)) {
            retString += `<voffset=${-(syllables[i].y)}>`;
        }

        retString += `<pos=${syllables[i].x}>`
                + syllables[i].t;

        if(i % 2 == 1) {
            retString += ' ';
        }
        prevC = syllables[i].c;
        prevA = syllables[i].a;
        prevY = syllables[i].y;
    }
    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);
}