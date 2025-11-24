const canvasWidth = 160;

const defaultKanaSpacing = 12;
const defaultKanaSize = 12;
const defaultRomajiSize = 8;
const defaultRomajiHeight = 15;
const defaultOptimize = 0;

const reg = /^[aeiou]$/;

let kanaSpacing = defaultKanaSpacing;
let kanaSize = defaultKanaSize;
let romajiSize = defaultRomajiSize;
let romajiHeight = defaultRomajiHeight;
let optimize = defaultOptimize;

let optimizeStrings = [
    [
        "Output string will always put kana before pronunciation.",
        "Output string will alternate kana and pronunciations to reduce the number of tags, but only in mono-on syllables (eg. Ka or No, as opposed to Akira or Kai).",
        "Output string will always alternate kana and pronunciations regardless of word structure."
    ],
    [
        "Use this for maximum clarity and organization. (0% length reduction)",
        "Use this if you intend to break up pronounced chunks post-generation. (~10% length reduction)",
        "Use this if you do not intend to seperate into syllables. (~25% length reduction)"
    ]
];

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
        case 4:
            element = document.getElementById("input-optimize");
            optimize = Number(element.value);
            element = document.getElementById("optimization-description");
            element.textContent = optimizeStrings[0][optimize];
            element = document.getElementById("optimization-recommendation");
            element.textContent = optimizeStrings[1][optimize];
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
    syllables = [];

    let japaneseString = document.getElementById("input-japanese").value;

    let romajiString = document.getElementById("input-romaji").value;
    let romajiArray = convertStringToSyllables(romajiString);

    let sInd = 0;

    let initialPos = (canvasWidth - kanaSpacing * (japaneseString.length - 1) - kanaSize) / 2;
    let romajiPositions = calculateRomajiPositions(romajiArray, initialPos);

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
                aOffset += 0.2 * romajiSize;
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

function isPolyOnic (string) {
    string = string.toLowerCase().trim();
    if(!string) return false;
    if(string.length < 2) return false;
    if(string.length > 3) return true;
    if(string.length == 2) {
        // consonant-vowel, eg. 'ka'
        if(!(reg.test(string[0])) && reg.test(string[1])) return false;
        // any other 2-letter config
        else return true;
    }
    // consonant-y-vowel or consonant-h-vowel, eg. "sha", "kyu", "chi"
    if(string[2] == 'y' || string[2] == 'h' && !(reg.test(string[0])) && string[3] == vowel || string == 'tsu') return false;
    return true;

}

function generateLyricString() {
    let japaneseString = document.getElementById("input-japanese").value;
    let romajiString = convertStringToSyllables(document.getElementById("input-romaji").value);
    let diff = japaneseString.length - romajiString.length;
    if(diff > 0) {
        alert(`Missing ${diff} pronounced syllable${diff > 1 ? 's' : ''}. Double check your inputs.`)
    }
    else if (diff < 0) {
        alert(`Found ${-diff} extra pronounced syllable${diff < -1 ? 's' : ''}. Double check your inputs.`)
    }


    generatePreview();
    let retString = "@<line-height=0em><align=left>";

    let prevType = -1;
    for(let i = 0; i < syllables.length; i += 2) {
        let kx = Math.round(syllables[i].x);
        let px;
        if(syllables[i+1]) px = Math.round(syllables[i+1].x);
        
        let poly = false;
        if(syllables[i+1]) poly = isPolyOnic(syllables[i+1].t);
        if(optimize == 0 || optimize == 1 && poly || prevType == -1) { //Don't optimize
            if(prevType == 0) {
                retString += `<pos=${kx}>`
                        + syllables[i].t.trim();
            }
            else {
                retString += `<pos=${kx}>`
                        + "</voffset>"
                        + `<size=${syllables[i].s}>`
                        + syllables[i].t.trim();
            }
            prevType = 0;

            if(syllables[i+1]) {
                retString += `<pos=${px}>`
                        + `<voffset=${-syllables[i+1].y}>`
                        + `<size=${syllables[i+1].s}>`
                        + syllables[i+1].t.trim();
                prevType = 1;
            }
        }
        else { //Do optimize
            if(prevType == 0) {
                //add kana (no tags)
                retString += `<pos=${Math.round(kx)}>`
                        + syllables[i].t.trim();
                //add pronunciation (tags)
                if(syllables[i+1]) {
                    retString += `<pos=${px}>`
                            + `<voffset=${-syllables[i+1].y}>`
                            + `<size=${syllables[i+1].s}>`
                            + syllables[i+1].t.trim();
                    prevType = 1;
                }
            }
            else {
                //add pronunciation (no tags)
                if(syllables[i+1]) {
                    retString += `<pos=${px}>`
                            + syllables[i+1].t.trim();
                }
                //add kana (tags)
                retString += `<pos=${kx}>`
                        + "</voffset>"
                        + `<size=${syllables[i].s}>`
                        + syllables[i].t.trim();
                prevType = 0
            }
        }
        retString += ' ';
    }
    retString = retString.trim();
    navigator.clipboard.writeText(retString);
    console.log(retString);
}