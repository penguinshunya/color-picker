import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useCallback } from "react";
import DraggableColorBox from "./components/draggable-color-box";

export const App: React.VFC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [isDrop, setIsDrop] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length === 0) {
      return console.error("ファイルが選択されていません");
    }
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      return console.error("ファイルが画像ではありません");
    }
    const result = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") {
          reject("読み込んだファイルが意図しない型です");
          return;
        }
        resolve(reader.result);
      });
      reader.readAsDataURL(file);
    });
    const image = await new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => {
        resolve(image);
      });
      image.src = result;
    });
    canvasRef.current.width = image.width;
    canvasRef.current.height = image.height;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    setIsDrop(true);
  }, []);

  const [color, setColor] = useState<null | {
    r: number;
    g: number;
    b: number;
  }>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cvs = canvasRef.current;
      const ctx = cvs.getContext("2d")!;

      const rect = cvs.getBoundingClientRect();
      const x = e.clientX - (rect.left + window.pageXOffset);
      const y = e.clientY - (rect.top + window.pageYOffset);
      const data = ctx.getImageData(x, y, 1, 1);
      setColor({
        r: data.data[0],
        g: data.data[1],
        b: data.data[2],
      });
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsMouseDown(true);
      handleMouseEvent(e);
    },
    [handleMouseEvent]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isMouseDown) {
        handleMouseEvent(e);
      }
    },
    [handleMouseEvent, isMouseDown]
  );

  useEffect(() => {
    function handleMouseUp() {
      setIsMouseDown(false);
    }
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        width: "100%",
      }}
    >
      {!isDrop ? (
        <div
          style={{
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          ここに画像ファイルをドロップ
        </div>
      ) : (
        <DraggableColorBox color={color} />
      )}
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        style={{
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default App;
