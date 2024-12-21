import React from "react";

const FullImageComponent = ({ src }) => {
  return (
    <img
      src={src}
      alt="Full Image"
      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
    />
  );
};

export default FullImageComponent;
