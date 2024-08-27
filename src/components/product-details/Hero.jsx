import iranPrice from '../../helpers/iranPrice';
import classes from './Hero.module.scss';

import { Link } from 'react-router-dom';

import arrowRight from '../../assets/images/icons/arrow-right-product-details.svg';
import arrowLeft from '../../assets/images/icons/arrow-left-product-details.svg';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

const Hero = ({ galleryImages, productSaleDetails }) => {
  const token = localStorage.getItem('token');
  return (
    <div className={classes.heroWrapper}>
      <div className='productHeroSlider'>
        <Swiper
          slidesPerView={4}
          spaceBetween={20}
          freeMode={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
          }}
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          }}
        >
          {galleryImages?.map((item) => (
            <SwiperSlide key={item?.id}>
              <img
                className={classes.img}
                src={`../../../dynamic-images/${item?.fileName}`}
                alt={item.description}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='slider-controler'>
          <div className='swiper-button-prev slider-arrow'>
            <img src={arrowLeft} alt='arrow right icon' />
          </div>
          <div className='swiper-button-next slider-arrow'>
            <img src={arrowRight} alt='arrow left icon' />
          </div>
        </div>

        <div className={classes.productPrice}>
          <div className={classes.itemWrapper}>
            <span className='container'>Hybrid Available Highlander</span>
          </div>
          {productSaleDetails ? (
            <>
              <div>
                <span>قیمت: </span>
                <span className='faNum'>
                  {iranPrice(productSaleDetails?.carFee)} ریال
                </span>
              </div>
              <Link
                to={token ? `/check-out/${productSaleDetails?.uid}` : '/login'}
              >
                <button>سفارش محصول</button>
              </Link>
            </>
          ) : (
            <div>
              <span>در حال حاضر برنامه ای برای فروش وجود ندارد!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
