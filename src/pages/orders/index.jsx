import { useContext, useEffect, useState } from 'react';
import Select, { components } from 'react-select';

import MainLayout from '../../components/layout/MainLayout';
import OrderItem from '../../components/orders/OrderItem';
import OrderCancel from '../../components/orders/OrderCancel';

import authContext from '../../context/auth/authContext';
import { DatePicker } from 'react-advance-jalaali-datepicker';

import classes from './Orders.module.scss';
import Spinner from '../../components/UI/spinner';

// import shakhsBeShakhs from "../../../src/assets/وکالت شخص به شخص.pdf";
// import shakhsBeSherkat from "../../../src/assets/وکالت به شرکت.pdf";
// import downloadIcon from '../../assets/images/icons/download-orders.svg';
import Modal from '../../components/modals/modal';
import moment from 'jalali-moment';

const DatePickerInput = (props) => {
  return <input className='popo' {...props} />;
};

const titles = [
  { title: 'شماره ردیف', class: 'smallWidth' },
  { title: 'نام خودرو', class: 'largeWidth' },
  { title: 'شماره پیگیری', class: 'mediumWidth' },
  { title: 'زمان ثبت سفارش', class: 'largeWidth' },
  { title: 'تاریخ تحویل', class: 'largeWidth' },
  { title: 'مبلغ', class: 'mediumWidth' },
  { title: 'وضعیت', class: 'mediumWidth' },
  { title: 'رسید پرداخت', class: 'mediumWidth' },
  { title: 'قرارداد', class: 'mediumWidth' },
];

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className='custom-css-class'>موردی وجود ندارد</span>
    </components.NoOptionsMessage>
  );
};
const paymentTypeOptions = [
  { label: 'همه', value: 0 },
  { label: 'پرداخت موفق', value: 70 },
  { label: 'پرداخت ناموفق', value: 80 },
  { label: 'در انتظار پرداخت', value: 10 },
];

const Orders = () => {
  const [showModal, setShowModal] = useState(false);
  const { getOrders, orders, loadingOrders } = useContext(authContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderCancelDetail, setOrderCancelDetail] = useState(null);

  const [filteredOrders, setFilteredOrders] = useState(orders);

  const [paymentType, setPayemntType] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [showModal]);

  useEffect(() => {
    let finalOrders = orders;
    if (paymentType?.value === 0 || !paymentType) {
      finalOrders = orders;
    } else if (paymentType?.value) {
      finalOrders = finalOrders.filter(
        (order) => order.orderStatusCode === paymentType?.value
      );
    }

    if (dateFrom) {
      const convertedDateFrom = moment(dateFrom, 'jYYYY/jMM/jD').format(
        'YYYY-MM-DDT00:00:00'
      );
      finalOrders = finalOrders.filter(
        (order) =>
          moment(order.creationTime).format('YYYY-MM-DD') > convertedDateFrom
      );
    }
    if (dateTo) {
      const convertedDateTo = moment(dateTo, 'jYYYY/jMM/jD').format(
        'YYYY-MM-DD'
      );
      finalOrders = finalOrders.filter(
        (order) =>
          moment(order.creationTime).format('YYYY-MM-DD') <= convertedDateTo
      );
    }

    setFilteredOrders(finalOrders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType, orders, dateFrom, dateTo]);

  const clearFilters = () => {
    setPayemntType(null);
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <MainLayout>
      {showModal && (
        <Modal setIsModalVisible={setShowModal} title='امضای قرارداد'>
          <p className={classes.modalContent}>
            پیامک حاوی لینک قرارداد برای شما ارسال شد!
          </p>
          <div className={classes.modalLine}></div>
        </Modal>
      )}
      <div className={classes.bgWrapper}>
        <div className={classes.topSection}>
          <h1>سفارشات</h1>
        </div>

        <div className='container'>
          <div className={classes.filters}>
            <div className={classes.inputWrapper}>
              <DatePicker
                inputComponent={DatePickerInput}
                format='jYYYY/jMM/jDD'
                placeholder='از تاریخ'
                onChange={(unix, formatted) => {
                  setDateFrom(formatted);
                }}
                cancelOnBackgroundClick={true}
              />
            </div>
            <div className={classes.inputWrapper}>
              <DatePicker
                inputComponent={DatePickerInput}
                format='jYYYY/jMM/jDD'
                placeholder='تا تاریخ'
                onChange={(unix, formatted) => {
                  setDateTo(formatted);
                }}
                cancelOnBackgroundClick={true}
              />
            </div>
            <Select
              components={{ NoOptionsMessage }}
              options={paymentTypeOptions}
              placeholder='برند های خودرو'
              className={classes.select}
              onChange={(option) => setPayemntType(option)}
              styles={{
                control: (base) => ({
                  ...base,
                  boxShadow: 'none',
                }),
              }}
              isSearchable={true}
            />
          </div>

          <section className={classes.sectionWrapper}>
            {/* <div className={classes.vekalat}> */}
            {/* <a href={shakhsBeShakhs}>
            <img src={downloadIcon} alt="download icon" />
            <span>دانلود نمونه وکالت نامه شخص به شخص</span>
          </a> */}
            {/* <a href={shakhsBeSherkat}>
            <img src={downloadIcon} alt="download icon" />
            <span>دانلود نمونه وکالت نامه شخص به شرکت</span>
          </a> */}
            {/* </div> */}
            {loadingOrders ? (
              <Spinner />
            ) : (
              <>
                {orders?.length === 0 ? (
                  <div className={classes.noOrder}>
                    شما هیچ سفارش ثبت شده ای ندارید.
                  </div>
                ) : (
                  <>
                    <div className={classes.tableWrapper}>
                      <div className={classes.tableHeader}>
                        {titles.map((item, index) => (
                          <div
                            key={index}
                            className={`${classes.titleContainer} ${
                              classes[item.class]
                            }`}
                          >
                            <h4 className={classes.title}>{item.title}</h4>
                          </div>
                        ))}
                      </div>
                      <div className={classes.tableBody}>
                        {filteredOrders?.map((order, index) => {
                          return (
                            <OrderItem
                              setShowModal={setShowModal}
                              order={order}
                              key={order?.orderId}
                              index={index}
                              setIsModalVisible={setIsModalVisible}
                              setOrderCancelDetail={setOrderCancelDetail}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      {isModalVisible && (
        <Modal setIsModalVisible={setIsModalVisible} title='انصراف از سفارش'>
          <OrderCancel
            setIsModalVisible={setIsModalVisible}
            orderCancelDetail={orderCancelDetail}
          />
        </Modal>
      )}
    </MainLayout>
  );
};

export default Orders;
