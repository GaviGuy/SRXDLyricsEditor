const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

const canvasWidth = 160;

const defaultKanaSpacing = 12;
const defaultKanaSize = 12;
const defaultRomajiSize = 8;
const defaultRomajiHeight = 15;

let kanaSpacing = 1.2;
let kanaSize = 1;
let romajiSize = 0.6;
let romajiHeight = 1;

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
            kanaSpacing = element.value;
            break;
        case 1:
            element = document.getElementById("config-kana-size");
            kanaSize = element.value;
            break;
        case 2:
            element = document.getElementById("config-romaji-size");
            romajiSize = element.value;
            break;
        case 3:
            element = document.getElementById("config-romaji-height");
            romajiHeight = element.value;
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


function getWordWidth (word) {
    let len = 0;
    for(let i = 0; i < word.length; i++) {
        switch (word[i]) {
            case 'i':
            case 'l':
            case '1':
            case 'I':
                len += 0.55;
                break;
            case 'j':
            case 'r':
            case 't':
                len += 0.75;
                break;
            case 'm':
            case 'M':
            case 'w':
            case 'W':
                len += 1.4;
                break;
            default:
                len += 1;
        }
    }
    return len / 1.5;
}

function appendToPreview(posX, posY, size, text) {
    let parentElement = document.getElementById("lyrics-preview");
    let newElement = parentElement.appendChild(document.createElement("p"));
    newElement.style = `font-weight: bold; position: absolute; left: ${posX}px; top: ${posY}px; font-size:${size}px`;
    newElement.textContent = text;
}

function clearPreview() {
    let parentElement = document.getElementById("lyrics-preview");
    while(parentElement.hasChildNodes()) {
        parentElement.removeChild(parentElement.firstChild);
    }
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
    let japaneseString = document.getElementById("input-japanese").value;

    let romajiString = document.getElementById("input-romaji").value;
    romajiString = romajiString.replaceAll("|", " | ").replace(/\s+/g, ' ');
    let romajiArray = romajiString.split(" ");

    let initialPos = (canvasWidth - kanaSpacing * (japaneseString.length - 1)) / 2 - kanaSize / 2;
    let romajiPositions = calculateRomajiPositions(romajiArray, initialPos);
    
    clearPreview();

    let skips = 0;
    for(let i = 0; i < japaneseString.length; i++) {
        if(romajiArray[i+skips] == "|") skips++;
        appendToPreview(initialPos + kanaSpacing * i, romajiHeight, kanaSize, japaneseString[i]);
        appendToPreview(romajiPositions[i], 0, romajiSize, romajiArray[i + skips]);
    }

}

function calculateRomajiPositions(romajiArray, initialPos) {
    let wordLength = 1;
    let numSplit = 0;
    let romajiPositions = [];
    for(let i = 0; i < romajiArray.length; i += wordLength + 1) {
        let nextSplit = romajiArray.indexOf("|", i);
        if(nextSplit < 0) nextSplit = romajiArray.length;

        wordLength = nextSplit - i;
        let word = "";
        for (let j = 0; j < wordLength; j++) {
            word += romajiArray[i+j];
        }
        let wordWidth = getWordWidth(word) * romajiSize;
        let centerPos = initialPos + (kanaSpacing * (i + (wordLength / 2) - numSplit)) - (kanaSpacing - kanaSize) / 2;
        let leftPos = centerPos - (wordWidth / 2)
        let accumulatedOffset = 0;

        for(let j = 0; j < wordLength; j++) {
            let syllableWidth = getWordWidth(romajiArray[i+j]) * romajiSize;

            romajiPositions.push(leftPos + accumulatedOffset);
            accumulatedOffset += syllableWidth;
        }
        numSplit++;
        if(numSplit > 50) {
            console.error("infinite loop");
            break;
        }
    }
    return romajiPositions;
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
    for(let i = 0; i < japaneseString.length; i++) {
        if(romajiArray[romajiIndex] == "|") romajiIndex++;

        //truncate float numbers
        let kanaPos = Math.round(initialPos + kanaSpacing * i);
        let romajiPos = Math.round(romajiPositions[i]);
        let h = Math.round(romajiHeight);

        if(romajiIndex >= romajiArray.length) {
            alert("Romaji array is shorter than kana array. Double check your inputs.");
            romajiArray.push("Undefined");
            romajiPos = 0;
        }
        returnString += `<size=${kanaSize}><pos=${kanaPos}>`
                + japaneseString[i]
                + `<size=${romajiSize}><pos=${romajiPos}><voffset=${h}>`
                + romajiArray[romajiIndex++]
                + `</voffset> `;
    }
    if(romajiIndex < romajiArray.length) {
        alert("Romaji array is longer than kana array. Double check your inputs.");
    }
    navigator.clipboard.writeText(returnString);
    console.log(returnString);
}