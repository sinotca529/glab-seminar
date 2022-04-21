window.addEventListener("DOMContentLoaded", function() {
    // process tag.
    let re = /(.*tag.html\?tag=)(.*)/;
    document.querySelectorAll("tag a")
        .forEach(function(a) {
            let match = re.exec(a.href);
            a.href = match[1] + encodeURIComponent(match[2])
        });

    document.querySelectorAll("quiz")
        .forEach(function(a) {
            a.addEventListener("click", function onClick(_event) {
                const current = a.style.color;
                if (current == "black") {
                    a.style.color = "";
                } else {
                    a.style.color = "black";
                }
            });
        });
});
