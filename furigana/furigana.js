const canvasWidth = 160;

const defaultKanaSpacing = 12;
const defaultKanaSize = 12;
const defaultRomajiSize = 8;
const defaultRomajiHeight = 15;

let kanaSpacing = defaultKanaSpacing;
let kanaSize = defaultKanaSize;
let romajiSize = defaultRomajiSize;
let romajiHeight = defaultRomajiHeight;

let syllables = [];

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
            element = document.getElementById("config-kana-spacing");
            kanaSpacing = Number(element.value);
            break;
        case 1:
            element = document.getElementById("config-kana-size");
            kanaSize = Number(element.value);
            break;
        case 2:
            element = document.getElementById("config-romaji-size");
            romajiSize = Number(element.value);
            break;
        case 3:
            element = document.getElementById("config-romaji-height");
            romajiHeight = Number(element.value);
            break;
    }
    generatePreview();
}

function revertConfig(index) {
    let element;
    switch(index) {
        case 0:
            element = document.getElementById("config-kana-spacing");
            element.value = defaultKanaSpacing;
            kanaSpacing = defaultKanaSpacing;
            break;
        case 1:
            element = document.getElementById("config-kana-size");
            element.value = defaultKanaSize;
            kanaSize = defaultKanaSize;
            break;
        case 2:
            element = document.getElementById("config-romaji-size");
            element.value = defaultRomajiSize;
            romajiSize = defaultRomajiSize;
            break;
        case 3:
            element = document.getElementById("config-romaji-height");
            element.value = defaultRomajiHeight;
            romajiHeight = defaultRomajiHeight;
            break;
    }
    generatePreview();
}

function convertToRomaji(japaneseString) {
    //return "";
}

function divideIntoWords(japaneseString) {
    //let words;
}

function generateRomaji() {
    let japaneseString = document.getElementById("input-japanese").value;
    console.log(japaneseString);

}

function generatePreview() {
    let previewElement = document.getElementById("preview");
    clearPreview(previewElement);

    let japaneseString = document.getElementById("input-japanese").value;

    let romajiString = document.getElementById("input-romaji").value;
    let romajiArray = convertStringToSyllables(romajiString);

    let sInd = 0;

    let initialPos = (canvasWidth - kanaSpacing * (japaneseString.length - 1) - kanaSize) / 2;
    let romajiPositions = calculateRomajiPositions(romajiArray, initialPos);
    let tooLong = 0;

    for(let i = 0; i < japaneseString.length; i++) {
        syllables[sInd] = {
            x: initialPos + kanaSpacing * i,
            y: 0,
            s: kanaSize,
            t: japaneseString[i]
        };
        appendToPreview2(previewElement, syllables[sInd]);
        sInd++;

        if(i >= romajiArray.length || romajiArray[i] == '*' || romajiArray[i] == '*-') {
            syllables[sInd] = undefined;
        }
        else {
            syllables[sInd] = {
                x: romajiPositions[i],
                y: - romajiHeight,
                s: romajiSize,
                t: trimSyllable(romajiArray[i])
            };
            appendToPreview2(previewElement, syllables[sInd]);
        }
        sInd++;
    }
}

function calculateRomajiPositions(romajiArray, initialPos) {
    let mode = document.getElementById("config-romaji-mode").checked;
    let ret = [];
    if(mode) {
        let startPos = getLineStartingPositions(romajiArray, romajiSize)[0];
        let aOffset = 0;
        for(let i = 0; i < romajiArray.length; i++) {
            ret[i] = startPos + aOffset;
            if(romajiArray[i] != '*' && romajiArray[i] != '*-') {
                aOffset += getWordWidth(trimSyllable(romajiArray[i]), romajiSize);
            }
            if(romajiArray[i][romajiArray[i].length - 1] != '-') {
                aOffset += 0.3 * romajiSize;
            }
        }
    }
    else {
        let i = 0;
        while(i < romajiArray.length) {
            let last = romajiArray[i][romajiArray[i].length-1];
            let wordWidth = 0;
            if(romajiArray[i] != '*' && romajiArray[i] != '*-') {
                wordWidth = getWordWidth(romajiArray[i], romajiSize);
            }
            let wordLength = 1;
            while(last == '-' || last == '=') {
                if(romajiArray[i+wordLength] != '*-') {
                    wordWidth += getWordWidth(trimSyllable(romajiArray[i+wordLength]), romajiSize);
                }
                last = romajiArray[i + wordLength][romajiArray[i + wordLength].length-1];
                wordLength++;
            }
            
            let wordStartPos = initialPos + kanaSpacing * (i + (wordLength - 1) / 2) + (kanaSize - wordWidth) / 2; 
            let aOffset = 0;
            for(let j = 0; j < wordLength; j++) {
                ret[i+j] = wordStartPos + aOffset;
                if(romajiArray[i+j] != '*' && romajiArray[i+j] != '*-')
                    aOffset += getWordWidth(trimSyllable(romajiArray[i+j]), romajiSize);
            }
            i += wordLength;
        }
    }
    return ret;
}

function generateLyricString() {
    generatePreview();
    let japaneseString = document.getElementById("input-japanese").value;

    let romajiString = document.getElementById("input-romaji").value;
    romajiString = romajiString.replaceAll("|", " | ").replace(/\s+/g, ' ');
    let romajiArray = romajiString.split(" ");
    let romajiIndex = 0;
    let returnString = "@<line-height=0em><align=left>";

    let initialPos = (canvasWidth - kanaSpacing * (japaneseString.length - 1)) / 2 - kanaSize / 2;
    let romajiPositions = calculateRomajiPositions(romajiArray, initialPos);
    


    //assemble final string
    let tooShort = 0;
    for(let i = 0; i < japaneseString.length; i++) {
        if(romajiArray[romajiIndex] == "|") romajiIndex++;

        //truncate float numbers
        let kanaPos = Math.round(initialPos + kanaSpacing * i);
        let romajiPos = Math.round(romajiPositions[i]);
        let h = Math.round(romajiHeight);

        if(romajiIndex >= romajiArray.length) {
            tooShort++;
            romajiArray.push("Undefined");
            romajiPos = 0;
        }
        let kanaString = `<size=${kanaSize}><pos=${kanaPos}>${japaneseString[i]}`;
        let romajiString = "";
        if(romajiArray[romajiIndex] != '*' && romajiArray[romajiIndex] != '*-')
            romajiString = `<size=${romajiSize}><pos=${romajiPos}><voffset=${h}>`
                + trimSyllable(romajiArray[romajiIndex]) + `</voffset>`;
        returnString += kanaString + romajiString + ' ';

        romajiIndex++;
    }
    //report erronous input
    if(tooShort)
        alert(`Missing ${tooShort} romaji word${tooShort > 1 ? 's' : ''}. Double check your inputs.`);
    let tooMany = (romajiArray.length - romajiIndex)
    if(tooMany > 0) {
        tooMany = 0;
        for(let i = romajiIndex; i < romajiArray.length; i++) {
            if(romajiArray[i] != '|' && romajiArray[i].trim() != '') tooMany++;
        }
        if(tooMany > 0) alert(`Found ${tooMany} extra romaji word${tooMany > 1 ? 's' : ''}. Double check your inputs.`);
    }

    navigator.clipboard.writeText(returnString);
    console.log(returnString);
}