const defaultTopTextSize = 10;
const defaultImpactSize = 12;
const defaultVerticalGap = 12;
const defaultImpactOffset = 5;
const defaultImpactOpacity = 40;
const defaultSpacingMult = 2;

let textSize = defaultTopTextSize;
let impactSize = defaultImpactSize;
let verticalGap = defaultVerticalGap;
let impactOffset = defaultImpactOffset;
let impactOpacity = defaultImpactOpacity;
let spacingMult = defaultSpacingMult;

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
            val = validateNumber(element.value, 0);
            if(val == val) textSize = val;
            element.value = textSize;
            break;
        case 1:
            element = document.getElementById("config-impact-size");
            val = validateNumber(element.value, 0);
            if(val == val) impactSize = val;
            element.value = impactSize;
            break;
        case 2:
            element = document.getElementById("config-vertical-spacing");
            val = validateNumber(element.value);
            if(val == val) verticalGap = val;
            element.value = verticalGap;
            break;
        case 3:
            element = document.getElementById("config-impact-offset");
            val = validateNumber(element.value);
            if(val == val) impactOffset = val;
            element.value = impactOffset;
            break;
        case 4:
            element = document.getElementById("config-impact-opacity");
            val = validateNumber(element.value, 0, 255);
            if(val == val) impactOpacity = val;
            element.value = impactOpacity;
            break;
        case 5:
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
            element.value = defaultTopTextSize;
            textSize = defaultTopTextSize;
            break;
        case 1:
            element = document.getElementById("config-impact-size");
            element.value = defaultImpactSize;
            impactSize = defaultImpactSize;
            break;
        case 2:
            element = document.getElementById("config-vertical-spacing");
            element.value = defaultVerticalGap;
            verticalGap = defaultVerticalGap;
            break;
        case 3:
            element = document.getElementById("config-impact-offset");
            element.value = defaultImpactOffset;
            impactOffset = defaultImpactOffset;
            break;
        case 4:
            element = document.getElementById("config-impact-opacity");
            element.value = defaultImpactOpacity;
            impactOpacity = defaultImpactOpacity;
            break;
        case 5:
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

    let str = document.getElementById("input").value;
    let syl = convertStringToSyllables(str);
    syllables = [];

    let aOffset = 0;
    let nNewlines = 0;
    let sInd = 0;
    for(let i = 0; i < syl.length;) {
        if(syl[i] == "\\n") {
            nNewlines++;
            aOffset = 0;
            i++;
            continue;
        }
        let startPos = getLineStartingPositions(syl, textSize, spacingMult);

        let wordWidth = getWordWidth(trimSyllable(syl[i]), textSize);
        let impactWidth = getWordWidth(trimSyllable(syl[i]), impactSize);
        let last = getLastChar(syl[i]);
        let wordLen = 1;
        while((i + wordLen) < syl.length && last == '-' || last == '=') {
            wordWidth += getWordWidth(trimSyllable(syl[i + wordLen]), textSize);
            impactWidth += getWordWidth(trimSyllable(syl[i + wordLen]), impactSize);
            last = getLastChar(syl[i+wordLen]);
            wordLen++;
        }

        let wOffset = 0;
        let iOffset = 0;
        for(let j = 0; j < wordLen; j++) {

            let impactX = startPos[nNewlines] + aOffset;
            impactX -= ((80 - (impactX + impactWidth / 2)) / 80) * impactOffset;
            impactX += (wordWidth - impactWidth) / 2;
            impactX += iOffset;

            let impactY = textSize * 1.2 * nNewlines;
            impactY += (textSize - impactSize) * 0.5;
            impactY += impactOffset * nNewlines / 3;


            syllables[sInd] = {
                x: Math.round(impactX),
                y: Math.round(impactY),
                s: impactSize,
                t: trimSyllable(syl[i+j]).trim(),
                a: impactOpacity
            }
            appendToPreview2(previewElement, syllables[sInd]);
            
            sInd++;

            syllables[sInd] = {
                x: Math.round(startPos[nNewlines] + aOffset + wOffset),
                y: Math.round(textSize * 1.2 * nNewlines),
                s: textSize,
                t: trimSyllable(syl[i+j]).trim(),
                a: 255
            }
            appendToPreview2(previewElement, syllables[sInd]);

            sInd++;

            wOffset += getWordWidth(trimSyllable(syl[i+j]), textSize);
            iOffset += getWordWidth(trimSyllable(syl[i+j]), impactSize);
            if(syl[i+j][syl[i+j].length-1] != '-') {
                wOffset += 0.25 * textSize * spacingMult;
                iOffset += 0.25 * impactSize * spacingMult;
            }
        }
        aOffset += wOffset;
        i += wordLen;
    }
}

function generateLyricString() {
    let textAlphaStr;
    let impactAlphaStr;
    if(impactOpacity == 255) {
        textAlphaStr = "";
        impactAlphaStr = "";
    }
    else {
        textAlphaStr = '<alpha=#FF>'
        impactAlphaStr = impactOpacity.toString(16);
        if(impactOpacity < 16) impactAlphaStr = '0' + impactAlphaStr;
        impactAlphaStr = `<alpha=#${impactAlphaStr}>`
    }
    
    let textSizeStr;
    let impactSizeStr;
    if(textSize == impactSize) {
        textSizeStr = "";
        impactSizeStr = "";
    }
    else {
        textSizeStr = `<size=${textSize}>`
        impactSizeStr = `<size=${impactSize}>`
    }

    let retString = `@<size=${textSize}><align=left><line-height=0>`;
    for(let i = 0; i < syllables.length; i += 2) {
        retString += impactAlphaStr + impactSizeStr
                + `<pos=${syllables[i].x}>`
                + `<voffset=${-syllables[i].y}>`
                + syllables[i].t;
                
        retString += textAlphaStr + textSizeStr
                + `<pos=${syllables[i+1].x}>`
                + `<voffset=${-syllables[i+1].y}>`
                + syllables[i+1].t + ' ';
    }
    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);
}