import React, { useState } from "react";

function VideoPlayer() {
  const [error, setError] = useState(false);

  return (
    <div className="container mt-4">
      <h4>Secure Video Playback</h4>
      {error ? (
        <p className="text-danger">❌ Unable to load video.</p>
      ) : (
        <video
          controls
          width="100%"
          src="https://api.earnq.in/api/video-url?path=/videos/Birds.mp4&token=abc123"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
