import classes from "./gallery.module.scss";
import MainLayout from "../../components/layout/MainLayout";
import { useContext, useEffect, useState } from "react";
import authContext from "../../context/auth/authContext";
import HeroSlider from "../../components/home/hero-slider/index.jsx";
import Loader from "../../components/UI/loader/index.jsx";

const gallery = () => {
  const {
    loadingHomePageData,
    getHomePageData,
    homePageData,
  } = useContext(authContext);
  const heroSlider = homePageData?.find((item) => item?.code === 37)?.carouselData;
  useEffect(() => {
    getHomePageData("1");
  
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  return (

    <MainLayout>
       {loadingHomePageData ? (
         <Loader />
      ) :
        <div className={classes.galleryWrapper}>
        { <HeroSlider heroSliderContent={heroSlider} /> }
        </div>
       }
     
    </MainLayout>
  );
};

export default gallery;
