"use client";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import arrowRight from "../../../assets/icons/chevron-bottom.svg";
import arrowLeft from "../../../assets/icons/chevron-top.svg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import VideoSlide from "./VideoSlide";
// import { useState } from "react";

const HeroSlider = ({ heroSliderContent }) => {
  return (
    <div>
      <Swiper
        pagination
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        autoHeight={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="heroSlider"
      >
        {heroSliderContent?.map((slide) =>(
                slide?.attachments?.
          filter((x) => x.device == 0))
          .map( (att) =>(


                     <SwiperSlide key={att.id}>
                  <VideoSlide slide={att} advertise={slide} />
                </SwiperSlide>
          )))
        
          
        }
        <div className="slider-controler">
          <div className="swiper-button-next slider-arrow">
            <img src={arrowRight} alt="arrow right icon" />
          </div>
          <div className="swiper-button-prev slider-arrow">
            <img src={arrowLeft} alt="arrow left icon" />
          </div>
        </div>
      </Swiper>
    </div>
  );
};

export default HeroSlider;
