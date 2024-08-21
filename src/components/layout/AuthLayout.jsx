// import product from "../../assets/images/company-single-product.png";
import classes from './AuthLayout.module.scss';

const AuthLayout = ({ children, title = 'احراز هویت' }) => {
  return (
    <section className={classes.authWrapper}>
      <div className={classes.logo}></div>
      <div className={classes.title}>
        <h1>{title}</h1>
      </div>
      {children}
    </section>
  );
};

export default AuthLayout;
