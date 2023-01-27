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
    let seq_id = 0;
    document.querySelectorAll("img")?.forEach((a) => {
        const id = "float-img" + seq_id;
        seq_id += 1;

        a.outerHTML = `
            <input type="checkbox" class="toggle-float" id="${id}">
            <label for="${id}" class="overlay">
              <label class="float-window">
                <div style="text-align: center; background-color: var(--c-first);">
                  <img itemprop="image" loading="lazy" src="${a.src}" style="width: 80vw;" />
                </div>
              </label>
            </label>
            <label for="${id}">
                <div style="text-align: center;">${a.outerHTML}</div>
            </label>
        `;

        // a.outerHTML = `<div style="text-align: center;">${a.outerHTML}</div>`;
    });
}

window.addEventListener("DOMContentLoaded", () => {
    process_tag();
    process_quiz();
    process_clone();
    process_img();
});
