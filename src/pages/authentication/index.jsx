import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/UI/spinner';
import MainLayout from '../../components/layout/MainLayout';
import AuthLayout from '../../components/layout/AuthLayout';
import authValidate from '../../helpers/validation/authValidate';
import persianToNumber from '../../helpers/convertNumber/persianToNumber';
import refreshIcon from '../../assets/images/icons/captcha-refresh.svg';
import authContext from '../../context/auth/authContext';
import classes from './Authentication.module.scss';

const tenDigitNumber = Math?.floor(Math.random() * 9000000000);

const Authentication = () => {
  const navigate = useNavigate();
  const [recaptchaImage, setRecaptchaImage] = useState('');
  const { authUserNationalCode, loadingUser, getRecaptcha } =
    useContext(authContext);
  const [formData, setFormData] = useState({
    recaptchaCode: '',
    nationalCode: '',
  });

  const [errors, setErrors] = useState({});

  const getRecaptchaHandler = async () => {
    const recaptcha = await getRecaptcha(tenDigitNumber);
    setRecaptchaImage(recaptcha);
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e?.target?.name]: e?.target?.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const hasError = Object?.keys(authValidate(formData))?.length;

    if (hasError) {
      setErrors(authValidate(formData));
    } else {
      const data = {
        nationalCode: persianToNumber(formData?.nationalCode),
        cit: String(tenDigitNumber),
        ck: formData?.recaptchaCode?.toString(),
        ct: 'string',
      };

      const response = await authUserNationalCode(data);

      if (response?.status === 200) {
        navigate('/register');
      }
      if (response?.status !== 200) {
        getRecaptchaHandler(tenDigitNumber);
      }
    }
  };

  useEffect(() => {
    getRecaptchaHandler(tenDigitNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout noFooter={true} noLogo={true}>
      <AuthLayout>
        <div className={classes.formWrapper}>
          <form onSubmit={submitHandler}>
            <div className={classes.inputWrapper}>
              <label className={formData.nationalCode && classes.inputHasData}>
                کد ملی
              </label>
              <input
                type='text'
                value={formData?.nationalCode}
                name='nationalCode'
                onChange={changeHandler}
                className={errors.nationalCode && classes.inputError}
                placeholder='کد ملی را وارد کنید'
              />

              {errors?.nationalCode && <span>{errors?.nationalCode}</span>}
            </div>
            <div className={classes.captchaBox}>
              <div className={classes.captchaImageWrapper}>
                {recaptchaImage && (
                  <img
                    className={classes.captcha}
                    src={recaptchaImage}
                    alt='recaptcha'
                  />
                )}
                <img
                  src={refreshIcon}
                  alt='refresh recaptcha'
                  onClick={() => getRecaptchaHandler(tenDigitNumber)}
                  className={classes.refresh}
                />
              </div>

              <div className={classes.captchaInputWrapper}>
                <input
                  name='recaptchaCode'
                  onChange={changeHandler}
                  type='number'
                  placeholder='حاصل عبارت را وارد کنید'
                  id='recaptcha'
                  className={errors.recaptchaCode && classes.inputError}
                />
              </div>

              {errors?.recaptchaCode && <span>{errors?.recaptchaCode}</span>}
            </div>

            <button type='submit' className={classes.continueBtn}>
              {loadingUser ? <Spinner isButton /> : 'بررسی'}
            </button>
          </form>
        </div>
      </AuthLayout>
    </MainLayout>
  );
};

export default Authentication;
