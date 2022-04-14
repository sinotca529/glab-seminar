window.addEventListener("DOMContentLoaded", function() {
    // process tag.
    let re = /(.*tag.html\?tag=)(.*)/;
    document.querySelectorAll("tag a")
        .forEach(function(a) {
            let match = re.exec(a.href);
            a.href = match[1] + encodeURIComponent(match[2])
        });

    // pseudo.js
    document.querySelectorAll(".myalgorithmic")
        .forEach(function(a) {
            let code = a.textContent;
            let options = {
                lineNumber: true
            };
            pseudocode.render(code, a, options);
        });
});
