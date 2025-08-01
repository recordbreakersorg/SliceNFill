import { useEffect, useRef, useState } from "react";
import Editor from "../../lib/editor";
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
  function draw() {
    let canvas = canvasRef.current;
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
      centeredX + editor.view.transtation.x,
      centeredY + editor.view.transtation.y,
    );
    ctx.scale(editor.view.scale.x, editor.view.scale.y);

    // Draw the offscreen canvas onto the main canvas
    // The offscreenCanvas itself is drawn at its own (0,0) relative to the
    // current transformed context origin.
    ctx.drawImage(offscreenCanvas, 0, 0);
    ctx.restore();
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
      // now drawing image
      draw();
    });
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      setTimeout(() => {
        syncCanvasSize(canvas);
      }, 500);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return (
    <div className="container">
      <canvas ref={canvasRef} width={imageInfo.width} height={imageInfo.height}>
        Canvas not supported(This should not happen)
      </canvas>
    </div>
  );
}
