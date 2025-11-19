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
    // let x = [],
    //     y = [],
    //     s = [],
    //     t = [],
    //     a = [];
    // let ind = 0;
    let previewElement = document.getElementById("preview");
    for(let i = 0; i < japaneseString.length; i++) {
        while(romajiArray[i+skips] == "|") skips++;
        appendToPreview(previewElement, initialPos + kanaSpacing * i, kanaH + 40, kanaSize, japaneseString[i]);
        // x[ind] = initialPos + kanaSpacing * i;
        // y[ind] = Number(kanaH) + 40;
        // s[ind] = Number(kanaSize);
        // t[ind] = japaneseString[i];
        // a[ind] = 255;
        // ind++;
        if(romajiArray[i+skips] != '*')
            appendToPreview(previewElement, romajiPositions[i], romajiH + 40, romajiSize, romajiArray[i + skips]);
                // x[ind] = romajiPositions[i];
                // y[ind] = Number(romajiH) + 40;
                // s[ind] = Number(romajiSize);
                // t[ind] = romajiArray[i + skips];
                // a[ind] = 255;
                // ind++;
    }
    // console.log(x);
    // console.log(y);
    // console.log(s);
    // console.log(t);
    // console.log(a);


}

function calculateRomajiPositions(romajiArray, initialPos) {
    let mode = document.getElementById("config-romaji-mode");
    mode = mode.checked;
    let wordLength = 1;
    let numSplit = 0;
    let romajiPositions = [];
    for(let i = 0; i < romajiArray.length; i += wordLength + 1) {
        let nextSplit = romajiArray.length;
        if(!mode) nextSplit = romajiArray.indexOf("|", i);
        if(nextSplit < 0) nextSplit = romajiArray.length;

        wordLength = nextSplit - i;
        let word = "";
        for (let j = 0; j < wordLength; j++) {
            word += romajiArray[i+j];
        }
        let wordWidth = getWordWidth(word, romajiSize);
        let centerPos = initialPos + 0.5 * kanaSize + (kanaSpacing * (i + ((wordLength - 1) / 2) - numSplit)) ;
        if(mode) centerPos = 80;
        let leftPos = centerPos - (wordWidth / 2)
        let accumulatedOffset = 0;

        for(let j = 0; j < wordLength; j++) {
            let syllableWidth = getWordWidth(romajiArray[i+j], romajiSize);
            
            if(romajiArray[i+j] != '|')
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