import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const ThumbnailGallery = () => {
  const [items, setItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = new URLSearchParams(location.search).get("path") || "";

  useEffect(() => {
    fetchItems(currentPath);
    document.title = currentPath ? `${currentPath} (${items.length} items)` : "Output gallery";
  }, [currentPath, items]);

  const fetchItems = async (path) => {
    try {
      const response = await axios.get("/api/images", { params: { path } });
      setItems(
        response.data.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        })
      );
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleItemClick = (item) => {
    if (item.isDirectory) {
      // Navigate to subdirectory
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      navigate(`?path=${newPath}`);
    } else {
      // View file
      navigate(`/view/${encodeURIComponent(item.name)}`, { state: { path: currentPath } });
    }
  };

  const handleDelete = async (itemName, isDirectory) => {
    if (!isDirectory && window.confirm(`Are you sure you want to delete ${itemName}?`)) {
      try {
        await axios.delete(`/api/images/${encodeURIComponent(itemName)}`, { params: { directory: isDirectory, path: currentPath } });
        fetchItems(currentPath);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleGoUp = () => {
    if (currentPath) {
      const parts = currentPath.split("/").slice(0, -1).join("/");
      navigate(`?path=${parts}`);
    } else {
      navigate("?path=");
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px" }}>
      {currentPath && (
        <div
          onClick={handleGoUp}
          style={{ cursor: "pointer", marginBottom: "10px" }}>
          <i
            className="fas fa-arrow-left"
            style={{ fontSize: "16px", color: "yellow" }}></i>{" "}
          Up
        </div>
      )}
      <h1>{currentPath ? `${currentPath} (${items.length} items)` : "Output gallery"}</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              margin: "10px",
              width: "300px",
              height: "300px",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                border: "1px solid #ccc",
                backgroundColor: "black", // Ensure background is black
              }}
              onClick={() => handleItemClick(item)}>
              {item.isDirectory ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <i
                    className="fas fa-folder"
                    style={{ fontSize: "48px", color: "yellow" }}></i>
                  <span style={{ color: "white", marginTop: "5px" }}>{item.name}</span>
                </div>
              ) : (
                <img
                  src={`/gallery/${currentPath}/${item.name}`}
                  alt={item.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            {!item.isDirectory && ( // Only show delete button for files
              <div
                className="delete-button"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  cursor: "pointer",
                  padding: "5px 10px",
                  display: hoveredIndex === index ? "block" : "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.name, item.isDirectory);
                }}>
                <i
                  className="fas fa-trash"
                  style={{ fontSize: "16px" }}></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThumbnailGallery;
