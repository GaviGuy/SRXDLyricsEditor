const defaultTextSize = 10;
const defaultVerticalGap = 12;

let textSize = defaultTextSize;
let verticalGap = defaultVerticalGap;

let syllables1 = [];
let syllables2 = [];
let xPositions1 = [];
let xPositions2 = [];

async function init() {
    readParameters(0);
    readParameters(1);
}
init();

function readParameters (index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-text-size");
            textSize = element.value;
            break;
        case 1:
            element = document.getElementById("config-vertical-spacing");
            verticalGap = element.value;
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

    let startX1 = 80 - getWordWidth(line1, textSize) / 2;
    let startX2 = 80 - getWordWidth(line2, textSize) / 2;

    work = true;
    ind = 0;
    let aOffset1 = 0, aOffset2 = 0;

    // let x = [],
    //     y = [],
    //     s = [],
    //     t = [],
    //     a = [];
    // let buildInd = 0;

    while(work) {
        work = false;
        if(ind < syl1.length) {
            syllables1[ind] = trimSyllable(syl1[ind]);
            xPositions1[ind] = Math.round(startX1 + aOffset1);
            aOffset1 += getWordWidth(syllables1[ind], textSize);
            if(syl1[ind][syl1[ind].length-1] != '-')
                aOffset1 += textSize * 0.3;
            appendToPreview(previewElement, xPositions1[ind], verticalGap / -2, textSize, syllables1[ind], 255);
            // x[buildInd] = Math.round(xPositions1[ind]);
            // y[buildInd] = Math.round(verticalGap / -2);
            // s[buildInd] = Number(textSize);
            // t[buildInd] = syllables1[ind];
            // a[buildInd] = 255;
            // buildInd++;
            work = true;
        }
        if(ind < syl2.length) {
            syllables2[ind] = trimSyllable(syl2[ind]);
            xPositions2[ind] = Math.round(startX2 + aOffset2);
            aOffset2 += getWordWidth(syllables2[ind], textSize);
            if(syl2[ind][syl2[ind].length-1] != '-')
                aOffset2 += textSize * 0.3;
            appendToPreview(previewElement, xPositions2[ind], verticalGap / 2, textSize, syllables2[ind], 255);
            // x[buildInd] = Math.round(xPositions2[ind]);
            // y[buildInd] = Math.round(verticalGap / 2);
            // s[buildInd] = Number(textSize);
            // t[buildInd] = syllables2[ind];
            // a[buildInd] = 255;
            // buildInd++;
            work = true;
        }
        ind++;
    }
    
    // console.log(x);
    // console.log(y);
    // console.log(s);
    // console.log(t);
    // console.log(a);
}

function generateLyricString() {
    let retString = `@<size=${textSize}><align=left><line-height=0>`;
    let ind = 0;
    let work = true;
    while(work) {
        work = false;
        if(ind < syllables1.length) {
            retString += `<pos=${xPositions1[ind]}>`
                    + `<voffset=${verticalGap / 2}>`
                    + syllables1[ind].trim();
            work = true;
        }
        if(ind < syllables2.length) {
            retString += `<pos=${xPositions2[ind]}>`
                    + `<voffset=${verticalGap / -2}>`
                    + syllables2[ind].trim();
            work = true;
        }
        retString += ' ';
        ind++;
    }
    navigator.clipboard.writeText(retString);
    console.log(retString);
}