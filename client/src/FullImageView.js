import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const FullImageView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    fetchImages();

    const handleKeyDown = (event) => {
      console.log("Key down event detected:", event.key);
      if (event.key === "ArrowLeft") {
        navigatePrevious();
      } else if (event.key === "ArrowRight") {
        navigateNext();
      } else if (event.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

      return () => {
        console.log("remove")
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("/api/images");
      setImages(response.data);
      const currentImageName = decodeURIComponent(location.pathname.split("/").pop());
      const index = response.data.findIndex((item) => item.name === currentImageName);
      if (index !== -1) {
        setCurrentIndex(index);
        setCurrentImage(`/gallery/${response.data[index].name}`);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const navigateNext = () => {
    if (images.length === 0) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    const nextImageSrc = `/gallery/${images[nextIndex].name}`;
    setCurrentImage(nextImageSrc);
    console.log("Navigating to next image:", nextImageSrc);
  };

  const navigatePrevious = () => {
    if (images.length === 0) return;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = images.length - 1;
    setCurrentIndex(prevIndex);
    const prevImageSrc = `/gallery/${images[prevIndex].name}`;
    setCurrentImage(prevImageSrc);
    console.log("Navigating to previous image:", prevImageSrc);
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "black" }}
      tabIndex="0" // Ensure the div can receive focus for key events
    >
      <img
        src={currentImage}
        alt="Full Image"
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      />
      <button
        onClick={navigatePrevious}
        style={{
          zIndex: 1,
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "24px",
        }}>
        &#8592;
      </button>
      <button
        onClick={navigateNext}
        style={{
          zIndex: 1,
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          color: "white",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "24px",
        }}>
        &#8594;
      </button>
      <div
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "5px 10px",
          cursor: "pointer",
          zIndex: 1,
        }}>
        <i
          className="fas fa-times"
          style={{ fontSize: "16px" }}></i>
      </div>
    </div>
  );
};

export default FullImageView;
