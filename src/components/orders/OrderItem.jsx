import moment from "jalali-moment";
import classes from "./OrderItem.module.scss";
import { useContext } from "react";
import authContext from "../../context/auth/authContext";
import { Link } from "react-router-dom";
import iranPrice from "../../helpers/iranPrice";
import Spinner from "../UI/spinner";
// import signIcon from '../../assets/images/icons/sign-icon-orders.svg';

const OrderItem = ({
  order,
  setShowModal,
  index,
  setIsModalVisible,
  setOrderCancelDetail,
}) => {
  const {
    orderstatusTitle,
    creationTime,
    orderStatusCode,
    deliveryDateDescription,
    transactionId,
    paymentPrice,
    signStatusId,
    signTicketId,
    orderId,
  } = order;

  const { getContract, signContract, loadingSignContract, loadingGetContract } =
    useContext(authContext);

  const convertedCreationTime =
    creationTime?.substr(0, 2) !== "13" && creationTime?.substr(0, 2) !== "14"
      ? moment(order?.creationTime)
          .locale("fa")
          .format("jDD jMMMM jYYYY - ساعت HH:mm")
      : order?.creationTime?.substr(0, 10).replaceAll("-", "/");

  const signContractHandler = async (orderId) => {
    const response = await signContract(orderId);

    if (response?.success) {
      setShowModal(true);
    }
  };

  const orderStatusStyle = (orderStatusCode) => {
    switch (orderStatusCode) {
      // انصراف داده شده
      case 20:
        return "canceled";
      // پرداخت ناموفق
      case 80:
        return "transactionFail";
      // پرداخت با موفقیت انجام شد
      case 70:
        return "success";
      // /ثبت سفارش اولیه با موفقیت انجام شد
      case 10:
        return "success";
      default:
        break;
    }
  };

  return (
    <div className={classes.rowContainer}>
      <div className={`${classes.itemMain} ${classes.smallWidth}`}>
        <p className={classes.item} data-title="شماره ردیف">
          <span className="faNum">{index + 1}</span>
        </p>
      </div>
      <div className={`${classes.itemMain} ${classes.largeWidth}`}>
        <p className={classes.item} data-title="نام خودرو">
          <span className="faNum">{order?.product?.title}</span>
        </p>
      </div>
      <div className={classes.itemMain}>
        <p className={classes.item} data-title="شماره پیگیری">
          <span className="faNum">{transactionId ? transactionId : "-"}</span>
        </p>
      </div>
      <div className={`${classes.itemMain} ${classes.largeWidth}`}>
        <p className={classes.item} data-title="زمان ثبت سفارش">
          <span className="faNum" style={{ padding: "0 3px" }}>
            {creationTime ? convertedCreationTime : "-"}
          </span>
        </p>
      </div>
      <div className={`${classes.itemMain} ${classes.largeWidth}`}>
        <p className={classes.item} data-title="تاریخ تحویل">
          <span className="faNum">
            {deliveryDateDescription ? deliveryDateDescription : "-"}
          </span>
        </p>
      </div>
      <div className={classes.itemMain}>
        <p className={classes.item} data-title="مبلغ">
          <span className="faNum">
            {paymentPrice ? iranPrice(paymentPrice) + " ریال" : "-"}
          </span>
        </p>
      </div>
      <div
        className={`${classes.itemMain} ${
          classes[orderStatusStyle(orderStatusCode)]
        } ${classes.orderStatusText} `}
      >
        <p data-title="وضعیت" className={classes.item}>
          <span>{orderstatusTitle}</span>
        </p>
      </div>
      {/* <div className={classes.itemMain}>
        <p className={classes.item} data-title='رسید پرداخت'>
          {orderStatusCode === 70 ? (
            <span className={classes.ctaButton}>
              <Link
                to={`/pdf/${orderId}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                رسید پرداخت
              </Link>
            </span>
          ) : (
            <span>-</span>
          )}
        </p>
      </div> */}
      <div className={classes.itemMain}>
        <p data-title="قرارداد">
          {signStatusId === 1 ? (
            <span>در حال آماده سازی</span>
          ) : signStatusId === 2 ? (
            <span
              className={classes.ctaButton}
              onClick={() => {
                signContractHandler(orderId);
              }}
            >
              {loadingSignContract ? <Spinner isButton /> : "دریافت قرارداد"}
            </span>
          ) : signStatusId === 3 ? (
            <span>در انتظار امضای قرارداد</span>
          ) : signStatusId === 4 ? (
            <span
              className={classes.ctaButton}
              style={
                loadingGetContract
                  ? { cursor: "not-allowed" }
                  : { cursor: "pointer" }
              }
              onClick={() => {
                getContract(signTicketId);
              }}
            >
              دریافت قرارداد
            </span>
          ) : signStatusId === 5 ? (
            <span>رد شده</span>
          ) : signStatusId === 6 ? (
            <span>منقضی شده</span>
          ) : (
            "-"
          )}
        </p>
      </div>
      <div className={classes.itemMain}>
        {!order?.cancelable ? (
          <p className={classes.deleteItemEmpty}>-</p>
        ) : (
          <p
            className={classes.deleteItem}
            onClick={() => {
              setIsModalVisible(true);
              setOrderCancelDetail(order);
            }}
          >
            حذف سفارش
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
