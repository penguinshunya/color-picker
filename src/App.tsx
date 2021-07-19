import { useState } from "react";
import { useRef } from "react";
import { useCallback } from "react";

export const App: React.VFC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

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
  }, []);

  const [rgba, setRgba] = useState<Uint8ClampedArray | null>(null);

  const handleClickCanvas = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d")!;
    const data = ctx.getImageData(e.clientX, e.clientY, 1, 1);
    setRgba(data.data);
  }, []);

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} style={{
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      height: "100vh",
      overflow: "auto",
      position: "relative",
      width: "100%",
    }}>
      {rgba !== null && (
        <div style={{
          backgroundColor: `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`,
          height: 32,
          left: 0,
          position: "absolute",
          top: 0,
          width: 32,
        }} />
      )}
      <canvas onClick={handleClickCanvas} ref={canvasRef} style={{
        objectFit: "contain",
      }} />
    </div>
  );
};

export default App;
