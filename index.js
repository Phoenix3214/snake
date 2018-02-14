var iframe = document.getElementById("iframe");
var instructions = document.getElementById("instructions");
var resize;

window.addEventListener("resize", resize = function() {
    iframe.height = Math.min(window.innerHeight, window.innerWidth);
    iframe.width = iframe.height;

    instructions.style.left = (window.innerWidth - instructions.offsetWidth) / 2 + "px";
    instructions.style.top = (window.innerHeight - instructions.offsetHeight) / 2 + "px";
});
resize();

setTimeout(function() {
    instructions.style.display = "none";
    if (iframe.focus) {
        iframe.focus();
    }
    if (iframe.contentWindow) {
        iframe.contentWindow.focus();
    } else if (iframe.contentDocument && iframe.contentDocument.documentElement) {
        // For old versions of Safari
        iframe.contentDocument.documentElement.focus();
    }
}, 5000);
