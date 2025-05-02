"use client";

export function TechBackground() {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      <video
        src="/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-brightness-75"></div>
    </div>
  );
} 