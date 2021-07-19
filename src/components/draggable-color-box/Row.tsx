import { Input } from "./Input";

export const Row: React.VFC<{ label: string; text: string }> = ({ label, text }) => {
  return (
    <label
      style={{
        alignItems: "center",
        columnGap: "4px",
        display: "grid",
        gridTemplateColumns: "64px 1fr",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          textAlign: "right",
        }}
      >
        {label}
      </span>
      <Input type="text" readOnly value={text} />
    </label>
  );
};
