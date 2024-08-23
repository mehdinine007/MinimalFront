import {
  LOGIN_USER,
  LOADING_USER,
  LOGOUT_USER,
  LOADING_USER_FINISH,
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
  LOADING_ORDERS,
  LOADING_ORDERS_FINISH,
  LOADING_CARS,
  LOADING_CARS_FINISH,
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
  SET_OTP_COUNTER,
  REMOVE_OTP_COUNTER,
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
  GET_PRODUCT_DETAILS,
  LOADING_PRODUCT_DETAILS_START,
  LOADING_PRODUCT_DETAILS_FINISH,
  GET_FACTOR,
  LOADING_SIGN_CONTRACT_START,
  LOADING_SIGN_CONTRACT_FINISH,
  LOADING_GET_CONTRACT_START,
  LOADING_GET_CONTRACT_FINISH,
} from '../types';

import { initialState } from '../initialState';

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        token: `Bearer ${action.payload}`,
        loadingUser: false,
        isUserLogin: true,
      };
    case SET_USER_LOGIN:
      return {
        ...state,
        isUserLogin: true,
      };

    case LOGOUT_USER:
      return {
        ...initialState,
        companies: state.companies,
        isUserLogin: false,
      };
    case REGISTER_USER:
      return { ...initialState, companies: state.companies };
    case GET_USER:
      return {
        ...state,
        userProfileData: action.payload.userData,
        isUserLogin: true,
        loadingUser: false,
        token: action.payload.token,
      };
    case EDIT_USER:
      return {
        ...state,
        userProfileData: action.payload,
        loadingUser: false,
      };
    case SET_NATIONAL_CODE:
      return {
        ...state,
        loadingUser: false,
        nationalCode: action.payload,
        isUserAuth: true,
      };
    case GET_BANKS:
      return {
        ...state,
        banks: action.payload,
      };
    case GET_PROVINCES:
      return {
        ...state,
        provinces: action.payload,
      };
    case GET_CITIES:
      return {
        ...state,
        cities: action.payload,
      };
    case GET_SALETYPES:
      return {
        ...state,
        saleTypes: action.payload,
        companySales: [],
      };
    case GET_COMPANIES:
      return {
        ...state,
        companies: action.payload,
      };
    case GET_COMPANY_SALES:
      return {
        ...state,
        companySales: action.payload,
      };
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };

    case GET_SALE_DETAIL:
      return {
        ...state,
        saleDetail: action.payload,
      };
    case GET_AGENCIES_FOR_SALE:
      return {
        ...state,
        agenciesForSale: action.payload,
      };

    case GET_AGENCIES:
      return {
        ...state,
        agencies: action.payload,
      };
    case GET_PSPS:
      return {
        ...state,
        psps: action.payload,
      };

    case GET_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: action.payload,
      };

    case GET_FACTOR:
      return {
        ...state,
        factor: action.payload,
      };

    case LOADING_USER:
      return { ...state, loadingUser: true };
    case LOADING_USER_FINISH:
      return { ...state, loadingUser: false };
    case LOADING_ORDERS:
      return { ...state, loadingOrders: true };
    case LOADING_ORDERS_FINISH:
      return { ...state, loadingOrders: false };
    case LOADING_CARS:
      return { ...state, loadingCars: true };
    case LOADING_CARS_FINISH:
      return { ...state, loadingCars: false };
    case LOADING_ORDER_DETAIL:
      return { ...state, loadingOrderDetail: true };
    case LOADING_ORDER_DETAIL_FINISH:
      return { ...state, loadingOrderDetail: false };
    case LOADING_AGANCY:
      return { ...state, loadingAgancy: true };
    case LOADING_AGANCY_FINISH:
      return { ...state, loadingAgancy: false };
    case LOADING_PSP:
      return { ...state, loadingPsp: true };
    case LOADING_PSP_FINISH:
      return { ...state, loadingPsp: false };
    case LOADING_COMMIT_ORDER:
      return { ...state, loadingCommitOrder: true };
    case LOADING_COMMIT_ORDER_FINISH:
      return { ...state, loadingCommitOrder: false };
    case LOADING_PRODUCT_LIST_DATA:
      return { ...state, loadingProductListData: true };
    case LOADING_PRODUCT_LIST_DATA_FINISH:
      return { ...state, loadingProductListData: false };
    case LOADING_HOME_PAGE_START:
      return { ...state, loadingHomePageData: true };
    case LOADING_HOME_PAGE_FINISH:
      return { ...state, loadingHomePageData: false };
    case GET_PRODUCT_LIST_DATA:
      return { ...state, productAndSaleListData: action.payload };
    case GET_PRODUCT_DETAILS:
      return { ...state, productDetails: action.payload };
    case GET_HOME_PAGE_DATA:
      return { ...state, homePageData: action.payload };
    case SET_OTP_COUNTER:
      return { ...state, isOtpCounter: true };
    case REMOVE_OTP_COUNTER:
      return { ...state, isOtpCounter: false };
    case LOADING_SEND_SMS_START:
      return { ...state, loadingSendSms: true };
    case LOADING_SEND_SMS_FINISH:
      return { ...state, loadingSendSms: false };
    case LOADING_PRODUCT_DETAILS_START:
      return { ...state, loadingProductDetails: true };
    case LOADING_PRODUCT_DETAILS_FINISH:
      return { ...state, loadingProductDetails: false };

    case LOADING_SIGN_CONTRACT_START:
      return { ...state, loadingSignContract: true };
    case LOADING_SIGN_CONTRACT_FINISH:
      return { ...state, loadingSignContract: false };
    case LOADING_GET_CONTRACT_START:
      return { ...state, loadingGetContract: true };
    case LOADING_GET_CONTRACT_FINISH:
      return { ...state, loadingGetContract: false };

    case LOADING__ANNOUNCEMENTS_START:
      return {
        ...state,
        loadingAnnouncements: true,
      };
    case LOADING__ANNOUNCEMENTS_FINISH:
      return {
        ...state,
        loadingAnnouncements: false,
      };

    default:
      return state;
  }
};

export default authReducer;
