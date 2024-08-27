import { useContext } from 'react';
import { toast } from 'react-toastify';
import moment from 'jalali-moment';

import classes from './OrderCancel.module.scss';

import authContext from '../../context/auth/authContext';
import Spinner from '../UI/spinner';

const OrderCancel = ({
  setIsModalVisible,
  submitHandler,
  orderCancelDetail,
}) => {
  const { cancelOrder, getOrders, loadingCancelOrder } =
    useContext(authContext);

  const convertedCreationTime =
    orderCancelDetail?.creationTime?.substr(0, 2) !== '13' &&
    orderCancelDetail?.creationTime?.substr(0, 2) !== '14'
      ? moment(orderCancelDetail?.creationTime)
          .locale('fa')
          .format('jDD jMMMM jYYYY - ساعت HH:mm')
      : orderCancelDetail?.creationTime?.substr(0, 10).replaceAll('-', '/');

  const cancelOrderHandler = async () => {
    const successCancel = await cancelOrder(orderCancelDetail?.orderId);
    if (successCancel) {
      toast.success('سفارش شما لغو گردید.');
      getOrders();
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <hr className={classes.seprator} />
      <main className={classes.main}>
        <p className={classes.mainTitle}>آیا از انصراف سفارش اطمینان دارید؟</p>
        <div className={classes.mainTable}>
          <div className={classes.tableHeader}>
            <h4 className={classes.headerTitle}>تصویر خودرو</h4>
            <h4 className={classes.headerTitle}>نام خودرو </h4>
            <h4 className={classes.headerTitle}>زمان ثبت سفارش</h4>
          </div>
          <div className={classes.tableBody}>
            <img
              src={`./dynamic-images/${orderCancelDetail?.product?.attachments?.find(
                (item) => item?.type === 6
              ).fileName}`}
              alt={orderCancelDetail?.product?.title}
              width={100}
              height={100}
            />
            <p className={classes.bodyContent}>
              {orderCancelDetail?.product?.title}
            </p>
            <p className={classes.bodyContent}>{convertedCreationTime}</p>
          </div>
        </div>
      </main>
      <footer className={classes.footer}>
        {loadingCancelOrder ? (
          <button type='button' className={classes.submitButton}>
            <Spinner isButton />
          </button>
        ) : (
          <button
            className={classes.submitButton}
            onClick={() => cancelOrderHandler()}
          >
            تایید
          </button>
        )}
      </footer>
    </>
  );
};

export default OrderCancel;
