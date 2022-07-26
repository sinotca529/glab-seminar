function process_tag() {
    const re = /(.*tag.html\?tag=)(.*)/;
    document.querySelectorAll("tag a")?.forEach((a) => {
        const match = re.exec(a.href);
        a.href = match[1] + encodeURIComponent(match[2])
    });
}

function process_quiz() {
    document.querySelectorAll("quiz")?.forEach((a) => {
        a.onclick = () => {
            a.style.color = a.style.color == "black" ? "" : "black";
        };
    });
}

function process_clone() {
    document.querySelectorAll("clone")?.forEach((a) => {
        a.replaceWith(document.getElementById(a.getAttribute("ref"))?.cloneNode(true));
    });
}

// Centering image.
function process_img() {
    document.querySelectorAll("img")?.forEach((a) => {
        a.outerHTML = `<div style="text-align: center;">${a.outerHTML}</div>`;
    });
}

window.addEventListener("DOMContentLoaded", () => {
    process_tag();
    process_quiz();
    process_clone();
    process_img();
});
