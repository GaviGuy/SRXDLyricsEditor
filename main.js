function getWordWidth (word, fontSize) {
    let elem = document.getElementById("widther");
    elem.textContent = word;
    elem.style.fontSize = fontSize + "px";
    return elem.clientWidth;
}

function appendToPreview(previewElement, posX, posY, size, text, alpha) {
    if(!alpha || alpha > 255) alpha = 255;
    if(alpha < 0) alpha = 0;
    let str = Number(alpha).toString(16);
    if(alpha < 16) str = '0' + Number(alpha).toString(16)
    let newElement = previewElement.appendChild(document.createElement("p"));
    newElement.style = `font-weight: 800; position: absolute;`
                    + `left: ${2* posX}px; top: ${2* posY}px; font-size:${2* size}px;`
                    + `color: #FFFFFF${str}; outline: #000000`;
    newElement.textContent = text;
}

function appendToPreview2(previewElement, obj) {
    if(!obj) return;
    if(!(obj.a) || (obj.a) > 255) obj.a = 255;
    if((obj.a) < 0) obj.a = 0;
    let str = Number(obj.a).toString(16);
    if((obj.a) < 16) str = '0' + str;
    let newElement = previewElement.appendChild(document.createElement("p"));
    newElement.style = `font-weight: 800; position: absolute;`
                    + `left: ${2*(obj.x)}px; top: ${60+2*(obj.y - obj.s * 1.2)}px; font-size:${2*(obj.s)}px;`
                    + `color: #FFFFFF${str};`;
    newElement.textContent = obj.t;
}

function clearPreview(previewElement) {
    while(previewElement.hasChildNodes()) {
        previewElement.removeChild(previewElement.firstChild);
    }
}

Math.seed = function(s) {
    var mask = 0xffffffff;
    var m_w  = (123456789 + s) & mask;
    var m_z  = (987654321 - s) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

      var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
}

function convertStringToSyllables (phrase) {
    phrase = phrase.replaceAll("\\n", " \\n ").replace(/\s+/g, ' ');
    let ret = phrase.split(" ");
    return ret;
}

function trimSyllable (syl) {
    let last = syl[syl.length-1];
    if(last == '-') return syl.substring(0, syl.length-1);
    if(last == '=') return syl.substring(0, syl.length-1) + '-';
    return syl + " ";
}

function getLineStartingPositions (sylArray, textSize, spaceMult) {
    if(spaceMult != 0 && !spaceMult) spaceMult = 1;
    let str = "";
    let newlinesCount = 0;
    let positions = [];
    for(let i = 0; i < sylArray.length; i++) {
        if(sylArray[i] != "\\n") {
            str += trimSyllable(sylArray[i]);
        }
        if(sylArray[i] == "\\n" || i == sylArray.length - 1) {
            positions[newlinesCount] = getWordWidth(str.trim(), textSize);

            let numSpaces = str.split(' ').length - 1;
            positions[newlinesCount] += numSpaces * 0.2 * (spaceMult - 1) * textSize;

            positions[newlinesCount] = 80 - positions[newlinesCount] / 2;
            str = "";
            newlinesCount++;
        }
    }
    return positions;
}