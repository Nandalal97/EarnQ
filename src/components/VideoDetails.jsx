import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VideoDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoId = location.state?.videoId;
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!videoId) {
      navigate('/'); // No ID passed? Go back home.
      return;
    }

    fetch('/videos.json')
      .then(res => res.json())
      .then(data => {
        const match = data.videos.find(v => v.id === videoId);
        setVideo(match);
        // console.log(match);
      })
      .catch(err => console.error('Error loading video:', err));
  }, [videoId, navigate]);

  if (!video) return <div className="container mt-4">❌ Video not found.</div>;

  const secureUrl = `http://localhost:5000/api/video-url?path=/${video.videoPath}&token=abc123`;
  return (
    <>
      <div className="page-wrapper">
        <div className="content-row">
          <main className="app-container">
            {error ? (
              <p className="text-danger">❌ Unable to load video.</p>
            ) : (
              <video
                controls
                width="100%"
                src={secureUrl}
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                onError={() => setError(true)}
              />

            )}
            <h2 className='text-xlg mb-0'>{video.class}: {video.title}</h2>
            <p className="mt-0">{video.description}</p>


          </main>
        </div>
      </div>
    </>

  );
}

export default VideoDetail;
