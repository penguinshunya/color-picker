import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Row } from "./Row";

interface Point {
  x: number;
  y: number;
}

function initPoint(): Point {
  return { x: 0, y: 0 };
}

function toHex(val: number) {
  return ("00" + val.toString(16)).slice(-2);
}

interface Props {
  color: {
    r: number;
    g: number;
    b: number;
  } | null;
}

export const DraggableColorBox: React.VFC<Props> = ({
  color,
}) => {
  const [anchor, setAnchor] = useState<Point | null>(null);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [position, setPosition] = useState<Point>(initPoint());

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setAnchor({ x: e.clientX, y: e.clientY });
    setOrigin(position);
  }, [position]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (origin === null || anchor === null) {
        return;
      }
      const x = origin.x + (e.clientX - anchor.x);
      const y = origin.y + (e.clientY - anchor.y);
      setPosition({ x: Math.max(x, 0), y: Math.max(y, 0) });
    }
    function handleMouseUp() {
      setAnchor(null);
      setOrigin(null);
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [anchor, origin]);

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(0, 0, 0, 0.5)",
        display: "grid",
        left: position.x,
        padding: 4,
        position: "fixed",
        rowGap: 4,
        top: position.y,
      }}
    >
      {color === null ? (
        <>画像内のピクセルをクリック</>
      ) : (
        <>
          <div
            onMouseDown={handleMouseDown}
            style={{
              backgroundColor: `#${toHex(color.r)}${toHex(color.g)}${toHex(
                color.b
              )}`,
              border: "1px solid rgba(0, 0, 0, 0.5)",
              cursor: "move",
              height: "calc(1em + 8px)",
            }}
          ></div>
          <Row
            label="HEX"
            text={`#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`}
          />
          <Row
            label="RGBA"
            text={`rgba(${color.r}, ${color.g}, ${color.b}, 1.0)`}
          />
        </>
      )}
    </div>
  );
};

export default DraggableColorBox;
