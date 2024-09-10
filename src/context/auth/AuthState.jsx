import { useReducer } from 'react';
import api from '../../api';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import { toast } from 'react-toastify';


import {
  LOGIN_USER,
  LOADING_USER,
  LOADING_USER_FINISH,
  LOGOUT_USER,
  GET_USER,
  EDIT_USER,
  SET_NATIONAL_CODE,
  GET_BANKS,
  GET_PROVINCES,
  GET_CITIES,
  GET_SALETYPES,
  GET_COMPANIES,
  GET_COMPANY_SALES,
  GET_ORDERS,
  LOADING_CARS,
  LOADING_CARS_FINISH,
  LOADING_ORDERS,
  LOADING_ORDERS_FINISH,
  REGISTER_USER,
  GET_SALE_DETAIL,
  GET_AGENCIES,
  GET_AGENCIES_FOR_SALE,
  GET_PSPS,
  SET_USER_LOGIN,
  LOADING_ORDER_DETAIL,
  LOADING_ORDER_DETAIL_FINISH,
  LOADING_AGANCY,
  LOADING_AGANCY_FINISH,
  LOADING_PSP,
  LOADING_PSP_FINISH,
  LOADING_COMMIT_ORDER,
  LOADING_COMMIT_ORDER_FINISH,
  REMOVE_OTP_COUNTER,
  LOADING_USER_START,
  GET_PRODUCT_LIST_DATA,
  LOADING_PRODUCT_LIST_DATA,
  LOADING_PRODUCT_LIST_DATA_FINISH,
  GET_HOME_PAGE_DATA,
  LOADING_HOME_PAGE_START,
  LOADING_HOME_PAGE_FINISH,
  LOADING__ANNOUNCEMENTS_START,
  LOADING__ANNOUNCEMENTS_FINISH,
  LOADING_SEND_SMS_START,
  LOADING_SEND_SMS_FINISH,
  GET_ANNOUNCEMENTS,
  LOADING_PRODUCT_DETAILS_START,
  LOADING_PRODUCT_DETAILS_FINISH,
  GET_PRODUCT_DETAILS,
  GET_FACTOR,
  LOADING_SIGN_CONTRACT_START,
  LOADING_SIGN_CONTRACT_FINISH,
  LOADING_GET_CONTRACT_START,
  LOADING_GET_CONTRACT_FINISH,
  GET_Footer_PAGE_DATA,
} from '../types';
import moment from 'jalali-moment';
import persianToNumber from '../../helpers/convertNumber/persianToNumber';

import { initialState } from '../initialState';


