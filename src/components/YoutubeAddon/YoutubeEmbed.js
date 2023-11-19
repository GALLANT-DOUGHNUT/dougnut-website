import React from "react";
import PropTypes from "prop-types";

const YoutubeEmbed = ({ width, embedId }) => (
  <div
    className="video-responsive"
    style={{
      width: width <= 768 ? "100%" : "55%",
      position: "relative",
      left: width <= 768 ? "0%" : "22%",
      margin: "32px 0",
    }}
  >
    <iframe
      style={{ borderRadius: 4, width: "100%", aspectRatio: "16/9" }}
      src="https://www.youtube.com/embed/xCVGq8z-UWY?si=J3wX3Wv87k4KEhjI"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
