import { useContext, useState } from 'react';

import classes from './ProductsList.module.scss';

import iranPrice from '../../../helpers/iranPrice';
import noIamge from '../../../assets/images/no-photo.png';
import carClassIcon from '../../../assets/product-class.svg';
import productSaleTypeIcon from '../../../assets/product-sale-type.svg';
import deliveryTimeIcon from '../../../assets/icons/delivery-time.svg';
import salePlanEndDate from '../../../assets/icons/sale-plan-end-date.svg';
import salePlanStartDate from '../../../assets/icons/sale-plan-start-date.svg';
import circularCodeIcon from '../../../assets/icons/circular-code.svg';
import colorIcon from '../../../assets/icons/color.svg';
// import arrowLeft from '../../../assets/icons/chevron-left-black.svg';
import moment from 'jalali-moment';
import { Link, useNavigate } from 'react-router-dom';
import authContext from '../../../context/auth/authContext';

import Spinner from '../../UI/spinner';

const Product = ({ product, sale = null }) => {
  const { isUserLogin, validateSaleProduct } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const validateSaleProductHandler = async (uuid) => {
    setLoading(true);
    const response = await validateSaleProduct(uuid);
    if (response) {
      navigate(`/check-out/${uuid}`);
    }
    setLoading(false);
  };
  return (
    <div className={classes.singleProductWrapper}>
      <div className={classes.topSection}>
        <div className={classes.imageWrapper}>
          <div
            className={classes.img}
            style={
              product?.attachments?.length !== 0
                ? {
                    backgroundImage: `url(../../../../dynamic-images/${
                      product?.attachments?.find((item) => item.type === 6)
                        ?.fileName
                    })`,
                  }
                : { backgroundImage: `url(${noIamge})` }
            }
          ></div>
        </div>
        <div className={classes.nameAndPrice}>
          <div className={classes.productHeader}>
            <h2>{product?.title}</h2>
            {/* colors */}
            <div className={classes.colorsWrapper}>
              <img src={colorIcon} alt='' />
              <span>رنگ ها :</span>
              <ul className={classes.colors}>
                {sale?.saleDetailCarColors?.map((item) => (
                  <li
                    key={item?.id}
                    style={{
                      background: item?.color?.htmlColorCode,
                    }}
                  ></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.productDetail}>
        <div className={classes.productBody}>
          <div className={classes.conditions}>
            <div className={classes.productContent}>
              <ul>
                <li>
                  <span>
                    <img src={carClassIcon} alt='' />
                  </span>
                  <span>
                    کلاس بدنه خودرو:{' '}
                    {product?.carClass ? product?.carClass : '-'}
                  </span>
                </li>
                <li>
                  <span>
                    <img src={productSaleTypeIcon} alt='' />
                  </span>
                  <span>
                    نوع طرح فروش:{' '}
                    {sale?.esaleTypeName ? sale?.esaleTypeName : '-'}
                  </span>
                </li>

                <li>
                  <span>
                    <img src={salePlanStartDate} alt='' />
                  </span>
                  <span className='faNum'>
                    تاریخ آغاز طرح:{' '}
                    {sale?.salePlanStartDate
                      ? moment(sale?.salePlanStartDate)
                          ?.locale('fa')
                          .format('jDD / jMM / jYYYY')
                      : '-'}
                  </span>
                </li>
                <li>
                  <span>
                    <img src={salePlanEndDate} alt='' />
                  </span>

                  <span className='faNum'>
                    مهلت واریز:{' '}
                    {sale?.salePlanEndDate
                      ? moment(sale?.salePlanEndDate)
                          ?.locale('fa')
                          .format('jDD / jMM / jYYYY')
                      : '-'}
                  </span>
                </li>
                <li>
                  <span>
                    <img src={deliveryTimeIcon} alt='' />
                  </span>
                  <span className='faNum'>
                    موعد تحویل :{' '}
                    {sale?.deliverDaysCount
                    ?
                    sale?.deliverDaysCount + ' روز کاری'
                      // ? moment(sale?.carDeliverDate)
                      //     ?.locale('fa')
                      //     .format('jDD / jMM / jYYYY')
                      : '-'}
                  </span>
                </li>
                <li className={classes.circularCodeTop}>
                  <span>
                    <img src={circularCodeIcon} alt='' />
                </span>
                  <span className='faNum'>شماره بخشنامه :</span>
                  <span>{sale?.salePlanCode ? sale?.salePlanCode : '-'}</span>
                </li>
                <li className={classes.circularCodeTop}>
                  <span>
                    <img src={circularCodeIcon} alt='' />
                  </span>
                  <span className='faNum'>توضیحات :</span>
                  <span>{sale?.title ? sale?.title : '-'}</span>
                </li>
                {/* circular code */}
              </ul>
            </div>
            <div className={classes.productFooter}>
              <div className={classes.productPrice}>
                <h3 className='faNum'>
                  <span>قیمت علی الحساب</span>
                  <span className={classes.priceBorder}></span>
                  <span>
                    {!sale ? (
                      <span>در حال حاضر برنامه ای برای فروش وجود ندارد!</span>
                    ) : (
                      iranPrice(sale?.carFee) + ' ریال'
                    )}
                  </span>
                </h3>
              </div>
              {/* footer left */}
              <div className={classes.btnWrapper}>
                {sale && (
                  <>
                    {isUserLogin ? (
                      <>
                        {loading ? (
                          <button className={classes.buyBtn}>
                            <Spinner isButton />
                          </button>
                        ) : (
                          <button
                            className={classes.buyBtn}
                            onClick={() =>
                              validateSaleProductHandler(sale?.uid)
                            }
                          >
                            سفارش محصول
                          </button>
                        )}
                      </>
                    ) : (
                      <Link to={'/login'}>سفارش محصول</Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
