import playIcon from "../../../assets/icons/play.svg";
import pauseIcon from "../../../assets/icons/pause.svg";

import classes from "./VideoSlide.module.scss";
import { useRef, useState } from "react";

const VideoSlide = ({ slide }) => {
  const [isplaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
 console.log(slide?.fileName)
 console.log(slide?.title)

  const videoPlayToggler = (state) => {
    if (state === "play") {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  return (
    <div className={classes.slideWrapper}>
      {slide?.fileName?.toLowerCase()?.indexOf(".mp4") >=0 ? (
        <>
          <video loop playsInline muted ref={videoRef} autoPlay>
            <source
              src={`../../../../dynamic-images/${slide?.fileName}`}
              type="video/mp4"
            />
          </video>

          <h2 className={classes.slideTitle}>{slide?.title}</h2>
          <div className={`${isplaying ? "video-is-playing" : null} controls`}>
            <img
              src={pauseIcon}
              alt="pause"
              onClick={() => videoPlayToggler("pause")}
              style={{ opacity: isplaying ? "1" : "0.4" }}
            />
            <img
              src={playIcon}
              alt="play"
              onClick={() => videoPlayToggler("play")}
              style={{ opacity: isplaying ? "0.4" : "1" }}
            />
          </div>
        </>
      ) : (
        <img src={`../../../../dynamic-images/${slide?.fileName}`} alt="" />
      )}

      {/* <div className={classes.imageOverlay}></div> */}
    </div>
  );
};

export default VideoSlide;
