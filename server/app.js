const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const fs = require("fs");

const app = express();

// Serve the React app
app.use(express.static(path.join(__dirname, "client")));

// Serve gallery files
app.use("/gallery", serveStatic(path.join(__dirname, "gallery")));

// API endpoint to list images
app.get("/api/images", (req, res) => {
  const requestedPath = req.query.path || "";
  const galleryBasePath = path.join(__dirname, "gallery");
  const fullPath = path.resolve(galleryBasePath, requestedPath);

  // Prevent directory traversal
  if (!fullPath.startsWith(galleryBasePath)) {
    return res.status(403).json({ error: "Invalid path." });
  }

  fs.stat(fullPath, (statErr, stat) => {
    if (statErr) {
      if (statErr.code === "ENOENT") {
        return res.status(404).json({ error: "Directory not found." });
      }
      console.error(`Error accessing directory: ${statErr.message}`);
      return res.status(500).json({ error: "Unable to access the directory." });
    }

    if (!stat.isDirectory()) {
      return res.status(400).json({ error: "Path is not a directory." });
    }

    fs.readdir(fullPath, { withFileTypes: true }, (readdirErr, files) => {
      if (readdirErr) {
        console.error(`Error reading directory: ${readdirErr.message}`);
        return res.status(500).json({ error: "Unable to read the directory." });
      }

      const items = files
        .filter((file) => !file.name.startsWith(".") && file.name !== "Thumbs.db")
        .map((file) => ({
          name: file.name,
          isDirectory: file.isDirectory(),
        }));
      res.json(items);
    });
  });
});


// API endpoint to delete an image
app.delete("/api/images/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "gallery", filename);

  fs.stat(filePath, (statErr, stat) => {
    if (statErr) {
      console.error(`Error checking file: ${statErr.message}`);
      return res.status(500).json({ error: "File does not exist or cannot be accessed." });
    }

    if (!stat.isFile()) {
      console.error("Path is not a file.");
      return res.status(500).json({ error: "Path is not a file." });
    }

    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Error deleting file: ${unlinkErr.message}`);
        return res.status(500).json({ error: "Unable to delete the image." });
      }
      res.json({ message: "Image deleted successfully." });
    });
  });
});

// Handle all other routes with index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
