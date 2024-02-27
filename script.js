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
    let lastX = 0;
    let lastY = 0;
    let isTransparent = true;
    let penSize = fontSizeInput.value / 10;

    context.font = `${fontSizeInput.value}px Arial`;

    function draw(e) {
        if (!isDrawing) return;
        context.strokeStyle = inkColorInput.value;
        context.lineWidth = penSize;
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
        context.stroke();
        [lastX, lastY] = [e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY];
    }

    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.clientX, e.clientY];
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);

    canvas.addEventListener("touchstart", (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.touches[0].clientX, e.touches[0].clientY];
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
        transparentCheckbox.checked = false; // Uncheck transparent when ink color changes
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
            context.fillStyle = "rgba(0, 0, 0, 0)";
            isTransparent = true;
        } else {
            context.fillStyle = bgColorInput.value;
            isTransparent = false;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
    });
});
