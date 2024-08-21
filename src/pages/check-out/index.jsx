import { useEffect, useContext, useState, useRef } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import moment from 'jalali-moment';
import classes from './CheckOut.module.scss';
import parsian from '../../assets/images/psp-pasargad.png';
import MainLayout from '../../components/layout/MainLayout.jsx';
import authContext from '../../context/auth/authContext.jsx';
// import checked from '../../assets/images/checked.svg';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Spinner from '../../components/UI/spinner/index.jsx';
import Swal from 'sweetalert2';
import iranPrice from '../../helpers/iranPrice.js';
// import rules from '../../../src/assets/فرم قرارداد.pdf';
import Modal from '../../components/modals/modal/index.jsx';

import user from '../../assets/user-large.svg';

import arrowLeft from '../../assets/icons/chevron-l.svg';

const CheckOut = () => {
  const {
    getSaleDetail,
    saleDetail,
    getAgenciesForSale,
    agenciesForSale,
    getPsps,
    psps,
    commitOrder,
    loadingOrderDetail,
    // loadingAgancy,
    // loadingPsp,
    loadingCommitOrder,
  } = useContext(authContext);

  const [htmlFormContent, setHtmlFormContent] = useState(null);

  const [saleDatailData, setSaleDatailData] = useState({});
  const [colorDetail, setColorDetail] = useState(null);

  const navigate = useNavigate();

  const [agreements, setAgreements] = useState([]);

  const buttonRef = useRef(null);

  const [selectInsurance, setSelectInsurance] = useState(null);
  const [selectAgancy, setSelectAgancy] = useState(null);
  const [selectGoldenCard, setSelectGoldenCard] = useState(null);
  const [selectCarOptions, setSelectCarOptions] = useState(null);
  const [selectPackages, setSelectPackages] = useState(null);

  const [selectPsp, setSelectPsp] = useState(null);

  const { uid } = useParams();
  const [searchParams] = useSearchParams();

  const resultPayement = searchParams.get('st');
  const orderId = searchParams.get('oid');

  const getSaleDetailHandler = async (uuid, orderId = null) => {
    const response = await getSaleDetail(uuid, orderId);
    if (+response.response?.data?.error?.code === 1005) {
      Swal.fire({
        icon: 'error',
        title: 'عدم رعایت ترتیب خرید',
        confirmButtonText: `رفتن به صفحه لیست محصولات`,
      }).then(() => {
        navigate(-1);
      });
    }
  };

  useEffect(() => {
    window?.scrollTo(0, 0);
    if (orderId) {
      getSaleDetailHandler('', orderId);
    }
    getPsps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const uuid = uid ? uid : saleDetail?.saleDetailUid;
    if (uuid && !orderId) {
      getSaleDetailHandler(uuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    const uuid = uid ? uid : saleDetail?.saleDetailUid;
    if (uuid || orderId) {
      getAgenciesForSale(uuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, orderId]);

  // const carDeliverDate = saleDetail?.carDeliverDate;

  // const convertedDeliverDate =
  //   carDeliverDate?.substr(0, 2) !== "13" &&
  //   carDeliverDate?.substr(0, 2) !== "14"
  //     ? moment(carDeliverDate).locale("fa").format("jDD jMMMM jYYYY")
  //     : carDeliverDate?.substr(0, 10).replaceAll("-", "/");

  const submitOrderHandler = async (e) => {
    e.preventDefault();
    const data = {
      saleDetailUId: uid ? uid : saleDetail?.saleDetailUid,
      priorityId: 1,
      vin: 'string',
      engineNo: 'string',
      chassiNo: 'string',
      vehicle: 'string',
      agencyId: selectAgancy?.value,
      pspAccountId: selectPsp?.id,
      orderId: orderId ? orderId : null,
      saleDetailColorId: colorDetail?.id,
    };
    try {
      const response = await commitOrder(data);
      if (response?.data?.success) {
        setHtmlFormContent(
          response?.data?.result?.paymentMethodConigurations?.htmlContent
        );
      }
      if (response?.status === 403) {
        toast.error(response?.data?.error?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (htmlFormContent) {
      buttonRef.current.click();
    }
  }, [htmlFormContent]);

  let convertedTransactionCommitDate = null;

  if (orderId && saleDatailData?.transactionCommitDate) {
    convertedTransactionCommitDate =
      saleDatailData.transactionCommitDate?.substr(0, 2) !== '13' &&
      saleDatailData.transactionCommitDate?.substr(0, 2) !== '14'
        ? moment(saleDatailData.transactionCommitDate)
            .locale('fa')
            .format('jDD jMMMM jYYYY')
        : saleDatailData.transactionCommitDate
            ?.substr(0, 10)
            .replaceAll('-', '/');
  }

  useEffect(() => {
    if (saleDetail?.orderId !== 0) {
      setSaleDatailData(saleDetail);
    }
    setAgreements(
      Array.from({ length: saleDetail?.agreementDto?.length }, () => false)
    );
  }, [saleDetail]);

  // all select options values
  const insuranceOptions = saleDetail?.saleDetailInsurerDtos?.map((item) => ({
    label: `${item?.insurer?.title}  ${item?.price ? item?.price : ''}`,
    value: item?.saleDetailId,
    price: item?.price,
  }));
  const selectAgencies = agenciesForSale?.map((item) => ({
    label: item?.name,
    value: item?.id,
  }));
  const goldenCardOptions = saleDetail?.saleDetailGoldenCardDto?.map(
    (item) => ({
      label: `${item?.goldenCard?.title}  ${item?.price ? item?.price : ''}`,
      value: item?.saleDetailId,
      price: item?.price,
    })
  );

  const packageOptions = saleDetail?.saleDetailPackageDto?.map((item) => ({
    label: `(${item?.price ? item?.price : ''} ریال) ${item?.package?.title}`,
    value: item?.saleDetailId,
    price: item?.price,
  }));
  const carOptionOptions = saleDetail?.saleDetailCarOptionrDto?.map((item) => ({
    label: `(${item?.price ? item?.price : ''} ریال) ${
      item?.carOption?.title
    }  `,
    value: item?.saleDetailId,
    price: item?.price,
  }));

  const theAmountHasBeenAdded = () => {
    let price = 0;
    if (colorDetail?.price) {
      price += +colorDetail?.price;
    }
    if (selectCarOptions?.price) {
      price += +selectCarOptions?.price;
    }
    if (selectPackages?.price) {
      price += +selectPackages?.price;
    }
    if (selectInsurance?.price) {
      price += +selectInsurance?.price;
    }
    if (selectGoldenCard?.price) {
      price += +selectGoldenCard?.price;
    }
    return +price;
  };

  const finalPrice = () => {
    let price =
      saleDetail?.minimumAmountOfProxyDeposit + theAmountHasBeenAdded();

    return iranPrice(price);
  };

  return (
    <>
      <MainLayout>
        {loadingOrderDetail ? (
          <Spinner />
        ) : (
          <div className={classes.sectionWrapper}>
            {orderId && resultPayement && (
              <Modal title='عملیات پرداخت'>
                <div className={classes.transactionModalWrapper}>
                  <div className={classes.transactionCard}>
                    <div
                      className={classes.transactionReport}
                      style={{
                        backgroundColor:
                          resultPayement === '0'
                            ? '#4FBC67'
                            : resultPayement === '1' || resultPayement === '2'
                            ? '#F44E4E'
                            : null,
                      }}
                    >
                      {resultPayement === '0' ? (
                        <span>فرایند خرید با موفقیت انجام شد</span>
                      ) : resultPayement === '1' || resultPayement === '2' ? (
                        <span>عملیات پرداخت با خطا مواجه شد!</span>
                      ) : (
                        <span>اطلاعاتی برای نمایش وجود ندارد!</span>
                      )}
                    </div>

                    <div className={classes.detailsWrapper}>
                      <div>
                        <span>تاریخ تراکنش: </span>
                        <span className='faNum'>
                          {saleDatailData?.transactionCommitDate
                            ? convertedTransactionCommitDate
                            : '-'}
                        </span>
                      </div>
                    </div>

                    {resultPayement === '0' ? (
                      <Link to='/orders'>
                        <div className={classes.ctaButton}>
                          ورود به صفحه سفارشات
                        </div>
                      </Link>
                    ) : resultPayement === '1' || resultPayement === '2' ? (
                      <Link to='/products'>
                        <div className={classes.ctaButton}>تلاش مجدد</div>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Modal>
            )}

            <div className='container'>
              <div className={classes.topSection}>
                <div className={classes.topSectionHeader}>
                  <h2>ثبت اطلاعات</h2>
                  <Link to='/products' className={`${classes.back} `}>
                    <span>بازگشت به صفحه محصولات</span>
                    <img src={arrowLeft} alt='' />
                  </Link>
                </div>
                <div className={classes.topSectionContent}>
                  {/* product details */}
                  <div className={classes.productDetails}>
                    <div className={classes.imageAndName}>
                      <div className={classes.imageWrapper}>
                        <img
                          src={`../../../../dynamic-images/${
                            saleDetail?.product?.attachments?.find(
                              (item) => item?.type === 6
                            ).fileName
                          }`}
                          alt='car iamge'
                        />
                      </div>
                      <div className={classes.productName}>
                        <h3>{saleDetail?.product?.title}</h3>
                      </div>
                    </div>
                    {/* detail wrapper */}
                    <div className={classes.detailWrapper}>
                      <div>
                        <span> کلاس بدنه خودرو : </span>
                        <span>
                          {saleDetail?.carClass ? saleDetail?.carClass : '-'}
                        </span>
                      </div>
                      <div>
                        <span> نوع طرح فروش : </span>
                        <span>{saleDetail?.eSaleTypeText}</span>
                      </div>
                    </div>
                  </div>
                  {/* user details */}
                  <div className={classes.userDetails}>
                    <div className={classes.imageAndName}>
                      <div className={classes.imageWrapper}>
                        <img src={user} alt='car iamge' />
                      </div>
                      <div className={classes.userName}>
                        <h3>
                          {saleDetail?.name} {saleDetail?.surName}
                        </h3>
                      </div>
                    </div>
                    {/* detail wrapper */}
                    <div className={classes.detailWrapper}>
                      <div>
                        <span> کد ملی : </span>
                        <span>
                          {saleDetail?.nationalCode
                            ? saleDetail?.nationalCode
                            : '-'}
                        </span>
                      </div>
                      <div>
                        <span> شماره تماس : </span>
                        <span>
                          {' '}
                          {saleDetail?.nationalCode
                            ? saleDetail?.nationalCode
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* sections */}
              <div className={classes.checkout}>
                {/* right section */}

                <div className={classes.rightSection}>
                  {/* choose options */}
                  <div className={classes.chooseOptions}>
                    <h2>
                      برای مشاهده قیمت دقیق و ادامه فرآیند پرداخت گزینه های زیر
                      را انتخاب نمایید:
                    </h2>
                    <ul className={classes.options}>
                      <li className={classes.insurance}>
                        <label htmlFor=''>انتخاب بیمه</label>
                        <Select
                          placeholder={'انتخاب بیمه'}
                          options={insuranceOptions}
                          onChange={(option) => {
                            setSelectInsurance(option);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: 'none',
                              height: '62px',
                              padding: '0 22px 0 12px',
                            }),
                          }}
                        />
                      </li>
                      <li className={classes.agencies}>
                        <label htmlFor=''>انتخاب نمایندگی</label>

                        <Select
                          placeholder={'انتخاب نمایندگی'}
                          options={selectAgencies}
                          onChange={(option) => {
                            setSelectAgancy(option);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: 'none',
                              height: '62px',
                              padding: '0 22px 0 12px',
                            }),
                          }}
                        />
                      </li>
                      <li>
                        <label htmlFor=''>کارت طلایی</label>

                        <Select
                          placeholder={'انتخاب کارت طلایی'}
                          options={goldenCardOptions}
                          onChange={(option) => {
                            setSelectGoldenCard(option);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: 'none',
                              height: '62px',
                              padding: '0 22px 0 12px',
                            }),
                          }}
                        />
                      </li>
                      <li>
                        <label htmlFor=''>انتخاب پکیج</label>

                        <Select
                          placeholder={'انتخاب پکیج'}
                          options={packageOptions}
                          onChange={(options) => {
                            const tempOptions = options.reduce(
                              (prev, current) => ({
                                price: +prev?.price + +current?.price,
                                ids: [...prev.ids, current.value],
                              }),
                              { price: 0, ids: [] }
                            );
                            setSelectPackages(tempOptions);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: 'none',
                              height: '62px',
                              padding: '0 22px 0 12px',
                            }),
                          }}
                          isMulti
                        />
                      </li>
                      <li className={classes.optionsSelect}>
                        <label htmlFor=''> آپشن ها</label>

                        <Select
                          placeholder={'انتخاب آپشن ها'}
                          options={carOptionOptions}
                          onChange={(options) => {
                            const tempOptions = options.reduce(
                              (prev, current) => ({
                                price: +prev?.price + +current?.price,
                                ids: [...prev.ids, current.value],
                              }),
                              { price: 0, ids: [] }
                            );
                            setSelectCarOptions(tempOptions);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: 'none',
                              height: '62px',
                              padding: '0 22px 0 12px',
                            }),
                          }}
                          isMulti
                        />
                      </li>
                    </ul>
                  </div>
                  {/* color and prices */}
                  <div className={classes.colorAndPrice}>
                    {/* colors */}
                    <div className={classes.colorsWrapper}>
                      <span>
                        انتخاب رنگ :
                        {colorDetail?.color?.colorName
                          ? colorDetail?.color?.colorName
                          : '-'}
                      </span>
                      <ul className={classes.colors}>
                        {saleDetail?.saleDetailCarColorDto?.map((item) => (
                          <li
                            key={item?.id}
                            style={{ background: item?.color?.htmlColorCode }}
                            onClick={() => setColorDetail(item)}
                            className={
                              item?.id === colorDetail?.id
                                ? classes.active
                                : null
                            }
                          ></li>
                        ))}
                      </ul>
                    </div>
                    {/* prices */}
                    <div className={classes.prices}>
                      <div>
                        <span>قیمت اولیه محصول : </span>
                        <h4 className='faNum'>
                          <span>
                            {iranPrice(saleDetail?.minimumAmountOfProxyDeposit)}
                            &nbsp; ریال
                          </span>
                        </h4>
                      </div>
                      <div>
                        <span>مبلغ افزوده شده : </span>
                        <h4 className='faNum'>
                          <span>
                            {iranPrice(theAmountHasBeenAdded())}
                            &nbsp; ریال
                          </span>
                          +
                        </h4>
                      </div>
                      {/* total price */}
                      <div className={classes.totalPrice}>
                        <span>مبلغ نهایی : </span>
                        <h4 className='faNum'>
                          <span>{finalPrice()} &nbsp; ریال </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* left section */}
                <div className={classes.leftSection}>
                  <h2>پرداخت نهایی</h2>
                  {/* buy rules */}
                  <div className={classes.conditions}>
                    <h3>قوانین خرید</h3>
                    <ul>
                      {saleDetail?.agreementDto?.map((item, i) => (
                        <li key={item?.id}>
                          <input
                            id={`agreement${i}`}
                            type='checkbox'
                            value={agreements?.at(i)}
                            onChange={(e) => {
                              const temp = [...agreements];
                              temp[i] = e.target.checked;
                              setAgreements(temp);
                            }}
                          />
                          <label htmlFor={`agreement${i}`}></label>

                          <span>{item?.body}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* psps */}
                  <div className={classes.psps}>
                    <h3>انتخاب درگاه پرداخت</h3>
                    <ul>
                      {psps?.map((psp, index) => (
                        <li
                          key={index}
                          onClick={() => setSelectPsp(psp)}
                          className={
                            selectPsp?.id === psp.id
                              ? classes.selectedPSP
                              : null
                          }
                        >
                          <img src={parsian} alt={psp.psp} />
                        </li>
                      ))}
                    </ul>
                    {
                      // allFields.allConditionsAgreement &&
                      agreements?.every((item) => item) &&
                      selectAgancy &&
                      selectInsurance &&
                      selectGoldenCard &&
                      selectCarOptions &&
                      selectPackages &&
                      colorDetail?.id &&
                      selectPsp ? (
                        <button onClick={(e) => submitOrderHandler(e)}>
                          {loadingCommitOrder ? <Spinner isButton /> : 'پرداخت'}
                        </button>
                      ) : (
                        <button className='disabled'>پرداخت</button>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>

            <section>
              {htmlFormContent && (
                <div
                  dangerouslySetInnerHTML={{ __html: htmlFormContent }}
                ></div>
              )}
              <button ref={buttonRef} form='form1' type='submit'></button>
            </section>
          </div>
        )}
      </MainLayout>
    </>
  );
};

export default CheckOut;
