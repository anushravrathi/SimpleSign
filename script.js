document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("signatureCanvas");
    const context = canvas.getContext("2d");
    const inkColorInput = document.getElementById("inkColor");
    const bgColorInput = document.getElementById("bgColor");
    const fontSizeInput = document.getElementById("fontSize");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const transparentCheckbox = document.getElementById("transparent");

    let isDrawing = false;
    let isTransparent = true;
    let penSize = fontSizeInput.value / 10;

    context.font = `${fontSizeInput.value}px Arial`;

    function draw(e) {
        e.preventDefault(); // Prevent scrolling
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        context.strokeStyle = inkColorInput.value;
        context.lineWidth = penSize;
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }

    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        draw(e);
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);

    canvas.addEventListener("touchstart", (e) => {
        isDrawing = true;
        draw(e);
    });

    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", () => isDrawing = false);
    canvas.addEventListener("touchcancel", () => isDrawing = false);

    clearBtn.addEventListener("click", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        transparentCheckbox.checked = true;
        isTransparent = true;
    });

    downloadBtn.addEventListener("click", () => {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "signature.png";
        link.click();
    });

    inkColorInput.addEventListener("change", () => {
        context.strokeStyle = inkColorInput.value;
    });

    bgColorInput.addEventListener("change", () => {
        if (transparentCheckbox.checked) {
            transparentCheckbox.checked = false;
        }
    });

    fontSizeInput.addEventListener("input", () => {
        context.font = `${fontSizeInput.value}px Arial`;
        penSize = fontSizeInput.value / 10;
    });

    transparentCheckbox.addEventListener("change", () => {
        if (transparentCheckbox.checked) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            isTransparent = true;
        } else {
            isTransparent = false;
            context.fillStyle = bgColorInput.value;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    });
});
