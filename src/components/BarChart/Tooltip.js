export default function Tooltip({ visible, title, text, x, y }) {
  return (
    <div
      style={{
        display: visible ? "block" : "none",
        position: "fixed",
        top: y + "px",
        left: x + "px",
        pointerEvents: "none",
        textAlign: "center",
      }}
    >
      <p
        style={{
          maxWidth: "140px",
          maxHeight: "100px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          display: "inline-block",
          borderRadius: 4,
          margin: "0",
          padding: "6px",
          backgroundColor: "rgba(240,240,240,0.9)",
        }}
      >
        <b>{title}</b>
        <br />
        {text}
      </p>
    </div>
  );
}
