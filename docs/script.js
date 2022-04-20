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
                const begin = '<span style="color:black;">';
                const end = '</span>';
                const content = a.innerHTML;
                if (content.startsWith(begin)) {
                    a.innerHTML = content.slice(begin.length, -end.length)
                }
                else {
                    a.innerHTML = begin + a.innerHTML + end;
                }
            })
        });
});
