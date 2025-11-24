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
            textSize = Number(element.value);
            break;
        case 1:
            element = document.getElementById("config-impact-size");
            impactSize = Number(element.value);
            break;
        case 2:
            element = document.getElementById("config-vertical-spacing");
            verticalGap = Number(element.value);
            break;
        case 3:
            element = document.getElementById("config-impact-offset");
            impactOffset = Number(element.value);
            break;
        case 4:
            element = document.getElementById("config-impact-opacity");
            impactOpacity = Number(element.value);
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
        let last = syl[i][syl[i].length-1];
        let wordLen = 1;
        while((i + wordLen) < syl.length && last == '-' || last == '=') {
            wordWidth += getWordWidth(trimSyllable(syl[i + wordLen]), textSize);
            impactWidth += getWordWidth(trimSyllable(syl[i + wordLen]), impactSize);
            last = syl[i+wordLen][syl[i+wordLen].length-1];
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
                wOffset += 0.2 * textSize * spacingMult;
                iOffset += 0.2 * impactSize * spacingMult;
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