import playIcon from "../../../assets/icons/play.svg";
import pauseIcon from "../../../assets/icons/pause.svg";
import b64DecodeUnicode from '../../../helpers/decodeBase64';
import classes from "./VideoSlide.module.scss";
import { useRef, useState } from "react";

const VideoSlide = ({ slide, advertise }) => {
  const [isplaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
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
         
          <div className={classes.slideTitle}  dangerouslySetInnerHTML={{ __html: (advertise?.description) }}>
            
            
          </div>
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
