const resize = () => {
    iframe.height = Math.min(window.innerHeight, window.innerWidth);
    iframe.width = iframe.height;

    instructions.style.left = (window.innerWidth - instructions.offsetWidth) / 2 + "px";
    instructions.style.top = (window.innerHeight - instructions.offsetHeight) / 2 + "px";
};
const hideInstructions = () => {
    instructions.style.display = "none";
    if (iframe.focus) {
        iframe.focus();
    } else if (iframe.contentWindow) {
        iframe.contentWindow.focus();
    } else if (iframe.contentDocument && iframe.contentDocument.documentElement) {
        // For old versions of Safari
        iframe.contentDocument.documentElement.focus();
    }
};

let iframe;
let instructions;

document.addEventListener("DOMContentLoaded", () => {
    iframe = document.getElementById("iframe");
    instructions = document.getElementById("instructions");
    window.addEventListener("resize", () => requestAnimationFrame(resize));
    resize();
    setTimeout(hideInstructions, 5e3);
});
