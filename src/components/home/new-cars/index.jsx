import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import arrowRight from '../../../assets/icons/chevron-right.svg';
import arrowLeft from '../../../assets/icons/chevron-left.svg';

import carIcon1 from '../../../assets/icons/new-car-icon1.svg';
import carIcon2 from '../../../assets/icons/new-car-icon2.svg';
import carIcon3 from '../../../assets/icons/new-car-icon3.svg';
import carIcon4 from '../../../assets/icons/new-car-icon4.svg';

import classes from './NewCars.module.scss';
import { Link } from 'react-router-dom';

const getPropWithKey = (car, code) => {
  for (const cat of car.propertyCategories) {
    for (const prop of cat.properties) {
      if (prop.key === code) {
        return prop;
      }
    }
  }
};

const NewCars = ({ newCars }) => {
  return (
    <section className={classes.newCars}>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className='newCarsSlider'
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
      >
        {newCars?.map((car) => (
          <SwiperSlide key={car?.id}>
            {/* car image */}
            <div className={classes.slideItem}>
              <div className={classes.image}>
                <h2>{car?.title}</h2>
                <img
                  src={`../dynamic-images/${
                    car?.attachments?.find((car) => car?.type === 2).fileName
                  }`}
                  alt=''
                />
              </div>
              {/* car options */}

              <div className={classes.properties}>
                <ul>
                  <li>
                    <img src={carIcon1} alt='' />
                    <div>
                      <span>{getPropWithKey(car, 'P002')?.title} : </span>
                      <span>{getPropWithKey(car, 'P002')?.value}</span>
                    </div>
                  </li>
                  <li>
                    <img src={carIcon2} alt='' />
                    <div>
                      <span>{getPropWithKey(car, 'P005')?.title} :</span>
                      <span>{getPropWithKey(car, 'P005')?.value}</span>
                    </div>
                  </li>
                  <li>
                    <img src={carIcon3} alt='' />
                    <div>
                      <span>{getPropWithKey(car, 'P018')?.title} : </span>
                      <span>{getPropWithKey(car, 'P018')?.value}</span>
                    </div>
                  </li>
                  <li>
                    <img src={carIcon4} alt='' />
                    <div>
                      <span>{getPropWithKey(car, 'P003')?.title} : </span>
                      <span>{getPropWithKey(car, 'P003')?.value}</span>
                    </div>
                  </li>
                  <li className={classes.showDetailsLink}>
                    <Link>مشاهده کامل محصول</Link>
                  </li>
                </ul>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className='slider-controler'>
          <div className='swiper-button-next slider-arrow'>
            <img src={arrowLeft} alt='arrow left icon' />
          </div>
          <div className='swiper-button-prev slider-arrow'>
            <img src={arrowRight} alt='arrow right icon' />
          </div>
        </div>
      </Swiper>
    </section>
  );
};

export default NewCars;
