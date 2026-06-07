'use client';

import { useEffect, useRef } from 'react';

export default function VideoPlayer({ streamUrl }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamUrl && videoRef.current) {
      videoRef.current.src = streamUrl;
      videoRef.current.play().catch((error) => console.log('Auto-play blocked:', error));
    }
  }, [streamUrl]);

  return (
    <div className="bg-black rounded-lg overflow-hidden aspect-video">
      <video id="liveVideo" ref={videoRef} className="w-full h-full" autoPlay muted playsInline />
    </div>
  );
}
