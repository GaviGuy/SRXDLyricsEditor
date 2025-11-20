let furiganaX = [18, 31.5, 34, 58.5, 50, 72.5, 66, 82.5, 82, 91.5, 98, 102.5, 114, 110.5, 130, 122.5];
let furiganaY = [24, 16, 24, 16, 24, 16, 24, 16, 24, 16, 24, 16, 24, 16, 24, 16];
let furiganaS = [12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8, 12, 8];
let furiganaT = ["夢", "yume", "の", "no", "よ", "yo", "う", "u", "に", "ni", "愛", "ai", "し", "shi", "て", "te"];
let furiganaA = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
let mirageX = [15, 54, 65, 87, 111, 120, 33, 62, 97, 11, 46, 65, 87, 111, 120, 32, 55, 94, 9, 49, 64, 88, 113, 120, 34, 59, 103, 11, 50, 62, 83, 114, 119, 32, 61, 98, 10, 50, 65, 87, 116, 119, 29, 58, 94, 10, 51, 62, 88, 112, 123, 31, 59, 98, 10, 50, 66, 87, 112, 122, 31, 61, 97];
let mirageY = [13, 15, 13, 13, 16, 17, 27, 27, 33, 12, 12, 16, 10, 10, 16, 24, 25, 27, 14, 12, 14, 13, 14, 14, 30, 28, 33, 15, 12, 15, 11, 16, 12, 26, 29, 27, 17, 16, 15, 18, 15, 15, 30, 26, 31, 13, 13, 10, 10, 14, 14, 26, 28, 26, 14, 13, 13, 15, 15, 9, 29, 29, 12];
let mirageS = [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12];
let mirageT = ["that's ", "it ", "for ", "me ", "I ", "gotta ", "get ", "some ", "sleep ", "that's ", "it ", "for ", "me ", "I ", "gotta ", "get ", "some ", "sleep ", "that's ", "it ", "for ", "me ", "I ", "gotta ", "get ", "some ", "sleep ", "that's ", "it ", "for ", "me ", "I ", "gotta ", "get ", "some ", "sleep ", "that's ", "it ", "for ", "me ", "I ", "gotta ", "get ", "some ", "sleep ", "that's ", "it ", "for ", "me ", "I ", "gotta ", "get ", "some ", "sleep ", "that's ", "it ", "for ", "me ", "I ", "gotta ", "get ", "some ", "sleep "];
let mirageA = [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60];
let parallelX = [49, 45, 72, 68, 89, 93];
let parallelY = [14, 26, 14, 26, 14, 26];
let parallelS = [10, 10, 10, 10, 10, 10];
let parallelT = ["Get ", "Get ", "mo", "groo", "ving ", "ving "];
let parallelA = [255, 255, 255, 255, 255, 255];
let wideX = [-84, -78, -68, -54, -41, -32, -23, -11, -2, 5, 14, 29, 32, 40, 51, 63, 72, 88, 100, 110, 121, 136, 142, 152, 163, 177, 184, 197, 209, 217, 226, 234, -58, -48, -37, -27, -17, -7, 3, 9, 19, 30, 36, 46, 59, 64, 69, 75, 79, 89, 93, 98, 106, 118, 127, 137, 147, 159, 171, 183, 190, 197, 204, 209, 213, -87, -79, -67, -53, -43, -36, -26, -17, -5, 5, 13, 15, 29, 39, 52, 64, 76, 91, 96, 108, 118, 128, 141, 149, 162, 170, 186, 200, 211, 222, 231, 240, -97, -83, -75, -66, -53, -46, -33, -28, -15, -4, 8, 20, 34, 48, 54, 60, 73, 90, 102, 114, 120, 137, 148, 157, 170, 177, 188, 197, 211, 231, 243, 248, -66, -56, -52, -37, -27, -21, -14, -7, 5, 21, 30, 38, 57, 62, 69, 75, 88, 96, 104, 115, 126, 134, 142, 154, 166, 176, 184, 193, 207, 212, 218, 223, -91, -81, -69, -57, -45, -29, -19, -9, 2, 19, 30, 38, 49, 69, 76, 84, 95, 99, 106, 116, 126, 138, 150, 156, 166, 177, 186, 201, 212, 224, 231, 241, -63, -53, -44, -29, -22, -10, -3, 1, 14, 21, 26, 34, 42, 49, 61, 66, 79, 88, 97, 109, 119, 126, 135, 150, 160, 168, 173, 186, 198, 205, 210, 215, -78, -69, -62, -55, -42, -35, -24, -12, 1, 7, 23, 34, 48, 56, 65, 73, 86, 94, 100, 105, 116, 123, 130, 135, 147, 158, 174, 186, 197, 207, 218, 231];
let wideY = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50];
let wideS = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
let wideT = ["Al", "len ", "wren", "ches ", "ger", "bil ", "feed", "ers ", "toi", "let ", "seats ", "e", "lec", "tric ", "heat", "ers ", "trash ", "com", "pac", "tors ", "juice ", "ex", "trac", "tors ", "show", "er ", "rods ", "and ", "wa", "ter ", "me", "ters ", "Wal", "kie-", "talk", "ies ", "cop", "per ", "wi", "res ", "safe", "ty ", "gog", "gles ", "ra", "di", "al ", "ti", "res ", "B", "B ", "pel", "lets ", "rub", "ber ", "mal", "lets ", "fans ", "and ", "de", "hu", "mi", "di", "fi", "ers ", "Pic", "ture ", "hang", "ers ", "pa", "per ", "cut", "ters ", "waf", "fle ", "i", "rons ", "win", "dow ", "shut", "ters ", "paint ", "re", "mov", "ers ", "win", "dow ", "lou", "vers ", "ma", "sking ", "tape ", "and ", "plas", "tic ", "gut", "ters ", "Kitch", "en ", "fau", "cets ", "fol", "ding ", "ta", "bles ", "wea", "ther ", "strip", "ping ", "jump", "er ", "ca", "bles ", "hooks ", "and ", "tack", "le ", "grout ", "and ", "spa", "ckle ", "po", "wer ", "fog", "gers ", "spoons ", "and ", "la", "dles ", "Pes", "ti", "cides ", "for ", "fu", "mi", "ga", "tion ", "high-", "per", "for", "mance ", "lu", "bri", "ca", "tion ", "me", "tal ", "roof", "ing ", "wa", "ter", "proo", "fing ", "mul", "ti-", "pur", "pose ", "in", "su", "la", "tion ", "Air ", "com", "pres", "sors ", "brass ", "con", "nec", "tors ", "wreck", "ing ", "chi", "sels ", "smoke ", "de", "tec", "tors ", "ti", "re ", "gau", "ges ", "ham", "ster ", "ca", "ges ", "ther", "mo", "stats ", "and ", "bug ", "de", "flec", "tors ", "Trai", "ler ", "hitch ", "de", "mag", "ne", "ti", "zers ", "au", "to", "ma", "tic ", "cir", "cum", "ci", "sers ", "ten", "nis ", "rack", "ets ", "an", "gle ", "brack", "ets ", "Du", "ra", "cells ", "and ", "En", "er", "gi", "zers ", "Sof", "fit ", "pa", "nels ", "cir", "cuit ", "brea", "kers ", "va", "cuum ", "clea", "ners ", "cof", "fee ", "ma", "kers ", "cal", "cu", "la", "tors ", "ge", "ne", "ra", "tors ", "mat", "ching ", "salt ", "and ", "pep", "per ", "shak", "ers "];
let wideA = [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255];


