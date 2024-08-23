import classes from './ProductsList.module.scss';
import Product from './Product.jsx';

const ProductsList = ({ productAndSaleListData }) => {
  return (
    <div className={classes.productsList}>
      {productAndSaleListData?.map((product) =>
        product?.saleDetails?.length > 0 ? (
          product?.saleDetails?.map((sale, index) => (
            <Product key={index} sale={sale} product={product} />
          ))
        ) : (
          <Product key={product.id} product={product} />
        )
      )}
    </div>
  );
};

export default ProductsList;
