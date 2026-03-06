import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FontGen - AI Font Generator from Handwriting';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
          }}
        >
          FontGen
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
            marginBottom: 40,
          }}
        >
          AI Font Generator from Handwriting
        </div>
        <div
          style={{
            display: 'flex',
            gap: 24,
            fontSize: 20,
            color: '#64748b',
          }}
        >
          <span>Write</span>
          <span style={{ color: '#3b82f6' }}>→</span>
          <span>Upload</span>
          <span style={{ color: '#3b82f6' }}>→</span>
          <span>Get .OTF Font</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
