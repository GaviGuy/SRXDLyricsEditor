

async function init() {
    handleTagDropdown();
}
init();

function handleTagDropdown() {
    let elem = document.getElementById("config-tag");
    switch(elem.selectedIndex) {
        case 4:
            document.getElementById("other-selected").classList.remove("hidden");
            break;
        default:
            document.getElementById("other-selected").classList.add("hidden");
    }
    generateOutput();
}

function generateOutput() {
    let input = document.getElementById("phrase-input").value;

    let tag = getTagType();

    let mod = validateNumber(document.getElementById("modifier-input").value);

    if(input.length < 1 || tag == "=" || !mod || mod != mod) {
        document.getElementById("output-text").innerText = input;
        return;   
    }

    let ret = "";

    let ind = 0;
    while(ind < input.length - 1) {
        let newInd = input.indexOf(tag, ind) + tag.length;
        if(newInd == tag.length - 1) break;
        
        ret += input.substring(ind, newInd);
        
        ind = input.indexOf(">", newInd);
        let val = parseFloat(input.substring(newInd, ind)) + mod;
        if(Math.abs(val - Math.round(val)) > 0.1)
            ret += val.toFixed(1);
        else
            ret += Math.round(val);
    }
    ret += input.substring(ind);

    document.getElementById("output-text").innerText = ret;
}


function getTagType() {
    let elem = document.getElementById("config-tag");
    if(elem.value == "other...") return document.getElementById("other-input").value + "=";
    else return elem.value + "=";
}

function generateLyricString() {
    let text = document.getElementById("output-text").innerText;
    navigator.clipboard.writeText(text);
    console.log(text);
}