import { useContext, useEffect } from "react";
import authContext from "../../context/auth/authContext";
import MainLayout from "../../components/layout/MainLayout";
import classes from "./Pdf.module.scss";
import arrowLeft from "../../assets/images/icon/arrowLeft.svg";
import { useParams } from "react-router-dom";

const Pdf = () => {
  const { factor, getFactor } = useContext(authContext);

  const { orderId } = useParams();

  useEffect(() => {
    getFactor(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return factor === null ? (
    <MainLayout>
      <div className={classes.sectionWrapper}>
        <h1>در حال بارگذاری ...</h1>
        <div>
          <a href="/orders">بازگشت به صفحه سفارشات</a>
          <img src={arrowLeft} alt="" />
        </div>
      </div>
    </MainLayout>
  ) : (
    <embed
      style={{ width: "100%", height: "100vh" }}
      src={`data:application/pdf;base64,${factor}`}
    />
  );
};

export default Pdf;
