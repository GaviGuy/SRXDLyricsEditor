const defaultTextSize = 10;
const defaultVerticalGap = 12;
const defaultBgLightness = 0;
const defaultBgOpacity = 255;
const defaultExtraSquares = false;

let textSize = defaultTextSize;
let verticalGap = defaultVerticalGap;
let bgLightness = defaultBgLightness;
let bgOpacity = defaultBgOpacity;
let extraSquares = defaultExtraSquares;

let syllables = [];


async function init() {
    readParameters(0);
    readParameters(1);
    readParameters(2);
    readParameters(3);
    readParameters(4);
}
init();

function readParameters (index) {
    let element;
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
            element = document.getElementById("config-bg-lightness");
            val = validateNumber(element.value, 0, 255);
            if(val == val) bgLightness = val;
            element.value = bgLightness;
            break;
        case 3:
            element = document.getElementById("config-bg-opacity");
            val = validateNumber(element.value, 0, 255);
            if(val == val) bgOpacity = val;
            element.value = bgOpacity;
            break;
        case 4:
            element = document.getElementById("config-extra-squares");
            val = element.checked;
            extraSquares = val;
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
            element = document.getElementById("config-bg-lightness");
            element.value = defaultBgLightness;
            bgLightness = defaultBgLightness;
            break;
        case 3:
            element = document.getElementById("config-bg-opacity");
            element.value = defaultBgOpacity;
            bgOpacity = defaultBgOpacity;
            break;
    }
    generatePreview();
}

function generatePreview() {
    let previewElement = document.getElementById("preview");
    clearPreview(previewElement);

    let str = document.getElementById("input").value;
    let syl = convertStringToSyllables(str);
    syllables = [];

    let totalLines = (str.match(/(\\n)/g) || []).length + 1;

    let aOffset = 0;
    let nNewlines = 0;
    let sInd = 0;
    syllables[0] = {
        x: -40,
        y: -234,
        s: 400,
        t: "■",
        a: bgOpacity,
        c: bgLightness
    };
    appendToPreview2(previewElement, syllables[0]);
    sInd++;

    for(let i = 0; i < syl.length;) {
        if(syl[i] == "\\n") {
            nNewlines++;
            aOffset = 0;
            i++;
            continue;
        }
        let startPos = getLineStartingPositions(syl, textSize);

        let wordWidth = getWordWidth(trimSyllable(syl[i]), textSize);
        let last = getLastChar(syl[i]);
        let wordLen = 1;
        while((i + wordLen) < syl.length && last == '-' || last == '=') {
            wordWidth += getWordWidth(trimSyllable(syl[i + wordLen]), textSize);
            last = getLastChar(syl[i+wordLen]);
            wordLen++;
        }

        let wOffset = 0;

        for(let j = 0; j < wordLen; j++) {
            syllables[sInd] = {
                x: Math.round(startPos[nNewlines] + aOffset + wOffset),
                y: Math.round(verticalGap * (nNewlines - (totalLines - 1) / 2)),
                s: textSize,
                t: trimSyllable(syl[i+j]).trim(),
                a: 255
            }
            appendToPreview2(previewElement, syllables[sInd]);

            sInd++;

            wOffset += getWordWidth(trimSyllable(syl[i+j]), textSize)
            if(syl[i+j][syl[i+j].length-1] != '-') {
                wOffset += 0.25 * textSize;
            }
        }
        aOffset += wOffset;
        i += wordLen;
    }
}

function generateLyricString() {
    const squaresSize = "5000em";
    const recenterY = 28995;
    let stringIn = document.getElementById("input").value;

    let bgColorString = "";
    if(bgLightness == 255) {
        if(bgOpacity < 255)
            bgColorString = `<alpha=#${toAlphaString(bgOpacity)}>`;
        //else, empty string suffices
    }
    else {
        bgColorString = toColorString2(bgLightness, bgOpacity, bgOpacity >= 255);
    }

    let squares = "■";
    if(extraSquares) squares = "■■■";

    let retString = `@<size=5000em><line-height=0>${squares}\n`;

    if(stringIn.length > 0) {

        if(bgColorString.length > 0)
            retString += "</color>";
        retString += `<size=${textSize}>`;

        let numLines = (stringIn.match(/(\\n)/g) || []).length + 1;
        //todo: calculate if any lines auto wrap

        let startInd = 0;
        for(let i = 0; i < numLines; i++) {
            let endInd = stringIn.indexOf("\\n", startInd);
            if(endInd < 0) endInd = stringIn.length;

            retString += `<voffset=${recenterY - (i - (numLines - 1) / 2) * verticalGap}>`;
            retString += stringIn.substring(startInd, endInd).trim() + "\n";
            startInd = endInd + 2;
        }
    }

    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);

    console.log(syllables);
}