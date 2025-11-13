const canvasWidth = 160;

const defaultKanaSpacing = 12;
const defaultKanaSize = 12;
const defaultRomajiSize = 8;
const defaultRomajiHeight = 15;

let kanaSpacing = 12;
let kanaSize = 12;
let romajiSize = 8;
let romajiHeight = 15;

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

function getWordWidth2 (word, fontSize) {
    let elem = document.getElementById("widther");
    elem.textContent = word;
    elem.style.fontSize = fontSize;
    return elem.clientWidth / 2;
}

// function getWordWidth (word) {
//     let len = 0;
//     for(let i = 0; i < word.length; i++) {
//         if(word[i] >= 'ぁ' && word[i] <= 'ゟ' || word[i] >= 'ァ' && word[i] <= 'ヿ') {
//             len += 1.5
//             continue;
//         }
//         switch (word[i]) {
//             case '*':
//                 break;
//             case 'i':
//             case 'l':
//             case '1':
//             case 'I':
//                 len += 0.55;
//                 break;
//             case 'j':
//             case 'r':
//             case 't':
//                 len += 0.75;
//                 break;
//             case 'm':
//             case 'M':
//             case 'w':
//             case 'W':
//                 len += 1.4;
//                 break;
//             default:
//                 len += 1;
//         }
//     }
//     return len / 1.5;
// }

function appendToPreview(posX, posY, size, text) {
    let parentElement = document.getElementById("lyrics-preview");
    let newElement = parentElement.appendChild(document.createElement("p"));
    newElement.style = `font-weight: 800; position: absolute; left: ${2* posX}px; top: ${2* posY}px; font-size:${2* size}px`;
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

    let romajiH = (romajiSize * -1.75);
    let kanaH = 1 * romajiH + 1 * romajiHeight - 1.75 * (kanaSize - romajiSize);
    
    clearPreview();

    let skips = 0;
    for(let i = 0; i < japaneseString.length; i++) {
        while(romajiArray[i+skips] == "|") skips++;
        appendToPreview(initialPos + kanaSpacing * i, kanaH + 40, kanaSize, japaneseString[i]);
        if(romajiArray[i+skips] != '*')
            appendToPreview(romajiPositions[i], romajiH + 40, romajiSize, romajiArray[i + skips]);
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
        let wordWidth = getWordWidth2(word, romajiSize);
        let centerPos = initialPos + 0.5 * kanaSize + (kanaSpacing * (i + ((wordLength - 1) / 2) - numSplit)) ;
        let leftPos = centerPos - (wordWidth / 2)
        let accumulatedOffset = 0;

        for(let j = 0; j < wordLength; j++) {
            let syllableWidth = getWordWidth2(romajiArray[i+j], romajiSize);

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
        if(romajiArray[romajiIndex] != '*')
            romajiString = `<size=${romajiSize}><pos=${romajiPos}><voffset=${h}>`
                + romajiArray[romajiIndex] + `</voffset>`;
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