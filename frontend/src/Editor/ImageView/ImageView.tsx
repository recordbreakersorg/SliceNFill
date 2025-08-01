import { useEffect, useRef, useState } from "react";
import Color from "../../lib/color";
import Editor, { EditorMode } from "../../lib/editor";
import Image, { ImageInfo } from "../../lib/image";
import "./ImageView.sass";
let n = 0,
  a = 0,
  b = 0,
  c = 0;

function syncCanvasSize(canvas: HTMLCanvasElement) {
  if (
    canvas.width !== canvas.clientWidth ||
    canvas.height !== canvas.clientHeight
  ) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
}
type ImageViewState =
  | "initializing"
  | "loading"
  | "ready"
  | "reloading"
  | "unset"
  | "error"
  | "reloading";

function drawImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  editor: Editor,
  imageInfo: ImageInfo,
  offscreenCanvas: OffscreenCanvas,
) {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the main canvas
  ctx.save(); // Save the current canvas state

  // Calculate initial centering offsets for the image
  const centeredX =
    canvas.width / 2 - (imageInfo.width * editor.view.scale.x) / 2;
  const centeredY =
    canvas.height / 2 - (imageInfo.height * editor.view.scale.y) / 2;

  // Apply transformations:
  // 1. Translate to center the image, then apply user's pan (translateX/Y)
  // 2. Scale (zoom) the image
  ctx.translate(
    centeredX + editor.view.translation.x,
    centeredY + editor.view.translation.y,
  );
  ctx.scale(editor.view.scale.x, editor.view.scale.y);

  // Draw the offscreen canvas onto the main canvas
  // The offscreenCanvas itself is drawn at its own (0,0) relative to the
  // current transformed context origin.
  ctx.drawImage(offscreenCanvas, 0, 0);
  ctx.restore();
}
function drawStatus(
  currentStatus: ImageViewState,
  statusMessage: string,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = currentStatus === "error" ? "#f87171" : "#a0aec0"; // Red for error, gray for waiting
  ctx.textAlign = "center";
  ctx.fillText(statusMessage, canvas.width / 2, canvas.height / 2);
}