let previews = [
    {
        title: "Romaji and Furigana",
        link: "furigana",
        description: "Useful for adding pronunciations to words. Built specifically for Japanese.",
        x: furiganaX,
        y: furiganaY,
        s: furiganaS,
        t: furiganaT,
        a: furiganaA
    },
    {
        title: "Mirage",
        link: "mirage",
        description: "Renders text multiple times at a low opacity to create a blurry effect.",
        x: mirageX,
        y: mirageY,
        s: mirageS,
        t: mirageT,
        a: mirageA
    },
    {
        title: "Parallel",
        link: "parallel",
        description: "Render 2 different phrases in tandem, syllable by syllable.",
        x: parallelX,
        y: parallelY,
        s: parallelS,
        t: parallelT,
        a: parallelA
    },
    {
        title: "Wide margin",
        link: "wide",
        description: "Exceed the horizontal bounds of the lyric display.",
        x: wideX,
        y: wideY,
        s: wideS,
        t: wideT,
        a: wideA
    }
]

function assemblePreview (previewElement) {
    for(let i = 0; i < previews.length; i++) {
        let root = document.getElementById("chapter-root");

        let chapter = root.appendChild(document.createElement("div"));
        chapter.classList.add("index-chapter");

        let left = chapter.appendChild(document.createElement("div"));
        left.classList.add("chapter-left");

        let label = left.appendChild(document.createElement("button"));
        label.textContent = previews[i].title;
        label.setAttribute("onclick", `document.location='${previews[i].link}'`);
        label.classList.add("chapter-label");

        let description = left.appendChild(document.createElement("div"));
        description.textContent = previews[i].description;
        description.classList.add("chapter-description");

        let right = chapter.appendChild(document.createElement("div"));
        right.classList.add("chapter-right");

        let container = right.appendChild(document.createElement("div"));
        container.classList.add("preview-sizer");

        let previewElement = container.appendChild(document.createElement("div"));
        previewElement.classList.add("preview-container");
        
        for(let j = 0; j < previews[i].x.length; j++) {
            appendToPreview(previewElement, previews[i].x[j], previews[i].y[j], 
                    previews[i].s[j], previews[i].t[j], previews[i].a[j]); 
        }
    }
}
assemblePreview();