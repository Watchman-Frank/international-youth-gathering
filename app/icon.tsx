import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1B2A4A",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 18 18" fill="none">
          <path d="M9 2L11.5 7H16L12.5 10.5L14 15.5L9 12.5L4 15.5L5.5 10.5L2 7H6.5L9 2Z" fill="#F2B134" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
