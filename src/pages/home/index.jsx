import MainLayout from "../../components/layout/MainLayout.jsx";
import { useContext, useEffect, useState } from "react";
import authContext from "../../context/auth/authContext";
import HeroSlider from "../../components/home/hero-slider/index.jsx";
import Loader from "../../components/UI/loader/index.jsx";
// import Agencies from '../../components/home/agencies/index.jsx';
// import ProductsSlider from '../../components/home/products-slider/index.jsx';
import classes from "./Home.module.scss";
import Options from '../../components/home/options/index.jsx';

// import Options from '../../components/home/options/index.jsx';
import AnnouncementAndNotices from "../../components/home/AnnouncementAndNotices/index.jsx";
// import Steps from '../../components/home/steps/index.jsx';
// import NewCars from '../../components/home/new-cars/index.jsx';

import ProductsSlider from "../../components/home/products-slider/index.jsx";
import BrandsList from "../../components/home/brands/BrandsList.jsx";

const HomePage = () => {
  const {
    loadingHomePageData,
    getHomePageData,
    homePageData,
    getProductAndSaleListData,
    productDetails,
    productAndSaleListData,
  } = useContext(authContext);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [productAndSaleListDatalocal, setProductAndSaleListDataLocal] =
    useState([]);
  const heroSlider = homePageData?.find((item) => item?.code === 36)?.carouselData;
  // const agencies = homePageData?.find((item) => item?.id === 26)?.carouselData;
  // const newCars = homePageData?.find((item) => item?.id === 32)?.carouselData;
  const announcement = homePageData?.find((item) => item?.id === 2);
  // const importantNotices = homePageData?.find((item) => item?.id === 7);
  // const otherAnnouncements = homePageData?.find((item) => item?.id === 6);
  // const featurePlans = homePageData?.find((item) => item?.id === 8);
  const brands = [];
  homePageData
    ?.find((item) => item?.code === 50)
    ?.carouselData?.forEach((item) => {
      item?.childrens?.forEach((itembrands) => {
        brands.push(itembrands);
      });
    });
  useEffect(() => {
    getHomePageData("1");
    getProductAndSaleListData(`?HasProperty=true`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if(window.config?.isShowBrands == true){
      if (productAndSaleListData.length > 0) {
        setProductAndSaleListDataLocal(
          productAndSaleListData?.filter((product) =>
            product.code.startsWith(brands?.at(0)?.code)
          )
        );
      }
    }
    else{
      setProductAndSaleListDataLocal(
        productAndSaleListData
      );
    }
   
  }, [productAndSaleListData, homePageData]);
  useEffect(() => {
    if (selectedBrandId) {

      setProductAndSaleListDataLocal(
        productAndSaleListData?.filter((x) =>
          x.code.startsWith(
            brands?.filter((brnd) => brnd.id == selectedBrandId)?.at(0)?.code
          )
        )
      );
    
    }
  }, [selectedBrandId]);
  useEffect(() => {
    if (brands.length && selectedBrandId === "") {
      debugger;
      setSelectedBrandId(brands?.at(0).id);
      setProductAndSaleListDataLocal(
        productAndSaleListDatalocal?.filter((x) =>
          x.code.startsWith(brands?.at(0)?.code)
        )
      );
    }
  }, []);

  return (
    <main className={classes.homePageWrapper}>
      {loadingHomePageData ? (
        <Loader />
      ) : (
        <MainLayout>
          {heroSlider && (
            <HeroSlider heroSliderContent={heroSlider} />
          )}
          {announcement && (
            <div className="container">
              <AnnouncementAndNotices announcement={announcement} />
            </div>
          )}

          <ProductsSlider
            productCategory={productDetails}
            products={productAndSaleListDatalocal}
          >
            {window.config?.isShowBrands == true?
             <BrandsList
             brands={brands}
             selectedBrandId={selectedBrandId}
             setSelectedBrandId={setSelectedBrandId}
           ></BrandsList>
           :
           <></>
            }
               
            </ProductsSlider>
          <Options />
        </MainLayout>
      )}
    </main>
  );
};

export default HomePage;
