import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import API from "../utils/axios";

const EXPIRE_SECONDS = 30; // signed URL expires in 30 seconds

const BookReaderSecure = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [book] = useState(location.state?.book || null);
  const bookId = book?.bookId || new URLSearchParams(location.search).get("bookId");
  const watermarkText = "© Earnq";

  const [totalPages, setTotalPages] = useState(book?.totalPages || 0);
  const token = getAuthToken();
  const decoded = token ? decodeToken(token) : null;
  const userId = decoded?.id;

  const [page, setPage] = useState(1);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [jumpInput, setJumpInput] = useState("");

  const imgCache = useRef(new Map()); // { page: {url, timestamp} }

  // Fetch total pages if missing
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return;
      try {
        const res = await API.get(`/books/${bookId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.totalPages) setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching book details:", err);
      }
    };
    if (!totalPages) fetchBookDetails();
  }, [bookId, token, totalPages]);

  // Fetch single page URL with cache & expire handling
  const fetchPageUrl = useCallback(
    async (p, setToState = true) => {
      if (!bookId || !userId) return;

      const now = Date.now();
      const cached = imgCache.current.get(p);

      // 1️⃣ Show cached instantly if valid
      if (cached && now - cached.timestamp < EXPIRE_SECONDS * 1000) {
        if (setToState) {
          setUrl(cached.url);
          setLoading(false);
        }
        return;
      }

      if (setToState && !cached) setLoading(true);

      try {
        const res = await API.get(`/books/${userId}/${bookId}/page/${p}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.url) {
          imgCache.current.set(p, { url: res.data.url, timestamp: now });
          if (setToState) setUrl(res.data.url);
        } else {
          alert("Access denied");
          navigate("/my-books");
        }
      } catch (err) {
        console.error("Error loading page:", err);
        if (setToState && !cached) alert("Error loading book page.");
      } finally {
        if (setToState) setLoading(false);
      }
    },
    [bookId, userId, token, navigate]
  );

  // Load current page & prefetch next page
  useEffect(() => {
  // only fetch when page changes normally, not during jump
  fetchPageUrl(page, true);
  if (page + 1 <= totalPages) {
    setTimeout(() => fetchPageUrl(page + 1, false), 1); // prefetch next
  }
}, [page, totalPages, fetchPageUrl]);



  // Refresh signed URL every EXPIRE_SECONDS for current page
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPageUrl(page, true);
    }, EXPIRE_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [page, fetchPageUrl]);


  // Navigation
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    setJumpInput("");
  };

  const handleNext = () => handlePageChange(page + 1);
  const handlePrev = () => handlePageChange(page - 1);
  // Jump handler
// Jump handler
const handleJump = async () => {
  const n = parseInt(jumpInput, 10);
  if (!isNaN(n) && n >= 1 && n <= totalPages) {
    setJumpInput("");

    // Show loader while fetching target page
    setLoading(true);

    try {
      // Fetch target page URL and update UI instantly when done
      await fetchPageUrl(n, true);
      setPage(n);

      // Prefetch next page silently
      if (n + 1 <= totalPages) fetchPageUrl(n + 1, false);
    } finally {
      setLoading(false);
    }
  }
};


  // Watermark
  const watermarkBg = useMemo(() => {
    const svg = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
        <text x='50%' y='40%' dominant-baseline='middle' text-anchor='middle'
          font-size='46' font-family='Arial, sans-serif' fill='rgba(0,0,0,0.30)' transform='rotate(-20, 400, 200)'>
          ${watermarkText}
        </text>
      </svg>`
    );
    return `url("data:image/svg+xml,${svg}")`;
  }, [watermarkText]);

  // Disable right click / print / screenshot
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert("Saving/Printing disabled");
      }
      if (e.key === "PrintScreen") {
        alert("Screenshots disabled");
        navigator.clipboard.writeText("");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container my-2 p-0">
          <div
            className="position-relative border-0 mx-auto d-flex align-items-center justify-content-center"
            style={{
              width: "100%",
              maxWidth: "794px",
              aspectRatio: "210 / 297",
              backgroundColor: "#fff",
              overflow: "hidden",
            }}
          >
            {/* Watermark */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                zIndex: 10,
                pointerEvents: "none",
                backgroundImage: watermarkBg,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "50%",
              }}
            />

            {/* Loader */}
            {loading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white">
                <div className="spinner-border text-primary" role="status" />
              </div>
            )}

            {/* Page Image */}
            {url && (
              <img
                src={url}
                alt={`Page ${page}`}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                }}
                onLoad={() => setLoading(false)}
                onDragStart={(e) => e.preventDefault()}
              />
            )}
          </div>

          {/* Controls */}
          <div className="mt-2 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
            <button
              className={`btn py-0 px-2 text-xsm ${page === 1 ? "btn-secondary" : "btn-primary"}`}
              disabled={page === 1}
              onClick={handlePrev}
            >
              ← Prev
            </button>

            <div className="input-group" style={{ width: 160 }}>
              <input
                type="text"
                className="form-control py-1"
                placeholder="Page No."
                value={jumpInput}
                onChange={(e) => /^\d*$/.test(e.target.value) && setJumpInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJump()}
              />
              <button className="btn btn-success py-1" onClick={handleJump}>
                Go
              </button>
            </div>

            <button
              className={`btn px-2 py-0 text-xsm ${page === totalPages ? "btn-secondary" : "btn-primary"}`}
              disabled={page === totalPages}
              onClick={handleNext}
            >
              Next →
            </button>
          </div>

          <p className="text-center text-muted small mt-3 mb-0">
            Page {page} / {totalPages || "…"}
          </p>
        </main>
      </div>
    </div>
  );
};

export default BookReaderSecure;
