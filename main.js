const spaceWidth = 0.25;

function getWordWidth (word, fontSize) {
    let elem = document.getElementById("widther");
    elem.textContent = word;
    elem.style.fontSize = fontSize + "px";
    return elem.clientWidth;
}

function validateNumber(num, min, max) {
    if(num == "") return NaN;
    num = Number(num);
    if(num != num) return num;
    if((min || min == 0) && num < min) return min;
    if((max || max == 0) && num > max) return max;
    return num;
}

function getLastChar(str) {
    return str[str.length - 1]
}

function appendToPreview(previewElement, posX, posY, size, text, alpha) {
    if(!alpha && alpha != 0 || alpha > 255) alpha = 255;
    if(alpha < 0) alpha = 0;
    let str = Number(alpha).toString(16);
    if(alpha < 16) str = '0' + Number(alpha).toString(16)
    let newElement = previewElement.appendChild(document.createElement("p"));
    newElement.style = `font-weight: 800; position: absolute;`
                    + `left: ${2* posX}px; top: ${2* posY}px; font-size:${2* size}px;`
                    + `color: #FFFFFF${str}`;
    newElement.textContent = text;
}

function toColorString (c, a) {
    if(!a && a != 0 || a > 255) a = 255;
    if(a < 0) a = 0;
    if(!c && c != 0 || c > 255) c = 255;
    if(c < 0) c = 0;
    let cStr = c.toString(16);
    if(c < 16) cStr = "0" + cStr;
    let aStr = a.toString(16);
    if(a < 16) aStr = "0" + aStr;
    let ret = "#" + cStr + cStr + cStr + aStr;
    return ret.toUpperCase();
}

function toColorString2 (c, a) {
    if(!a && a != 0 || a > 255) a = 255;
    if(a < 0) a = 0;
    if(!c && c != 0 || c > 255) c = 255;
    if(c < 0) c = 0;
    
    if(a < 9 && a > 0) a = 1;
    else a = Math.round(a/17);
    if(c < 9 && c > 0) c = 1;
    else c = Math.round(c/17);
    
    let aStr = a.toString(16);
    let cStr = c.toString(16);
    let ret = "#" + cStr + cStr + cStr + aStr;
    return ret.toUpperCase();
}

function appendToPreview2(previewElement, obj, trim) {
    if(!obj) return;
    if(!(obj.a) && obj.a != 0 || (obj.a) > 255) obj.a = 255;
    if((obj.a) < 0) obj.a = 0;
    if(!(obj.c) && obj.c != 0) obj.c = 255;
    if(obj.c > 255) obj.c = 255;
    if(obj.c < 0) obj.c = 0;
    let aStr = Number(obj.a).toString(16);
    let cStr = Number(obj.c).toString(16);
    if((obj.c) < 16) cStr = '0' + cStr;
    cStr = '#' + cStr + cStr + cStr
    if((obj.a) < 16) aStr = '0' + aStr;
    let newElement = previewElement.appendChild(document.createElement("p"));
    newElement.style = `font-weight: 800; position: absolute;`
                    + `left: ${2*(obj.x)}px; top: ${60+2*(obj.y - obj.s * 1.2)}px;`
                    + `font-size:${2*(obj.s)}px; color: ${cStr + aStr};`;
    if(trim) newElement.textContent = trimSyllable(obj.t).trim();
    else newElement.textContent = obj.t;
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

function getLineStartingPositions (sylArray, textSize, spaceMult, blockAsterisk) {
    if(spaceMult != 0 && !spaceMult) spaceMult = 1;
    let str = "";
    let newlinesCount = 0;
    let positions = [];
    for(let i = 0; i < sylArray.length; i++) {
        if(blockAsterisk && (sylArray[i] == '*' || sylArray[i] == '*-')) {
            continue;
        }
        if(sylArray[i] != "\\n") {
            str += trimSyllable(sylArray[i]);
        }
        if(sylArray[i] == "\\n" || i == sylArray.length - 1) {
            positions[newlinesCount] = getWordWidth(str.trim(), textSize);

            let numSpaces = str.split(' ').length - 1;
            positions[newlinesCount] += numSpaces * 0.25 * (spaceMult - 1) * textSize;

            positions[newlinesCount] = 80 - positions[newlinesCount] / 2;
            str = "";
            newlinesCount++;
        }
    }
    return positions;
}
