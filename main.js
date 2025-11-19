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