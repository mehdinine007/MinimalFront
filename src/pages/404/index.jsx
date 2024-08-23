import { Link } from "react-router-dom";
import classes from "./NotFound.module.scss";
import MainLayout from "../../components/layout/MainLayout";

const NotFoundPage = () => {
  return (
    <MainLayout>
      <main className={classes.pageWrapper}>
        <div className={classes.errorContainer}>
          <div className={classes.errorCode}>
            <p>4</p>
            <p>0</p>
            <p>4</p>
          </div>
          <div className={classes.errorTitle}>صفحه یافت نشد!</div>

          <Link to="/" className={classes.action}>
            انتقال به صفحه اصلی
          </Link>
        </div>
      </main>
    </MainLayout>
  );
};

export default NotFoundPage;
