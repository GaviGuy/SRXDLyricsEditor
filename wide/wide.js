const defaultTextSize = 10;
const defaultVerticalGap = 12;
const defaultXOffset = 0;
const defaultYOffset = 0;

let textSize = defaultTextSize;
let verticalGap = defaultVerticalGap;
let xOffset = defaultXOffset;
let yOffset = defaultYOffset;

let startPos = [];
let newlinesCount = 0;

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
            element = document.getElementById("config-text-size");
            textSize = Number(element.value);
            break;
        case 1:
            element = document.getElementById("config-vertical-spacing");
            verticalGap = Number(element.value);
            break;
        case 2:
            element = document.getElementById("config-x-offset");
            xOffset = Number(element.value);
            break;
        case 3:
            element = document.getElementById("config-y-offset");
            yOffset = Number(element.value);
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
            element = document.getElementById("config-x-offset");
            element.value = defaultXOffset;
            xOffset = defaultXOffset;
            break;
        case 3:
            element = document.getElementById("config-y-offset");
            element.value = defaultYOffset;
            yOffset = defaultYOffset;
            break;
    }
    generatePreview();
}

function generatePreview () {
    let previewElement = document.getElementById("preview");
    clearPreview(previewElement);

    let str = document.getElementById("input").value;
    let syl = convertStringToSyllables(str);

    // let x = [],
    //     y = [],
    //     s = [],
    //     t = [],
    //     a = [];
    // let buildInd = 0;
    
    str = "";
    startPos = [0];
    newlinesCount = 0;
    for(let i = 0; i < syl.length; i++) {
        if(syl[i] != "\\n") {
            str += trimSyllable(syl[i]);
        }
        if(syl[i] == "\\n" || i == syl.length - 1) {
            startPos[newlinesCount] = getWordWidth(str, textSize);
            str = "";
            newlinesCount++;
        }
    }
    for (let i = 0; i < startPos.length; i++) {
        startPos[i] = 80 + Number(xOffset) - startPos[i] / 2;
    }

    let numNewlines = 0;
    let aOffset = 0;
    for(let i = 0; i < syl.length; i++) {
        while(syl[i] == "\\n") {
            numNewlines++;
            i++
            aOffset = 0;
        }
        let xPos = Number(startPos[numNewlines]) + aOffset;
        let yPos = Number(verticalGap * (numNewlines - newlinesCount / 2));
        appendToPreview(previewElement, xPos, 30 + yPos + yOffset, textSize, trimSyllable(syl[i]), 255);
        
        // x[buildInd] = Math.round(xPos);
        // y[buildInd] = Math.round(30 + yPos + yOffset);
        // s[buildInd] = Number(textSize);
        // t[buildInd] = trimSyllable(syl[i]);
        // a[buildInd] = Number(255);
        // buildInd++;

        aOffset += getWordWidth(trimSyllable(syl[i]), textSize);
        if(syl[i][syl[i].length-1] != '-') {
            aOffset += textSize * 0.2;
        }
    }
    
    // console.log(x);
    // console.log(y);
    // console.log(s);
    // console.log(t);
    // console.log(a);
}

function generateLyricString() {
    let str = document.getElementById("input").value;
    let syl = convertStringToSyllables(str);

    let numNewlines = 0;
    let aOffset = 0;
    let retString = `@<size=${textSize}><align=left><line-height=0>`
            + `<voffset=${Math.round(verticalGap * (newlinesCount / 2))}><pos=${startPos[numNewlines]}>`;

    for(let i = 0; i < syl.length; i++) {
        while(syl[i] == "\\n") {
            numNewlines++;
            i++;
            retString += `<voffset=${Math.round(verticalGap * -(numNewlines - (newlinesCount / 2)))}>`
                    + `<pos=${Math.round(startPos[numNewlines])}>`;
            aOffset = 0;
        }
        let wordWidth = getWordWidth(trimSyllable(syl[i]), textSize);
        console.log("numNewlines: " + numNewlines + ", startPos: " + startPos[numNewlines]);

        let pos = startPos[numNewlines] + wordWidth + aOffset + textSize;
        if(pos > 160 || startPos[numNewlines] < -160) {
            for(let j = 0; j < syl[i].length; j++) {
                switch(syl[i][j]) {
                    case '-':
                        if(j == syl[i].length-1) {
                            retString += syl[i][j];
                            break;
                        }
                    case '=':
                        if(j == syl[i].length-1) {
                            retString += `<pos=${Math.round(startPos[numNewlines] + aOffset)}>${syl[i][j]}`;
                            aOffset += getWordWidth('-', textSize);
                            break;
                        }
                    default:
                        retString += `<pos=${Math.round(startPos[numNewlines] + aOffset)}>${syl[i][j]}`
                        aOffset += getWordWidth(syl[i][j], textSize);
                }
                if(j == syl[i].length - 1 && syl[i][j] != '-' && syl[i][j] != '=')
                    aOffset += 0.2 * textSize;
            }
            retString += ' ';
        }
        else {
            aOffset += wordWidth;
            if(syl[i][syl[i].length - 1] != '-') {
                aOffset += 0.2 * textSize;
            }
            retString += syl[i] + ' ';
        }
    }
    retString = retString.trim();
    retString += `<voffset=${-verticalGap * newlinesCount / 2 - yOffset}><alpha=#00>.`
    
    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);
}