const resize = () => {
    iframe.width = iframe.height = Math.min(innerHeight, innerWidth);
};
const hideInstructions = () => {
    instructions.style.display = "none";
    iframe.focus();
};
const init = () => {
    iframe = document.getElementById("iframe");
    instructions = document.getElementById("instructions");
    window.addEventListener("resize", () => requestAnimationFrame(resize));
    resize();
    setTimeout(hideInstructions, 5e3);
};

let iframe;
let instructions;

document.addEventListener("DOMContentLoaded", init);
