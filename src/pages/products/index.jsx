import MainLayout from '../../components/layout/MainLayout';
import classes from './Products.module.scss';
import { useEffect, useContext, useState } from 'react';
import authContext from '../../context/auth/authContext';
import ProductsList from '../../components/products/products-list';
import Spinner from '../../components/UI/spinner';
import searchIcon from '../../assets/icons/search-icon-orange.svg';

import Select, { components } from 'react-select';

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className='custom-css-class'>موردی وجود ندارد</span>
    </components.NoOptionsMessage>
  );
};

const Products = () => {
  const {
    productAndSaleListData,
    loadingProductListData,
    getProductAndSaleListData,
    // getProductDetails,
    // productDetails,
    getHomePageData,
    homePageData,
  } = useContext(authContext);

  const [selectedCarBrand, setSelectedCarBrand] = useState(null);
  const [selectedCarClass, setSelectedCarClass] = useState(null);
  const [selectedSaleType, setSelectedSaleType] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    window?.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window?.scrollTo(0, 0);
    getProductAndSaleListData(`?HasProperty=true`);
    getHomePageData('2');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saleTypes = homePageData?.find((item) => item?.id === 12);
  const carBrands = homePageData?.find((item) => item?.id === 34);
  const carClasses = homePageData?.find((item) => item?.id === 35);

  const changeSelectHandler = () => {
    let url = `?HasProperty=true`;
    // for car branc
    if (selectedCarBrand?.value) {
      url += `&NodePath=${selectedCarBrand?.value}`;
    }
    if (selectedSaleType?.value) {
      url += `&eSaleTypeId=${selectedSaleType?.value}`;
    }
    if (selectedCarClass?.value) {
      url += `&AdvancedSearch[0].key=carclass&AdvancedSearch[0].value=${selectedCarClass?.value?.toString()}&AdvancedSearch[0].operator=1`;
    }

    getProductAndSaleListData(url);
  };

  useEffect(() => {
    if (selectedCarBrand || selectedSaleType || selectedCarClass) {
      changeSelectHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCarBrand, selectedSaleType, selectedCarClass]);

  const carBrandsOptions = carBrands?.carouselData?.length
    ? carBrands?.carouselData?.map((brand) => ({
        label: brand?.title,
        value: brand?.code,
      }))
    : [];
  carBrandsOptions.unshift({ label: 'همه', value: '' });

  const saleTypesOptions = saleTypes?.carouselData?.length
    ? saleTypes?.carouselData?.map((type) => ({
        label: type?.saleTypeName,
        value: type?.id,
      }))
    : [];
  saleTypesOptions.unshift({ label: 'همه', value: '' });

  const carClassesOptions = carClasses?.carouselData?.length
    ? carClasses?.carouselData?.map((carClass) => ({
        label: carClass?.title,
        value: carClass?.id,
      }))
    : [];
  carClassesOptions.unshift({ label: 'همه', value: '' });

  let filteredProducts = productAndSaleListData;

  if (search.trim()) {
    filteredProducts = productAndSaleListData.filter((product) =>
      product?.title?.includes(search?.trim())
    );
  }

  return (
    <MainLayout>
      <div className={`${'container'} ${classes.mainWrapper}`}>
        <h1>محصولات </h1>

        <div className={classes.filters}>
          <div className={classes.searchBox}>
            <img src={searchIcon} alt='' />
            <input
              type='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='جستجو بر اساس نام خودرو'
            />
          </div>
          <Select
            components={{ NoOptionsMessage }}
            options={carBrandsOptions}
            placeholder='برند های خودرو'
            className={classes.select}
            onChange={(option) => setSelectedCarBrand(option)}
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: 'none',
              }),
            }}
            isSearchable={true}
          />
          <Select
            components={{ NoOptionsMessage }}
            options={carClassesOptions}
            placeholder='کلاس بدنه خودرو'
            className={classes.select}
            onChange={(option) => setSelectedCarClass(option)}
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: 'none',
              }),
            }}
            isSearchable={true}
          />
          <Select
            components={{ NoOptionsMessage }}
            options={saleTypesOptions}
            placeholder='نوع طرح'
            className={classes.select}
            onChange={(option) => setSelectedSaleType(option)}
            styles={{
              control: (base) => ({
                ...base,
                boxShadow: 'none',
              }),
            }}
          />
        </div>

        <div className={classes.wrapper}>
          {loadingProductListData ? (
            <Spinner />
          ) : (
            <ProductsList productAndSaleListData={filteredProducts} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
