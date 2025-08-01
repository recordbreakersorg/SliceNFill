import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import Color from "../../lib/color";
import Editor, { EditorMode } from "../../lib/editor";
import Image, { ImageInfo } from "../../lib/image";
import "./ImageView.sass";

// --- Helper Functions ---

function syncCanvasSize(canvas: HTMLCanvasElement) {
  if (
    canvas.width !== canvas.clientWidth ||
    canvas.height !== canvas.clientHeight
  ) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
}

type ImageViewState = "initializing" | "loading" | "ready" | "error";

// --- Component ---

export default function ImageView({
  imageInfo,
  editor,
}: {
  imageInfo: ImageInfo;
  editor: Editor;
}) {
  const editorMode = useSyncExternalStore(
    (callback) => editor.mode.subscribe(callback),
    () => editor.mode.getSnapshot(),
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const [status, setStatus] = useState<ImageViewState>("initializing");

  // Refs for interaction state to avoid re-renders on every change
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const mouseDownInfoRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // The main drawing function, wrapped in useCallback for performance
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    if (!canvas || !offscreenCanvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cancel any pending animation frame to avoid multiple draw calls
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    animationFrameIdRef.current = requestAnimationFrame(() => {
      syncCanvasSize(canvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const { scale, translation } = editor.view;
      const centeredX = canvas.width / 2 - (imageInfo.width * scale.x) / 2;
      const centeredY = canvas.height / 2 - (imageInfo.height * scale.y) / 2;

      ctx.translate(centeredX + translation.x, centeredY + translation.y);
      ctx.scale(scale.x, scale.y);
      ctx.drawImage(offscreenCanvas, 0, 0);
      ctx.restore();
    });
  }, [editor, imageInfo]);

  // Effect for initializing the offscreen canvas and loading the image
  useEffect(() => {
    setStatus("loading");
    const offscreenCanvas = new OffscreenCanvas(
      imageInfo.width,
      imageInfo.height,
    );
    offscreenCanvasRef.current = offscreenCanvas;
    const oCtx = offscreenCanvas.getContext("2d");

    if (!oCtx) {
      setStatus("error");
      console.error("Could not get OffscreenCanvas 2D context.");
      return;
    }

    imageInfo
      .getImage()
      .then((image: Image) => {
        const imageData = new ImageData(
          offscreenCanvas.width,
          offscreenCanvas.height,
        );
        imageData.data.set(image.data);
        // @ts-ignore
        oCtx.putImageData(imageData, 0, 0);
        setStatus("ready");
        draw();
      })
      .catch((err) => {
        setStatus("error");
        console.error("Failed to load image data:", err);
      });
  }, [imageInfo, draw]);

  // Effect for setting up all event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || status !== "ready") return;

    const getTransformedMouseCoords = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const { scale, translation } = editor.view;
      const centeredX = canvas.width / 2 - (imageInfo.width * scale.x) / 2;
      const centeredY = canvas.height / 2 - (imageInfo.height * scale.y) / 2;

      const unpannedX = clickX - (centeredX + translation.x);
      const unpannedY = clickY - (centeredY + translation.y);

      const offscreenX = Math.round(unpannedX / scale.x);
      const offscreenY = Math.round(unpannedY / scale.y);

      return { offscreenX, offscreenY };
    };

    const handleImageClick = (e: MouseEvent) => {
      const { offscreenX, offscreenY } = getTransformedMouseCoords(e);

      if (
        offscreenX < 0 ||
        offscreenX >= imageInfo.width ||
        offscreenY < 0 ||
        offscreenY >= imageInfo.height
      ) {
        return; // Click was outside the image
      }

      const oCtx = offscreenCanvasRef.current?.getContext("2d");
      if (!oCtx) return;

      // @ts-ignore
      const pixelData = oCtx.getImageData(offscreenX, offscreenY, 1, 1).data;
      const color = new Color(
        `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${
          pixelData[3] / 255
        })`,
      );

      switch (editor.mode.getValue()) {
        case EditorMode.Pick:
          editor.params.colors.update((colors) => {
            if (e.shiftKey) colors.secondary.push(color);
            else colors.primary.push(color);
            return colors;
          });
          break;
        // ... other editor modes
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      isDraggingRef.current = true;
      canvas.style.cursor = "grabbing";
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      mouseDownInfoRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || e.button !== 0) return;
      e.preventDefault();

      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      if (e.ctrlKey) {
        // Zoom
        const zoomFactor = 1 + deltaX * 0.005;
        const newScale = editor.view.scale.x * zoomFactor;
        if (newScale > 0.05 && newScale < 100) {
          editor.view.scale.x = editor.view.scale.y = newScale;
        }
      } else {
        // Pan
        editor.view.translation.x += deltaX;
        editor.view.translation.y += deltaY;
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      draw();
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";

      const downInfo = mouseDownInfoRef.current;
      if (downInfo) {
        const travelDist = Math.sqrt(
          Math.pow(e.clientX - downInfo.x, 2) +
            Math.pow(e.clientY - downInfo.y, 2),
        );
        const timeDiff = Date.now() - downInfo.time;
        if (timeDiff < 200 && travelDist < 5) {
          handleImageClick(e);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = 1 - e.deltaY * 0.001;
      const newScale = editor.view.scale.x * zoomFactor;
      if (newScale > 0.05 && newScale < 100) {
        editor.view.scale.x = editor.view.scale.y = newScale;
        draw();
      }
    };

    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(draw, 100);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel);
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove all listeners
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [status, editor, imageInfo, draw]);

  return (
    <div className="container">
      <canvas ref={canvasRef} style={{ cursor: "grab" }}>
        Canvas not supported
      </canvas>
      {status !== "ready" && (
        <div className="status-overlay">
          <p>{status === "loading" ? "Loading Image..." : "Error"}</p>
        </div>
      )}
    </div>
  );
}
