import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0E2F2C",
          color: "#F8F6F2",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700 }}>Triumph Kia Teh</div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.9 }}>
          Writing, impact, and research
        </div>
      </div>
    ),
    { ...size },
  );
}
