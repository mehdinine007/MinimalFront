import classes from './ProductsSlider.module.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import arrowRight from '../../../assets/icons/chevron-r.svg';
import arrowLeft from '../../../assets/icons/chevron-l.svg';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules
import { Navigation } from 'swiper/modules';

import { useContext, useState } from 'react';

import authContext from '../../../context/auth/authContext';
import { Link } from 'react-router-dom';

const ProductsSlider = ({ products }) => {
  const token = localStorage.getItem('token');
  const { isUserLogin } = useContext(authContext);

  const [selectedProduct, setSelectedProduct] = useState(() => products?.at(0));
  return (
    <section className={classes.productsSliderSection}>
      <div className={classes.title}>
        {isUserLogin ? <span> همه محصولات </span> : <span> همه محصولات </span>}
      </div>

      <div className={classes.sliderWrapper}>
        <div className={classes.redLine}></div>
        <Swiper
          initialSlide={0}
          modules={[Navigation]}
          spaceBetween={50}
          slidesPerView={4}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            990: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          loop={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          }}
          className='productsSlider'
          onSlideChange={(swiper) => {
            const currentProduct = products.find(
              (product, index) => index === swiper.realIndex
            );
            setSelectedProduct(currentProduct);
          }}
          onClick={(swiper) => {
            swiper.slideTo(swiper.clickedIndex);
          }}
          centeredSlides={true}
        >
          {products?.map((product, index) => (
            <SwiperSlide key={index}>
              <div className={classes.slideWrapper}>
                <img
                  src={`../../../../dynamic-images/${
                    product?.attachments?.find((item) => item.type === 6)
                      ?.fileName
                  }`}
                  alt={
                    product?.attachments?.find((item) => item.type === 6)
                      ?.description
                  }
                />
                <h3>{product?.title}</h3>
                <Link to={token ? `/check-out/${product?.uid}` : '/login'}>
                  خرید محصول
                </Link>
              </div>
            </SwiperSlide>
          ))}

          <div className='swiper-pagination'></div>
          <div className='slider-controler'>
            <div className='swiper-button-next slider-arrow'>
              <img src={arrowLeft} alt='arrow left icon' />
            </div>
            <div className='swiper-button-prev slider-arrow'>
              <img src={arrowRight} alt='arrow right icon' />
            </div>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default ProductsSlider;