const AuthState = (props) => {
  const token = localStorage.getItem('token');
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  api.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const [state, dispatch] = useReducer(AuthReducer, initialState);
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (401 === error.response.status) {
        logoutUser();
        window.location.href = '/';
      } else {
        return Promise.reject(error);
      }
    }
  );

  // logout user
  const logoutUser = () => {
    dispatch({
      type: LOGOUT_USER,
    });
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // login user
  const loginUser = async (data) => {
    loadingUserstart();

    try {
      const response = await api.post(
        `${window.config.user}/TokenAuth/Authenticate`,
        JSON.stringify(data)
      );

      if (response?.data?.success && response?.status === 200) {
        localStorage.setItem('token', response?.data?.result?.accessToken);
        dispatch({
          type: LOGIN_USER,
          payload: response?.data?.result?.accessToken,
        });
      } else {
        loadingUserFinish();
      }

      return response?.data;
    } finally {
      loadingUserFinish();
    }
  };

  // register user
  const registerUser = async (data) => {
    const formattedBirthDate = moment(data?.birthDate, 'jYYYY/jMM/jD').format(
      'YYYY-MM-DDT00:00:00'
    );
    const formattedIssuingDate = moment(
      data?.issuingDate,
      'jYYYY/jMM/jD'
    ).format('YYYY-MM-DDT00:00:00');

    const allData = {
      ...data,
      mobile: persianToNumber(data.mobile),
      tel: persianToNumber(data.tel),
      postalCode: persianToNumber(data.postalCode),
      smsCode: persianToNumber(data.smsCode),
      birthDate: formattedBirthDate,
      issuingDate: formattedIssuingDate,
      preTel: persianToNumber(data?.tel?.substr(0, 3)),
    };

    loadingUserstart();
    try {
      const response = await api.post(
        `${window.config.user}/services/app/User/Create`,
        JSON.stringify(allData)
      );
      if (response?.status === 200 && response?.data?.success) {
        loadingUserFinish();
        // dispatch({ type: REGISTER_USER });
        toast.success('ثبت نام با موفقیت انجام شد');

        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return response.data;
      }
    } finally {
      loadingUserFinish();
    }
  };

  // get user profile data
  const getUser = async (token) => {
    loadingUserstart();
    try {
      const response = await api.get(
        `${
          window.config.user
        }/services/app/User/GetUserProfile`
      );
      if (response?.data?.success && response?.status === 200) {
        dispatch({
          type: GET_USER,
          payload: { userData: response?.data?.result, token: token },
        });
        return response?.data;
      }
      loadingUserFinish();
    } finally {
      loadingUserFinish();
    }
  };

  // edit user profile
  const editUser = async (data) => {
    const editData = data;
    delete editData.bankId;
    loadingUserstart();

    const formattedBirthDate =
      data?.birthDate?.substr(0, 2) !== '13' &&
      data?.birthDate?.substr(0, 2) !== '14'
        ? data?.birthDate
        : moment(data?.birthDate, 'jYYYY/jMM/jD').format('YYYY-MM-DDT00:00:00');

    const formattedIssuingDate =
      data?.issuingDate?.substr(0, 2) !== '13' &&
      data?.issuingDate?.substr(0, 2) !== '14'
        ? data?.issuingDate
        : moment(data?.issuingDate, 'jYYYY/jMM/jD').format(
            'YYYY-MM-DDT00:00:00'
          );

    try {
      const response = await api.post(
        `${
          window.config.user
        }/services/app/User/UpdateUserProfile`,
        JSON.stringify({
          ...data,
          preTel: persianToNumber(data?.tel?.substr(0, 3)),
          mobile: persianToNumber(data.mobile),
          tel: persianToNumber(data.tel),
          postalCode: persianToNumber(data.postalCode),
          smsCode: persianToNumber(data.smsCode),
          // regionId: persianToNumber(data.regionId),
          birthDate: formattedBirthDate,
          issuingDate: formattedIssuingDate,
        })
      );
      dispatch({
        type: EDIT_USER,
        payload: response.data,
      });
      loadingUserFinish();
      dispatch({ type: REMOVE_OTP_COUNTER });
      return response.data;
    } finally {
      loadingUserFinish();
    }
  };

  // check if user is auth in white list
  const authUserNationalCode = async (data) => {
    loadingUserstart();
    try {
      const response = await api.post(
        `${
          window.config.user
        }/services/app/BaseInformationService/RegistrationValidation`,
        JSON.stringify(data)
      );

      if (response?.data?.success) {
        dispatch({ type: SET_NATIONAL_CODE, payload: data?.nationalCode });
      }
      loadingUserFinish();
      return response;
    } finally {
      loadingUserFinish();
    }
  };

  // ORDERS
  // delete Account
  const deleteAccount = async (userSmsCode) => {
    loadingUserstart();
    try {
      const response = await api.post(
        `${
          window.config.order
        }/services/app/OrderService/InsertUserRejectionAdvocacyPlan?userSmsCode=${persianToNumber(
          userSmsCode
        )}`,
        {}
      );
      if (response?.data?.success) {
        return response.data;
      }
      loadingUserFinish();
    } finally {
      loadingUserFinish();
    }
  };

  // get user order list

  const getOrders = async () => {
    loadingOrdersStart();
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/OrderService/GetCustomerOrderList`
      );

      if (response?.data?.success) {
        dispatch({
          type: GET_ORDERS,
          payload: response?.data?.result?.orderList,
        });

        loadingOrdersFinish();
      }
    } finally {
      loadingUserFinish();
    }
  };

  // cancel order
  const cancelOrder = async (orderId) => {
    try {
      const response = await api.post(
        `${
          window.config.order
        }/services/app/OrderService/CancelOrder?orderId=${orderId}`,
        {}
      );
      if (response?.data?.success) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // send sms
  const loadingSendSmsStart = () => dispatch({ type: LOADING_SEND_SMS_START });
  const loadingSendSmsFinish = () =>
    dispatch({ type: LOADING_SEND_SMS_FINISH });

  const sendOtp = async (data) => {
    loadingSendSmsStart();
    try {
      const response = await api.post(
        `${
          window.config.user
        }/services/app/SendBox/SendSms`,
        JSON.stringify({ ...data })
      );
      loadingSendSmsFinish();
      return response;
    } finally {
      loadingSendSmsFinish();
    }
  };

  // Forget Password
  const forgetPassword = async (data) => {
    try {
      const response = await api.post(
        `${
          window.config.user
        }/services/app/User/ForgotPassword`,
        JSON.stringify({ ...data })
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // change Password
  const changePassword = async (data) => {
    loadingUserstart();

    try {
      const response = await api.post(
        `${
          window.config.user
        }/services/app/User/changePassword`,
        JSON.stringify({ ...data, ct: 'test', smsLocation: 6 })
      );
      loadingUserFinish();
      return response;
    } finally {
      loadingUserFinish();
    }
  };

  // get recaptcha code
  const getRecaptcha = async (tenDigitNumber) => {
    try {
      const response = await api.get(
        `${window.config.captcha}/${tenDigitNumber}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // COMPANY AND SALES
  // get companies
  const getCompanies = async () => {
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/BaseInformationService/GetCompanies`
      );

      if (response?.data?.success) {
        dispatch({ type: GET_COMPANIES, payload: response.data.result });
        return response?.data?.result;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get Sale Types
  const getSaleTypes = async () => {
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/SaleService/GetSaleTypes`
      );
      if (response?.data?.success) {
        dispatch({ type: GET_SALETYPES, payload: response.data.result });

        return response?.data?.result;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get company sales
  const getCompanySales = async (companyId) => {
    loadingCarsStart();

    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/SaleService/GetSaleDetails?companyId=${companyId}`
      );
      if (response?.data?.success) {
        dispatch({ type: GET_COMPANY_SALES, payload: response.data.result });
        loadingCarsFinish();
        return response?.data?.result;
      }
    } finally {
      loadingCarsFinish();
    }
  };

  // get banks
  const getBanks = async () => {
    try {
      const response = await api.get(
        `${window.config.order}/services/app/Bank/GetList`
      );
      dispatch({ type: GET_BANKS, payload: response.data.result });
    } catch (error) {
      console.log(error);
    }
  };

  // CITY AND PROVINCES

  // get provinces
  const getProvinces = async () => {
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/BaseInformationService/GetProvince`
      );
      dispatch({ type: GET_PROVINCES, payload: response?.data?.result });
    } catch (error) {
      console.log(error);
    }
  };

  // get cities
  const getCities = async (provinceId = 1) => {
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/BaseInformationService/GetCities?ProvienceId=${provinceId}`
      );
      dispatch({ type: GET_CITIES, payload: response.data.result });
      return response.data.result;
    } catch (error) {
      console.log(error);
    }
  };
  const loadingUserStart = () => dispatch({ type: LOADING_USER_START });

  // loading product and list data
  const loadingProductListDataStart = () =>
    dispatch({ type: LOADING_PRODUCT_LIST_DATA });
  const loadingProductListDataFinish = () =>
    dispatch({ type: LOADING_PRODUCT_LIST_DATA_FINISH });

  const getProductAndSaleListData = async (data) => {
    loadingProductListDataStart();
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/ProductAndCategory/GetProductAndSaleDetailList${data}`
      );

      if (response?.data?.success) {
        dispatch({
          type: GET_PRODUCT_LIST_DATA,
          payload: response?.data?.result,
        });
        loadingProductListDataFinish();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // loading product and list data
  const loadingProductDetailsStart = () =>
    dispatch({ type: LOADING_PRODUCT_DETAILS_START });
  const loadingProductDetailsFinish = () =>
    dispatch({ type: LOADING_PRODUCT_DETAILS_FINISH });

  const getProductDetails = async (producData) => {
    loadingProductDetailsStart();
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/ProductAndCategory/GetList${producData}`
      );

      if (response?.data?.success) {
        dispatch({
          type: GET_PRODUCT_DETAILS,
          payload: response?.data?.result,
        });
        loadingProductDetailsFinish();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // set user login
  const setUserLogin = () => {
    dispatch({ type: SET_USER_LOGIN });
  };

  // LOADINGS

  // loading user
  const loadingUserstart = () => dispatch({ type: LOADING_USER });
  const loadingUserFinish = () => dispatch({ type: LOADING_USER_FINISH });
  // loading cars
  const loadingCarsStart = () => dispatch({ type: LOADING_CARS });
  const loadingCarsFinish = () => dispatch({ type: LOADING_CARS_FINISH });

  // loading orders
  const loadingOrdersStart = () => dispatch({ type: LOADING_ORDERS });
  const loadingOrdersFinish = () => dispatch({ type: LOADING_ORDERS_FINISH });

  // loading order detail
  const loadingOrderDetailStart = () =>
    dispatch({ type: LOADING_ORDER_DETAIL });
  const loadingOrderDetailFinish = () =>
    dispatch({ type: LOADING_ORDER_DETAIL_FINISH });

  // loading psp
  const loadingPspStart = () => dispatch({ type: LOADING_PSP });
  const loadingPspFinish = () => dispatch({ type: LOADING_PSP_FINISH });

  const hasCapacityCar = async (uid) => {
    loadingUserstart();

    try {
      const response = await api.post(
        `${
          window.config.order
        }/services/app/CapacityControl/Validation?saleDetailUId=${uid}`,
        {}
      );

      loadingUserFinish();
      return response;
    } finally {
      loadingUserFinish();
    }
  };

  // get company sales
  const getSaleDetail = async (uid, orderId) => {
    loadingCarsStart();
    let data = { saleDetailUid: uid };

    if (orderId) {
      data = { orderId: orderId };
    }

    try {
      loadingOrderDetailStart();
      const response = await api.post(
        `${
          window.config.order
        }/services/app/OrderService/GetDetail`,
        JSON.stringify(data)
      );
      if (response?.data?.success) {
        dispatch({ type: GET_SALE_DETAIL, payload: response.data.result });
        loadingOrderDetailFinish();
        return response?.data?.result;
      }
      loadingOrderDetailFinish();
    } catch (error) {
      loadingOrderDetailFinish();
    }
  };

  // loading agancy
  const loadingAgancyStart = () => dispatch({ type: LOADING_AGANCY });
  const loadingAgancyFinish = () => dispatch({ type: LOADING_AGANCY_FINISH });

  const getAgenciesForSale = async (uid) => {
    try {
      loadingAgancyStart();

      const response = await api.get(
        `${
          window.config.order
        }/services/app/BaseInformationService/GetAgencies?saleDetailUid=${uid}`
      );
      if (response?.data?.success) {
        dispatch({
          type: GET_AGENCIES_FOR_SALE,
          payload: response?.data?.result,
        });
        loadingAgancyFinish();
      }
    } finally {
      loadingAgancyFinish();
    }
  };

  const getAgencies = async (provinceId) => {
    let url = `${
      window.config.order
    }/services/app/AgencyService/GetList`;
    if (provinceId) {
      url += `?provinceId=${provinceId}`;
    }

    try {
      loadingAgancyStart();

      const response = await api.get(url);
      if (response?.data?.success) {
        dispatch({
          type: GET_AGENCIES,
          payload: response?.data?.result,
        });
        loadingAgancyFinish();
      }
    } finally {
      loadingAgancyFinish();
    }
  };

  // get psps
  const getPsps = async () => {
    try {
      loadingPspStart();
      const response = await api.get(
        `${
          window.config.payment
        }/services/app/PaymentService/GetPsps`
      );
      dispatch({ type: GET_PSPS, payload: response?.data?.result });
      loadingPspFinish();
    } catch (error) {
      loadingPspFinish();
      console.log(error);
    }
  };

  // commit order
  const setOrder = async (id, priorityId, vehicle, vin, engineNo, chassiNo) => {
    loadingUserstart();
    const parameters =
      vin === ''
        ? { saleDetailUId: id, priorityId }
        : { saleDetailUId: id, priorityId, vehicle, vin, engineNo, chassiNo };
    try {
      const response = await api.post(
        `${
          window.config.order
        }/services/app/OrderService/CommitOrder`,
        JSON.stringify(parameters)
      );
      if (response?.status === 200 && response?.data?.success) {
        loadingUserFinish();
        return response;
      }
      loadingUserFinish();
    } finally {
      loadingUserFinish();
    }
  };

  // loading commit order diesel
  const loadingCommitOrderStart = () =>
    dispatch({ type: LOADING_COMMIT_ORDER });
  const loadingCommitOrderFinish = () =>
    dispatch({ type: LOADING_COMMIT_ORDER_FINISH });

  // commit order
  const commitOrder = async (data) => {
    try {
      loadingCommitOrderStart();

      const response = await api.post(
        `${
          window.config.order
        }/services/app/OrderService/CommitOrder`,
        JSON.stringify(data)
      );
      if (response?.status === 200 && response?.data?.success) {
        loadingCommitOrderFinish();
        return response;
      }
      loadingCommitOrderFinish();
    } finally {
      loadingCommitOrderFinish();
    }
  };

  // address inquiry
  const addressInquiry = async (zipCode, nationalCode) => {
    try {
      const response = await api.get(
        `${
          window.config.user
        }/services/app/BaseInformationService/AddressInquiry?zipCod=${zipCode}&nationalCode=${nationalCode}`
      );
      if (response?.data?.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadingHomePageStart = () =>
    dispatch({ type: LOADING_HOME_PAGE_START });
  const loadingHomePageFinish = () =>
    dispatch({ type: LOADING_HOME_PAGE_FINISH });

  const GetFooterData = async (location) =>{
   // loadingHomePageStart();
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/SiteStructureService/GetList?location=${location}`
      );
      dispatch({
        type: GET_Footer_PAGE_DATA,
        payload: response?.data?.result,
      });
  //    loadingHomePageFinish();
    } catch (error) {
      console.log(error);
    } finally {
  //    loadingHomePageFinish();
    }
  };

  const getHomePageData = async (location) => {
    loadingHomePageStart();

    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/SiteStructureService/GetList?location=${location}`
      );

      dispatch({
        type: GetFooterData,
        payload: response?.data?.result,
      });
      loadingHomePageFinish();
    } catch (error) {
      console.log(error);
    } finally {
      loadingHomePageFinish();
    }
  };

  //  get announcements
  const loadingAnnoucementsStart = () =>
    dispatch({ type: LOADING__ANNOUNCEMENTS_START });
  const loadingAnnoucementsFinish = () =>
    dispatch({ type: LOADING__ANNOUNCEMENTS_FINISH });
  const getAnnouncements = async () => {
    loadingAnnoucementsStart();
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/AnnouncementService/GetPagination?Sorting=CreationTime&SortingType=2&MaxResultCount=50`
      );

      if (response?.data?.success) {
        dispatch({
          type: GET_ANNOUNCEMENTS,
          payload: response?.data?.result?.items,
        });
      }
    } finally {
      loadingAnnoucementsFinish();
    }
  };

  const loadingGetContractStart = () =>
    dispatch({ type: LOADING_GET_CONTRACT_START });
  const loadingGetContractFinish = () =>
    dispatch({ type: LOADING_GET_CONTRACT_FINISH });

  const getContract = async (ticketId) => {
    loadingGetContractStart();
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/SignService/Inquiry?ticketId=${ticketId}`
      );

      if (response?.data?.success) {
        window.open(response?.data?.result?.signedDocumentLink, '_blank');
      }
      loadingGetContractFinish();
    } catch (error) {
      loadingGetContractFinish();
      console.log(error);
    }
  };
  const getFactor = async (orderId) => {
    localStorage.removeItem('factor');
    try {
      const response = await api.get(
        `${
          window.config.order
        }/services/app/OrderReportService/RptFactor?orderId=${orderId}`
      );

      if (response?.data?.success) {
        dispatch({
          type: GET_FACTOR,
          payload: response?.data?.result,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadingSignContractStart = () =>
    dispatch({ type: LOADING_SIGN_CONTRACT_START });
  const loadingSignContractFinish = () =>
    dispatch({ type: LOADING_SIGN_CONTRACT_FINISH });

  const signContract = async (orderId) => {
    loadingSignContractStart();
    try {
      const response = await api.post(
        `${
          window.config.order
        }/services/app/SignService/ContractSign`,
        JSON.stringify({ orderId: orderId })
      );
      if (response?.data?.success) {
        return response?.data;
      }
      loadingSignContractFinish();
    } finally {
      loadingSignContractFinish();
    }
  };

  const validateSaleProduct = async (uuid) => {
    const response = await api.post(
      `${
        window.config.order
      }/services/app/CapacityControl/Validation?saleDetailUId=${uuid}`
    );

    if (response?.data?.success && response?.status === 200) {
      return response?.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        loadingUserFinish,
        loadingUserstart,
        registerUser,
        logoutUser,
        getUser,
        editUser,
        sendOtp,
        forgetPassword,
        changePassword,
        getRecaptcha,
        authUserNationalCode,
        getBanks,
        getProvinces,
        getCities,
        getCompanies,
        getSaleTypes,
        getCompanySales,
        setOrder,
        getOrders,
        cancelOrder,
        deleteAccount,
        hasCapacityCar,
        getSaleDetail,
        getAgenciesForSale,
        getAgencies,
        getPsps,
        commitOrder,
        setUserLogin,
        addressInquiry,
        loadingUserStart,
        getProductAndSaleListData,
        getHomePageData,
        GetFooterData,
        getAnnouncements,
        getProductDetails,
        getContract,
        getFactor,
        signContract,
        validateSaleProduct,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
