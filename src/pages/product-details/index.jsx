import { useContext, useEffect } from 'react';
import authContext from '../../context/auth/authContext';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

// import Hero from '../../components/product-details/Hero';
// import Itemsbar from '../../components/product-details/Itemsbar';
import Gallery from '../../components/product-details/Gallery';
import Specification from '../../components/product-details/Specification';
import MobileSpecifications from '../../components/product-details/MobileSpecifications';
import Spinner from '../../components/UI/spinner';

import classes from './ProductDetail.module.scss';
// import iranPrice from '../../helpers/iranPrice';

const ProductDetails = () => {
  const { productCode } = useParams();
  const {
    getProductAndSaleListData,
    productAndSaleListData,
    loadingProductListData,
  } = useContext(authContext);

  useEffect(() => {
    window?.scrollTo(0, 0);
    if (productCode) {
      getProductAndSaleListData(`?NodePath=${productCode}&HasProperty=true`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCode]);

  const gallery = productAndSaleListData
    ?.at(0)
    ?.attachments.filter((item) => item?.type === 1);
  const carLogo = productAndSaleListData
    ?.at(0)
    ?.attachments.find((item) => item?.type === 6);

  // const productSaleDetails = productAndSaleListData?.at(0)?.saleDetails.at(0);
  return loadingProductListData ? (
    <Spinner />
  ) : (
    <MainLayout>
      <h1 className={classes.carTitle}>
        مشخصات خودرو <span>{productAndSaleListData?.at(0)?.title}</span>
      </h1>
      {gallery?.length > 0 && (
        <Gallery galleryImages={gallery} initialMainImage={gallery?.at(0)} />
      )}

      <div className={classes.carDetail}>
        <h2>
          نام خودرو : <span>{productAndSaleListData?.at(0)?.title}</span>
        </h2>
        <img src={`../../dynamic-images/${carLogo?.fileName}`} alt='' />
      </div>

      <div className={classes.desktopSpecifications}>
        {productAndSaleListData?.at(0)?.propertyCategories && (
          <Specification
            features={productAndSaleListData?.at(0)?.propertyCategories}
          />
        )}
      </div>
      <div className={classes.mobileSpecifications}>
        {productAndSaleListData?.at(0)?.propertyCategories && (
          <MobileSpecifications
            features={productAndSaleListData?.at(0)?.propertyCategories}
          />
        )}
      </div>

      {/* <div className={classes.productPrice}>
        {productSaleDetails ? (
          <>
            <Link
              className={classes.buyBtn}
              to={
                isUserLogin ? `/check-out/${productSaleDetails?.uid}` : '/login'
              }
            >
              خرید محصول
            </Link>
          </>
        ) : (
          <div>
            <span>در حال حاضر برنامه ای برای فروش وجود ندارد!</span>
          </div>
        )}
      </div> */}
    </MainLayout>
  );
};

export default ProductDetails;
