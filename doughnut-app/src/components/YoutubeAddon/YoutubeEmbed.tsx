type YoutubeEmbedProps = {
  width: number;
};

export const YoutubeEmbed = ({ width }: YoutubeEmbedProps) => (
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
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  </div>
);