export default function ImageView({
  imageInfo,
  editor,
}: {
  imageInfo: ImageInfo;
  editor: Editor;
}) {
  let ctx: CanvasRenderingContext2D | null = null;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<ImageViewState>("initializing");
  const offscreenCanvas: OffscreenCanvas = new OffscreenCanvas(
    imageInfo.width,
    imageInfo.height,
  );
  const oCtx: OffscreenCanvasRenderingContext2D = offscreenCanvas.getContext(
    "2d",
  ) as OffscreenCanvasRenderingContext2D;

  if (!oCtx)
    return (
      <p>Error loading offscreen canvas context. This should not happen.</p>
    );
  const draw = () =>
    drawImage(canvasRef.current!, ctx!, editor, imageInfo, offscreenCanvas);
  function debouncedRedraw() {
    syncCanvasSize(canvasRef.current!);
    draw();
  }
  let isDragging: boolean = false;

  let downat: number = 0;
  let downVect: number = 0;
  let lastMouseX: number = 0,
    lastMouseY: number = 0;

  function imageClickAt(
    px: number,
    py: number,
    e: MouseEvent,
    touchedColor: Color,
  ) {
    switch (editor.mode.getValue()) {
      case EditorMode.Pick:
        console.log("setting color to", touchedColor);
        if (!e.shiftKey) {
          editor.params.colors.update((colors) =>
            colors.primary.push(touchedColor),
          );
        } else {
          editor.params.colors.update((colors) =>
            colors.secondary.push(touchedColor),
          );
        }
        break;
      case EditorMode.Fill:
        console.log("[js:view] Querying floodfill");
        break;
      case EditorMode.Replace:
        console.log("[js:view] Querying replaceColor");
    }
  }

  function canvasClick(e: MouseEvent) {
    const canvas = canvasRef.current;
    if (!ctx || !oCtx || !offscreenCanvas || !canvas) {
      console.warn("Canvas context or offscreen canvas/image data not ready.");
      return;
    }

    // Get mouse click coordinates relative to the main canvas element
    // @ts-ignore
    const clickX = e.layerX;
    // @ts-ignore
    const clickY = e.layerY;
    // Get the clicked color
    const canvData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Calculate the starting index for the clicked pixel's RGBA data in the array
    const clickedPixelOffset = (clickY * canvas.width + clickX) * 4;

    // Get the color of the clicked pixel on the offscreen canvas
    const r = canvData[clickedPixelOffset + 0],
      g = canvData[clickedPixelOffset + 1],
      b = canvData[clickedPixelOffset + 2],
      a = canvData[clickedPixelOffset + 3];

    // --- Reverse Transformations to get Offscreen Canvas Coordinates ---
    // These steps reverse the operations performed in the `draw` function.

    // 1. Calculate the current centered offsets *with* the current scale
    const currentCenteredX =
      canvas.width / 2 - (imageInfo.width * editor.view.scale.x) / 2;
    const currentCenteredY =
      canvas.height / 2 - (imageInfo.height * editor.view.scale.y) / 2;

    // 2. Undo the user's pan (translateX, translateY) and the initial centering
    // This gives us coordinates relative to the top-left of the *scaled* image
    // on the main canvas, before any user pan.
    const unpannedX = clickX - (currentCenteredX + editor.view.translation.x);
    const unpannedY = clickY - (currentCenteredY + editor.view.translation.y);

    // 3. Undo the scaling (zoom) to get coordinates on the original offscreen image
    let offscreenPx = unpannedX / editor.view.scale.x;
    let offscreenPy = unpannedY / editor.view.scale.y;

    // Round to the nearest whole pixel, as image data works with integers
    offscreenPx = Math.round(offscreenPx);
    offscreenPy = Math.round(offscreenPy);

    // Ensure calculated coordinates are within the bounds of the offscreen image
    if (
      offscreenPx < 0 ||
      offscreenPx >= offscreenCanvas.width ||
      offscreenPy < 0 ||
      offscreenPy >= offscreenCanvas.height
    ) {
      return; // Click was outside the image boundaries
    }

    imageClickAt(
      offscreenPx,
      offscreenPy,
      e,
      new Color(`rgba(${r}, ${g}, ${b}, ${a / 255})`),
    );
  }

  function handleMouseUp(e: MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDragging = false;
    canvas.style.cursor = "grab";
    let theta = Math.abs(
      downVect - Math.sqrt(e.clientX * e.clientX + e.clientY * e.clientY),
    );
    if (Date.now() - downat < 300 && theta < 10) {
      canvasClick(e);
    }
  }
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvasRef.current!.style.cursor = "grabbing";

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.style.cursor = "grabbing";
    downat = Date.now();
    downVect = Math.sqrt(lastMouseX * lastMouseX + lastMouseY * lastMouseY);
  }
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;

    if (e.ctrlKey) {
      const zoomFactor = 1 + deltaX * 0.005;
      const newScale = editor.view.scale.x * zoomFactor;

      if (newScale > 0.05 && newScale < 100) {
        editor.view.scale.x = editor.view.scale.y = newScale;
      }
    } else {
      editor.view.translation.x += deltaX;
      editor.view.translation.y += deltaY;
    }

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    requestAnimationFrame(draw); // Request redraw after state change
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    syncCanvasSize(canvas);
    ctx = canvas.getContext("2d");
    if (!ctx) return;

    setStatus("loading");

    imageInfo.getImage().then((image: Image) => {
      const imageData = new ImageData(
        offscreenCanvas.width,
        offscreenCanvas.height,
      );
      imageData.data.set(image.data);
      oCtx.putImageData(imageData, 0, 0);
      draw();
    });

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(debouncedRedraw, 100);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  let resizeTimeout: ReturnType<typeof setTimeout>;
  return (
    <div className="container">
      <canvas ref={canvasRef} width={imageInfo.width} height={imageInfo.height}>
        Canvas not supported(This should not happen)
      </canvas>
    </div>
  );
}
