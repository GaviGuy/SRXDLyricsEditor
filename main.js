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

function appendToPreview(posX, posY, size, text) {
    let parentElement = document.getElementById("lyrics-preview");
    let newElement = parentElement.appendChild(document.createElement("p"));
    newElement.style = `font-weight: bold; position: absolute; left: ${posX}rem; top: ${posY}rem; font-size:${size}rem`;
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
    // console.log(`initialPos ${initialPos}`);

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
        // console.log(`Width of ${word}: ${wordWidth}`);
        // console.log(`Length of ${word}: ${wordLength}`);
        let centerPos = initialPos + kanaSpacing * (i + (wordLength / 2) - numSplit) - (kanaSpacing - kanaSize) / 2;
        let leftPos = centerPos - (wordWidth / 2)
        // console.log(`leftPos ${leftPos}`);
        let accumulatedOffset = 0;

        for(let j = 0; j < wordLength; j++) {
            let syllableWidth = getWordWidth(romajiArray[i+j]) / 2.5;
            // console.log(`Width ${syllableWidth}`);
            appendToPreview(leftPos+accumulatedOffset, 0, romajiSize, romajiArray[i+j]);

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
    clearPreview();
    for(let i = 0; i < japaneseString.length; i++) {
        if(romajiArray[romajiIndex] == "|") romajiIndex++;

        //truncate float numbers
        let kanaPos = initialPos + kanaSpacing * i;
        kanaPos = Math.round(kanaPos * 100) / 100;
        let romajiPos = romajiPositions[i];
        romajiPos = Math.round(romajiPos * 100) / 100;

        appendToPreview(kanaPos, 0.5, kanaSize, japaneseString[i]);

        appendToPreview(romajiPos, 0, romajiSize, romajiArray[romajiIndex]);

        returnString += `<pos=${kanaPos}em><size=${kanaSize}em>`
                + japaneseString[i]
                + `<pos=${romajiPos}em><voffset=1em><size=${romajiSize}em>`
                + romajiArray[romajiIndex++]
                + `</voffset></size>\n`;
    }
    navigator.clipboard.writeText(returnString);
    console.log(returnString);
}