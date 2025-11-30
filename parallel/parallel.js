const defaultTopTextSize = 10;
const defaultBottomTextSize = 10;
const defaultVerticalGap = 12;

let topTextSize = defaultTopTextSize;
let bottomTextSize = defaultBottomTextSize;
let verticalGap = defaultVerticalGap;

let syllables1 = [];
let syllables2 = [];
let xPositions1 = [];
let xPositions2 = [];

async function init() {
    readParameters(0);
    readParameters(1);
    readParameters(2);
}
init();

function readParameters (index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-top-size");
            topTextSize = Number(element.value);
            break;
        case 1:
            element = document.getElementById("config-bottom-size");
            bottomTextSize = Number(element.value);
            break;
        case 2:
            element = document.getElementById("config-vertical-spacing");
            verticalGap = Number(element.value);
            break;
    }
    generatePreview();
}

function revertConfig(index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-top-size");
            element.value = defaultTopTextSize;
            topTextSize = defaultTopTextSize;
            break;
        case 1:
            element = document.getElementById("config-bottom-size");
            element.value = defaultBottomTextSize;
            bottomTextSize = defaultBottomTextSize;
            break;
        case 2:
            element = document.getElementById("config-vertical-spacing");
            element.value = defaultVerticalGap;
            verticalGap = defaultVerticalGap;
            break;
    }
    generatePreview();
}

function generatePreview() {
    let previewElement = document.getElementById("preview");
    clearPreview(previewElement);

    let line1 = document.getElementById("input-top").value;
    let line2 = document.getElementById("input-bottom").value;

    let syl1 = convertStringToSyllables(line1);
    let syl2 = convertStringToSyllables(line2);

    line1 = "";
    line2 = "";
    let work = true;
    let ind = 0;
    while(work) {
        work = false;
        if(ind < syl1.length) {
            line1 += trimSyllable(syl1[ind]);
            work = true;
        }
        if(ind < syl2.length) {
            line2 += trimSyllable(syl2[ind]);
            work = true;
        }
        ind++;
    }

    let startX1 = 80 - getWordWidth(line1, topTextSize) / 2;
    let startX2 = 80 - getWordWidth(line2, bottomTextSize) / 2;

    work = true;
    ind = 0;
    let aOffset1 = 0, aOffset2 = 0;

    while(work) {
        work = false;
        if(ind < syl1.length) {
            let xPos = Math.round(startX1 + aOffset1);
            aOffset1 += getWordWidth(trimSyllable(syl1[ind]), topTextSize);
            if(syl1[ind][syl1[ind].length-1] != '-')
                aOffset1 += topTextSize * 0.25;
            
            syllables1[ind] = {
                x: xPos,
                y: verticalGap / -2,
                s: topTextSize,
                t: trimSyllable(syl1[ind])
            }
            appendToPreview2(previewElement, syllables1[ind]);
            work = true;
        }
        if(ind < syl2.length) {
            let xPos = Math.round(startX2 + aOffset2);
            aOffset2 += getWordWidth(trimSyllable(syl2[ind]), bottomTextSize);
            if(syl2[ind][syl2[ind].length-1] != '-')
                aOffset2 += bottomTextSize * 0.25;
            
            syllables2[ind] = {
                x: xPos,
                y: verticalGap / 2,
                s: bottomTextSize,
                t: trimSyllable(syl2[ind])
            }
            appendToPreview2(previewElement, syllables2[ind]);
            work = true;
        }
        ind++;
    }
}

function generateLyricString() {
    let retString;
    let same = topTextSize == bottomTextSize;
    if(same) {
        retString = `@<size=${topTextSize}><align=left><line-height=0>`;
    }
    else {
        retString = `@<align=left><line-height=0>`;
    }
    let ind = 0;
    let work = true;
    while(work) {
        work = false;
        if(ind < syllables1.length) {
            if(!same) retString += `<size=${topTextSize}>`;
            retString += `<pos=${syllables1[ind].x}>`
                    + `<voffset=${-syllables1[ind].y}>`
                    + syllables1[ind].t.trim();
            work = true;
        }
        if(ind < syllables2.length) {
            if(!same) retString += `<size=${bottomTextSize}>`;
            retString += `<pos=${syllables2[ind].x}>`
                    + `<voffset=${-syllables2[ind].y}>`
                    + syllables2[ind].t.trim();
            work = true;
        }
        retString += ' ';
        ind++;
    }
    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);
}