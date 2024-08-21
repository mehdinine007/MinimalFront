import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Spinner from '../../components/UI/spinner';
import loginValidate from '../../helpers/validation/loginValidate';
import authContext from '../../context/auth/authContext';
import persianToNumber from '../../helpers/convertNumber/persianToNumber';
import classes from './Login.module.scss';
import MainLayout from '../../components/layout/MainLayout';
import AuthLayout from '../../components/layout/AuthLayout';

import openEye from '../../assets/icons/eye-open.svg';
import closeEye from '../../assets/icons/eye-close.svg';

import Modal from '../../components/modals/modal';
import FrogetPassword from '../../components/modals/forget-password';

const LoginPage = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { loginUser, loadingUser } = useContext(authContext);

  const [passwordType, setPasswordType] = useState(true);

  const [loginData, setLoginData] = useState({
    nationalCode: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const changeHandler = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    window?.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const hasError = Object.keys(loginValidate(loginData)).length;

    if (hasError) {
      setErrors(loginValidate(loginData));
    } else {
      const response = await loginUser({
        userNameOrEmailAddress: persianToNumber(loginData?.nationalCode),
        password: loginData?.password,
      });

      if (response?.success) {
        navigate('/');
        toast.success('ورود با موفقیت انجام گردید!');
      }
    }
  };

  return (
    <MainLayout>
      {showModal && (
        <Modal
          title='بازیابی رمز عبور'
          widthInnerModal='800px'
          setIsModalVisible={setShowModal}
        >
          <FrogetPassword />
        </Modal>
      )}
      <AuthLayout title='ورود'>
        <div className={classes.formWrapper}>
          <form onSubmit={submitHandler}>
            <div className={classes.inputWrapper}>
              <label
                className={`${
                  loginData?.nationalCode ? classes.inputHasData : null
                }`}
              >
                نام کاربری
              </label>
              <input
                type='text'
                value={loginData?.nationalCode}
                name='nationalCode'
                onChange={changeHandler}
                className={errors.nationalCode && classes.inputError}
                placeholder='نام کاربری خود را وارد کنید'
              />

              {errors.nationalCode && <span>{errors.nationalCode}</span>}
            </div>

            <div className={classes.inputWrapper}>
              <label
                className={`${
                  loginData?.password ? classes.inputHasData : null
                }`}
              >
                رمز عبور
              </label>
              <input
                type={passwordType ? 'password' : 'text'}
                value={loginData?.password}
                name='password'
                onChange={changeHandler}
                className={errors.password && classes.inputError}
                placeholder='رمز عبور خود را وارد کنید'
              />

              <img
                onClick={() => {
                  setPasswordType(!passwordType);
                }}
                src={passwordType ? closeEye : openEye}
                alt='eye icon'
              />
              {errors.password && <span>{errors.password}</span>}
            </div>

            <div className={classes.navigationWrapper}>
              <Link
                onClick={() => {
                  setShowModal(!showModal);
                }}
              >
                <span>رمز عبور خود را فراموش کرده اید؟</span>
              </Link>
            </div>

            <button type='submit'>
              {loadingUser ? <Spinner isButton /> : 'ورود'}
            </button>
            <div className={classes.navigationWrapperBottom}>
              <Link to='/authentication'>
                <span>حساب کاربری ندارید ؟ ثبت نام</span>
              </Link>
            </div>
          </form>
        </div>
      </AuthLayout>
    </MainLayout>
  );
};
export default LoginPage;
