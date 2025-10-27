import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VideoListPage() {
  const [videosData, setVideosData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const navigate = useNavigate();

  // Load video data from JSON
  useEffect(() => {
    fetch("/videos.json")
      .then((res) => res.json())
      .then((data) => {
        setVideosData(data.videos);
        setFilteredVideos(data.videos);
      })
      .catch((err) => console.error("Failed to load videos:", err));
  }, []);

  // Apply filtering logic
  useEffect(() => {
    let filtered = videosData;

    if (selectedClass !== "All") {
      filtered = filtered.filter((video) => video.class === selectedClass);

      if (selectedLanguage !== "All") {
        filtered = filtered.filter(
          (video) => video.language === selectedLanguage
        );
      }
    } else {
      if (selectedLanguage !== "All") {
        filtered = filtered.filter(
          (video) => video.language === selectedLanguage
        );
      }
    }

    setFilteredVideos(filtered);
  }, [selectedClass, selectedLanguage, videosData]);

  // Navigate to video detail page with slug
  const handleVideoClick = (video) => {
    const classSlug = video.class.toLowerCase().replace(/\s+/g, "-");
    const titleSlug = video.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/video/${classSlug}/${titleSlug}`, {
      state: { videoId: video.id },
    });
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content-row">
          <main className="app-container">
            <h2 className="mb-2">Watch Learning Videos</h2>
            <p className="text-muted mb-2">
              Browse educational videos by selecting a class and preferred
              language. Use the dropdown filters above to find learning content
              tailored for Class KG to Class 12 students in English or Hindi.
              Click on any video thumbnail to start learning.
            </p>

            {/* Filters */}
            <div className="mb-4 d-flex gap-4 align-items-end flex-wrap">
              {/* Class Filter */}
              <div>
                <label htmlFor="classDropdown" className="form-label">
                  Select Class:
                </label>
                <select
                  id="classDropdown"
                  className="form-select w-auto py-0"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Class-KG">Class kg</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`Class-${i + 1}`}>{`Class ${
                      i + 1
                    }`}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label htmlFor="languageDropdown" className="form-label">
                  Select Language:
                </label>
                <select
                  id="languageDropdown"
                  className="form-select w-auto py-0"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            {/* Video Grid */}
            <div className="row g-2">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <div key={video.id} className="col-sm-6 col-md-4">
                    <div
                      className="text-center"
                      onClick={() => handleVideoClick(video)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={video.thumbnail}
                        className="card-img-top"
                        alt={video.title}
                      />
                      <div className="pt-2">
                        <h6 className="text-sm mb-0">{video.title}</h6>
                        <p className="d-flex gap-3 justify-content-center">
                          <small className="text-muted">{video.class}</small>{" "}
                          <small className="text-muted">{video.language}</small>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center mt-4">
                  <p className="text-muted text-lg">
                    No videos available for the selected filters.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default VideoListPage;
