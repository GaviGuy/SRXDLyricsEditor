function getWordWidth (word) {
    let len = 0;
    for(let i = 0; i < word.length; i++) {
        switch (word[i]) {
            case 'i':
            case 'l':
            case '1':
            case 'I':
                len += 0.5;
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
                len += 1.5;
                break;
            default:
                len += 1;
        }
    }
    return len;
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

function generateLyricString() {
    let japaneseString = document.getElementById("input-japanese").value;

    let romajiString = document.getElementById("input-romaji").value;
    romajiString = romajiString.replaceAll("|", " | ").replace(/\s+/g, ' ');
    let romajiArray = romajiString.split(" ");
    let romajiIndex = 0;
    let returnString = "@<line-height=0em><align=left>";

    let availableSpace = 15;

    let kanaSpacing = 1.2;
    let initialPos = (availableSpace - kanaSpacing * japaneseString.length) / 2 + kanaSpacing / 2;
    let kanaSize = 1;
    let romajiSize = 0.6;
    console.log(`initialPos ${initialPos}`);

    // console.log(romajiArray);

    //figure out romaji horizontal positions
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
        let wordWidth = getWordWidth(word) / 2.5;
        console.log(`Width of ${word}: ${wordWidth}`);
        console.log(`Length of ${word}: ${wordLength}`);
        let centerPos = initialPos + kanaSpacing * (i + (wordLength / 2) - numSplit) - (kanaSpacing - kanaSize) / 2;
        let leftPos = centerPos - (wordWidth / 2)
        console.log(`leftPos ${leftPos}`);
        let accumulatedOffset = 0;

        for(let j = 0; j < wordLength; j++) {
            let syllableWidth = getWordWidth(romajiArray[i+j]) / 2.5;
            // console.log(`Width ${syllableWidth}`);

            romajiPositions.push(leftPos + accumulatedOffset);
            accumulatedOffset += syllableWidth;
        }

        // console.log(wordLength);
        

        numSplit++;
        if(numSplit > 50) {
            console.error("infinite loop");
            break;
        }
    }


    //assemble final string
    for(let i = 0; i < japaneseString.length; i++) {
        if(romajiArray[romajiIndex] == "|") romajiIndex++;

        let kanaPos = initialPos + kanaSpacing * i;
        let romajiPos = romajiPositions[i];
        returnString += `<pos=${kanaPos}em><size=${kanaSize}em>`
                + japaneseString[i]
                + `<pos=${romajiPos}em><voffset=1em><size=${romajiSize}em>`
                + romajiArray[romajiIndex++]
                + `</voffset></size>\n`;
    }
    navigator.clipboard.writeText(returnString);
    console.log(returnString);
}