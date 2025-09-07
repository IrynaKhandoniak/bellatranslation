import React from "react";
import "./Photos.css";

export default function Photos({ photos }) {
  if (!Array.isArray(photos) || photos.length === 0) return null;

  return (
    <section className="Photos">
      <div className="row">
        {photos.map((photo, index) => (
          <div className="col-4" key={index}>
            <a
              href={photo?.src?.original}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={photo?.src?.landscape}
                alt={photo?.alt || `Photo by ${photo?.photographer || "unknown"}`}
                className="img-fluid"
              />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

