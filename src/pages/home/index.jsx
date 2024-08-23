import MainLayout from '../../components/layout/MainLayout.jsx';
import { useContext, useEffect } from 'react';
import authContext from '../../context/auth/authContext';
import HeroSlider from '../../components/home/hero-slider/index.jsx';
import Loader from '../../components/UI/loader/index.jsx';
// import Agencies from '../../components/home/agencies/index.jsx';
// import ProductsSlider from '../../components/home/products-slider/index.jsx';
import classes from './Home.module.scss';

// import Options from '../../components/home/options/index.jsx';
import AnnouncementAndNotices from '../../components/home/AnnouncementAndNotices/index.jsx';
// import Steps from '../../components/home/steps/index.jsx';
// import NewCars from '../../components/home/new-cars/index.jsx';

import ProductsSlider from '../../components/home/products-slider/index.jsx';

const HomePage = () => {
  const {
    loadingHomePageData,
    getHomePageData,
    homePageData,
    getProductAndSaleListData,
    productDetails,
    productAndSaleListData,
  } = useContext(authContext);

  const heroSlider = homePageData?.find((item) => item?.id === 1);
  // const agencies = homePageData?.find((item) => item?.id === 26)?.carouselData;
  // const newCars = homePageData?.find((item) => item?.id === 32)?.carouselData;
  const announcement = homePageData?.find((item) => item?.id === 2);
  // const importantNotices = homePageData?.find((item) => item?.id === 7);
  // const otherAnnouncements = homePageData?.find((item) => item?.id === 6);
  // const featurePlans = homePageData?.find((item) => item?.id === 8);

  useEffect(() => {
    getHomePageData('1');
    getProductAndSaleListData(`?HasProperty=true`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={classes.homePageWrapper}>
      {loadingHomePageData ? (
        <Loader />
      ) : (
        <MainLayout>
          {heroSlider?.attachments && (
            <HeroSlider heroSliderContent={heroSlider?.attachments} />
          )}
          {announcement && (
            <div className='container'>
              <AnnouncementAndNotices announcement={announcement} />
            </div>
          )}

          <ProductsSlider
            productCategory={productDetails}
            products={productAndSaleListData}
          />
        </MainLayout>
      )}
    </main>
  );
};

export default HomePage;
