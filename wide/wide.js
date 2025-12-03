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

let syllables = [];

async function init() {
    readParameters(0);
    readParameters(1);
    readParameters(2);
    readParameters(3);
}
init();

function readParameters (index) {
    let element, val;
    switch(index) {
        case 0:
            element = document.getElementById("config-text-size");
            val = validateNumber(element.value, 0);
            if(val == val) textSize = val;
            element.value = textSize;
            break;
        case 1:
            element = document.getElementById("config-vertical-spacing");
            val = validateNumber(element.value);
            if(val == val) verticalGap = val;
            element.value = verticalGap;
            break;
        case 2:
            element = document.getElementById("config-x-offset");
            val = validateNumber(element.value);
            if(val == val) xOffset = val;
            element.value = xOffset;
            break;
        case 3:
            element = document.getElementById("config-y-offset");
            val = validateNumber(element.value);
            if(val == val) yOffset = val;
            element.value = yOffset;
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
    syllables = [];
    
    startPos = getLineStartingPositions(syl, textSize);

    let numNewlines = 0;
    let aOffset = 0;
    let sInd = 0;
    for(let i = 0; i < syl.length; i++) {
        while(syl[i] == "\\n") {
            numNewlines++;
            i++
            aOffset = 0;
        }
        syllables[sInd] = {
            x: Number(startPos[numNewlines]) + aOffset + xOffset,
            y: Number(verticalGap * numNewlines + yOffset),
            s: textSize,
            t: syl[i]
        }
        appendToPreview2(previewElement, syllables[sInd], true);
        sInd++;

        aOffset += getWordWidth(trimSyllable(syl[i]), textSize);
        if(syl[i][syl[i].length-1] != '-') {
            aOffset += textSize * 0.2 + 1;
        }
    }
}

function generateLyricString() {
    let str = document.getElementById("input").value;
    let syl = convertStringToSyllables(str);

    let numNewlines = 0;
    let aOffset = 0;
    let retString = `@<size=${textSize}><align=left><line-height=0>`
            + `<pos=${startPos[numNewlines]}>`;


    let prevY = 0;
    let trailingHyphen = false;
    for(let i = 0; i < syllables.length; i++) {
        if(syllables[i].y != prevY) {
            retString += `<voffset=${-(syllables[i].y)}>`
                    + `<pos=${syllables[i].x}>`;
            prevY = syllables[i].y;
        }
        let trimSyl = trimSyllable(syllables[i].t).trim();
        let sylWidth = getWordWidth(syllables[i].t);
        if(syllables[i].x + sylWidth > 155 || syllables[i].x < -160) {
            if(trailingHyphen) {
                retString = retString.substring(0, retString.length - 2) + ' ';
                trailingHyphen = false;
            }
            let wOffset = 0;
            for(let j = 0; j < trimSyl.length; j++) {
                let x = Math.round(syllables[i].x + wOffset);
                retString += `<pos=${x}>${trimSyl[j]}`;
                wOffset += getWordWidth(trimSyl[j], textSize);
            }
            retString += ' ';
        }
        else {
            retString += syllables[i].t + ' ';
            if(syllables[i].t[syllables[i].t.length - 1] == '-') trailingHyphen = true;
            else trailingHyphen = false;
        }

    }
    retString = retString.trim();
    if(yOffset > 0) {
        retString += `<alpha=#00><voffset=${-yOffset}>.`
    }
    else if (yOffset < 0) {
        retString += `<alpha=#00><voffset=${-yOffset}>.`
    }
    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);
}