import { useCallback } from "react";

export const Input: React.VFC<JSX.IntrinsicElements["input"]> = ({ ...props }) => {
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return (
    <input
      {...props}
      onFocus={handleFocus}
      style={{
        border: "1px solid rgba(0, 0, 0, 0.5)",
        borderRadius: 4,
        fontFamily: "monospace",
        padding: "4px 8px",
        width: 256,
      }}
    />
  );
};
