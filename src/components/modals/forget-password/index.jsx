import classes from './ForgetPassword.module.scss';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import persianNumToEnglish from '../../../helpers/convertNumber/persianToNumber';
import { toast } from 'react-toastify';
import refreshIcon from '../../../assets/icons/refresh.svg';
import authContext from '../../../context/auth/authContext';

import closeEye from '../../../assets/icons/eye-close.svg';
import openEye from '../../../assets/icons/eye-open.svg';

import Spinner from '../../../components/UI/spinner';

const tenDigitNumber = Math?.floor(Math.random() * 9000000000);
const FrogetPassword = () => {
  const { sendOtp, forgetPassword, getRecaptcha, loadingSendSms } =
    useContext(authContext);
  const [stepStatus, setStepStatus] = useState(true);
  const [recaptchaImage, setRecaptchaImage] = useState('');
  const [userNationalCode, setUserNationalCode] = useState('');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');

  const navigate = useNavigate();

  const [passwordType, setPasswordType] = useState(true);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const {
    register: register2,
    watch: watch2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm();

  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})'
  );
  const regixMobileNumber = /^(0)?9\d{9}$/g;

  const getRecaptchaHandler = async () => {
    const recaptcha = await getRecaptcha(tenDigitNumber);
    setRecaptchaImage(recaptcha);
  };

  useEffect(() => {
    getRecaptchaHandler(tenDigitNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstStepHandler = async (data) => {
    setUserPhoneNumber(data?.phoneNumber);
    setUserNationalCode(data?.nationalCode);

    const response = await sendOtp({
      nationalCode: persianNumToEnglish(data?.nationalCode),
      recipient: persianNumToEnglish(data?.phoneNumber),
      smsLocation: 2,
      ct: String('string'),
      cit: String(tenDigitNumber),
      ck: String(persianNumToEnglish(data?.recaptchaCode)),
    });
    if (response?.status !== 200) {
      toast.error(response?.data?.error?.message);
      getRecaptchaHandler(tenDigitNumber);
    }
    if (response?.status === 200) {
      setStepStatus(false);
    }
  };

  const forgetPass = async (data) => {
    const response = await forgetPassword({
      nationalCode: persianNumToEnglish(userNationalCode),
      mobile: persianNumToEnglish(userPhoneNumber),
      passWord: data?.newPassword,
      smsCode: persianNumToEnglish(data?.smsCode),
    });
    if (response?.status === 200) {
      toast.success('رمز شما با موفقیت تغییر کرد');
      navigate('/login');
    }
  };
  return (
    <div className={classes.formWrapper}>
      <p>برای بازیابی رمز عبور کد ملی و شماره موبایل خود را وارد نمایید</p>

      <form
        style={{ display: stepStatus ? 'flex' : 'none' }}
        onSubmit={handleSubmit(firstStepHandler)}
      >
        <div className={classes.inputWrapper}>
          <label>کد ملی</label>
          <input
            {...register('nationalCode', {
              required: 'کد ملی اجباری میباشد!',
            })}
            type='text'
            name='nationalCode'
            className={errors.nationalCode && classes.inputError}
            placeholder='کدملی خود را وارد کنید'
          />

          {errors?.nationalCode && <span>{errors?.nationalCode?.message}</span>}
        </div>

        <div className={classes.inputWrapper}>
          <label>شماره موبایل</label>
          <input
            {...register('phoneNumber', {
              required: 'شماره موبایل اجباری میباشد!',
              pattern: regixMobileNumber,
              minLength: {
                value: 11,
                message: 'شماره موبایل نامعتبر میباشد!',
              },
              maxLength: {
                value: 11,
                message: 'شماره موبایل نامعتبر میباشد!',
              },
            })}
            type='number'
            name='phoneNumber'
            className={errors?.phoneNumber && classes.inputError}
            placeholder='شماره موبایل خود را وارد کنید'
          />

          {errors?.phoneNumber && <span>{errors?.phoneNumber?.message}</span>}
        </div>

        <div
          className={`${classes.captchaBox} ${
            errors.recaptchaCode ? classes.captchaError : null
          }`}
        >
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
              {...register('recaptchaCode', {
                required: 'لطفا کد کپچا را وارد کنید!',
                minLength: {
                  value: 2,
                  message: 'کد کپچا نامعتبر میباشد!',
                },
                maxLength: {
                  value: 2,
                  message: 'کد کپچا نامعتبر میباشد!',
                },
              })}
              className={classes.inputCaptcha}
              name='recaptchaCode'
              type='number'
              id='recaptcha'
              placeholder='حاصل عبارت را وارد کنید'
            />
          </div>

          {errors?.recaptchaCode && (
            <span>{errors?.recaptchaCode?.message}</span>
          )}
        </div>
        <button type='submit' className={classes.buttonElement}>
          {loadingSendSms ? <Spinner isButton /> : 'ادامه'}
        </button>
      </form>
      <form
        style={{ display: !stepStatus ? 'flex' : 'none' }}
        onSubmit={handleSubmit2(forgetPass)}
      >
        <div className={classes.inputWrapper}>
          <input
            {...register2('smsCode', {
              required: 'لطفا کد پیامک شده را وارد کنید!',
              minLength: {
                value: 6,
                message: 'کد وارد شده نامعتبر میباشد!',
              },
              maxLength: {
                value: 6,
                message: 'کد وارد شده نامعتبر میباشد!',
              },
            })}
            type='number'
            name='smsCode'
            className={errors2.smsCode && classes.inputError}
          />
          <label className={watch2('smsCode')?.trim() && classes.inputHasData}>
            کد پیامک شده
          </label>
          {errors2.smsCode && <span>{errors2?.smsCode?.message}</span>}
        </div>
        <div className={classes.inputWrapper}>
          <input
            type={passwordType ? 'password' : 'text'}
            name='new-password'
            {...register2('newPassword', {
              required: 'رمز جدید الزامی میباشد!',
              pattern: {
                value: strongRegex,
                message: 'رمز جدید نامعتبر میباشد!',
              },
            })}
            className={errors2.newPassword && classes.inputError}
          />
          <label
            className={watch2('newPassword')?.trim() && classes.inputHasData}
          >
            رمز جدید
          </label>
          <img
            onClick={() => {
              setPasswordType(!passwordType);
            }}
            src={passwordType ? closeEye : openEye}
            alt='eye icon'
          />
          {errors2.newPassword && <span>{errors2?.newPassword?.message}</span>}
        </div>

        <div className={classes.inputWrapper}>
          <input
            type={passwordType ? 'password' : 'text'}
            {...register2('confirmPassword', {
              required: 'تکرار رمز جدید الزامی میباشد!',

              validate: (val) => {
                if (watch2('newPassword') != val) {
                  return 'رمز جدید و تکرار رمز جدید یکسان نیست!';
                }
              },
            })}
            name='confirmPassword'
            className={errors2.confirmPassword && classes.inputError}
          />
          <label
            className={
              watch2('confirmPassword')?.trim() && classes.inputHasData
            }
          >
            تکرار رمز جدید
          </label>
          <img
            onClick={() => {
              setPasswordType(!passwordType);
            }}
            src={passwordType ? closeEye : openEye}
            alt='eye icon'
          />

          {errors2.confirmPassword && (
            <span>{errors2?.confirmPassword?.message}</span>
          )}
        </div>

        <div className={classes.passwordHint}>
          <span>نکاتی برای رمز عبور مناسب</span>
          <div>
            <p>
              از حروف کوچک، بزرگ و عدد استفاده کنید. شامل حداقل یک علامت (*-&%)
              باشد.
            </p>
          </div>
        </div>

        <button type='submit' className={classes.buttonElement}>
          ثبت
        </button>
      </form>
    </div>
  );
};

export default FrogetPassword;
