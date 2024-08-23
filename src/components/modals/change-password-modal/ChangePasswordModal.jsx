import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import persianNumToEnglish from '../../../helpers/convertNumber/persianToNumber';
import { toast } from 'react-toastify';
import classes from './ChangePasswordModal.module.scss';
import refreshIcon from '../../../assets/icons/refresh.svg';
import authContext from '../../../context/auth/authContext';
import openEye from '../../../assets/icons/eye-open.svg';
import closeEye from '../../../assets/icons/eye-close.svg';

const tenDigitNumber = Math.floor(Math.random() * 9000000000);

const ChangePass = ({ setIsModalVisible }) => {
  const {
    sendOtp,
    changePassword,
    getRecaptcha,
    getUser,
    userProfileData,
    token,
  } = useContext(authContext);

  const [isChangeForm, setIsChangeForm] = useState(false);
  const [recaptchaImage, setRecaptchaImage] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [passwordType, setPasswordType] = useState(true);

  const regixPassword = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})'
  );
  const validateRegixPassword = (newPassWord) => {
    if (!newPassWord) {
      return 'رمزعبور خود را وارد کنید.';
    } else if (!regixPassword.test(newPassWord)) {
      return 'فرمت رمزعبور صحیح نیست.';
    }
  };

  const getRecaptchaHandler = async () => {
    const recaptcha = await getRecaptcha(tenDigitNumber);
    setRecaptchaImage(recaptcha);
  };

  useEffect(() => {
    getRecaptchaHandler(tenDigitNumber);
    let tokenLogin = token
      ? token
      : localStorage.getItem('token')
      ? `Bearer ${localStorage.getItem('token')}`
      : false;

    if (tokenLogin && !userProfileData.nationalCode) {
      getUser(tokenLogin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const continueModal = async () => {
    const response = await sendOtp({
      smsLocation: 6,
      ct: String('string'),
      cit: String(tenDigitNumber),
      ck: String(watch('recaptchaCode')),
      recipient: String(userProfileData?.mobile),
      nationalCode: String(userProfileData?.nationalCode),
    });
    if (response) {
      setIsChangeForm(true);
    } else {
      getRecaptchaHandler(tenDigitNumber);
    }
  };

  const changePass = async (data) => {
    if (otpCode?.trim() === '') {
      setOtpError(true);
    } else {
      const response = await changePassword({
        newPassWord: data?.newPassword,
        smsCode: persianNumToEnglish(otpCode),
        smsLocation: 6,
      });
      if (response?.status === 200) {
        toast.success('رمز شما با موفقیت تغییر کرد');
        setIsModalVisible(false);
      }
    }
  };

  return (
    <>
      {!isChangeForm && (
        <form
          className={classes.formForgetPass}
          onSubmit={handleSubmit(continueModal)}
        >
          <>
            <div>
              <div className={classes.inputWrapper}>
                <label
                  className={
                    watch('newPassword')?.trim() && classes.inputHasData
                  }
                >
                  رمز عبور جدید
                </label>
                <input
                  type={passwordType ? 'password' : 'text'}
                  name='newPassWord'
                  {...register('newPassword', {
                    required: true,
                    pattern: regixPassword,
                  })}
                  className={errors?.newPassword ? classes.hasError : null}
                  placeholder='رمز عبور جدید را وارد کنید'
                />

                <img
                  onClick={() => {
                    setPasswordType(!passwordType);
                  }}
                  src={passwordType ? closeEye : openEye}
                  alt='eye icon'
                />
                {errors.newPassword && (
                  <span>
                    {validateRegixPassword(watch('newPassword')?.trim())}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className={classes.inputWrapper}>
                <label
                  className={
                    watch('confirmPassword')?.trim() && classes.inputHasData
                  }
                >
                  تکرار مجدد رمز عبور
                </label>
                <input
                  {...register('confirmPassword', {
                    required: true,
                    validate: (val) => {
                      if (watch('newPassword') != val) {
                        return '!رمز عبور و تکرار رمز عبور یکسان نیست';
                      }
                    },
                  })}
                  type={passwordType ? 'password' : 'text'}
                  name='confirmPassword'
                  className={errors?.newPassword ? classes.hasError : null}
                  placeholder='تکرار مجدد رمز عبور جدید'
                />

                <img
                  onClick={() => {
                    setPasswordType(!passwordType);
                  }}
                  src={passwordType ? closeEye : openEye}
                  alt='eye icon'
                />
                {errors?.confirmPassword && (
                  <span>{errors?.confirmPassword?.message}</span>
                )}
              </div>
            </div>

            <div className={classes.passwordHint}>
              <span>نکاتی برای رمز عبور مناسب</span>
              <div>
                <p>
                  از حروف کوچک، بزرگ و عدد استفاده کنید. شامل حداقل یک علامت
                  (*-&%) باشد.
                </p>
              </div>
            </div>

            {/* <div className={classes.captchaWrapper}>
              {recaptchaImage && (
                <img
                  className={classes.captchaImage}
                  src={recaptchaImage}
                  alt="captcha"
                />
              )}
              <img
                src={refreshIcon}
                alt="refresh recaptcha"
                className={classes.refreshIcon}
                onClick={() => getRecaptchaHandler(tenDigitNumber)}
              />
              <input
                type="number"
                placeholder="حاصل عبارت را وارد کنید"
                {...register("recaptchaCode", {
                  required: "لطفا کد کپچا را وارد کنید!",
                  minLength: {
                    value: 2,
                    message: "کد کپچا نامعتبر میباشد!",
                  },
                  maxLength: {
                    value: 2,
                    message: "کد کپچا نامعتبر میباشد!",
                  },
                })}
                name="recaptchaCode"
                className={errors.recaptchaCode ? classes.hasError : null}
              />
              {errors?.recaptchaCode && (
                <p className={classes.captchaError}>
                  {errors?.recaptchaCode?.message}
                </p>
              )}
            </div> */}
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
            {watch('confirmPassword')?.trim() ===
            watch('newPassword')?.trim() ? (
              <button className={classes.buttonElement}>ادامه</button>
            ) : (
              <span className={classes.spanElement}>ادامه</span>
            )}
          </>
        </form>
      )}

      {isChangeForm && (
        <form
          onSubmit={handleSubmit(changePass)}
          className={classes.formForgetPass}
        >
          <div className={classes.mobileConfirmWrapper}>
            <h3>تایید شماره موبایل</h3>
            <div>کد ارسال شده به شماره موبایل را وارد کنید</div>
            <div className={classes.inputWrapper}>
              <input
                type='number'
                onChange={(e) => setOtpCode(e.target.value)}
                name='otp-code'
                className={classes.mobileCodeInput}
                placeholder='کد دریافتی را وارد کنید'
              />
              {otpError && (
                <p className={classes.otpErrorValidation}>
                  ورود کد پیامکی اجباری میباشد!
                </p>
              )}
            </div>
          </div>
          <div>
            <button className={classes.buttonElement}>ثبت</button>
          </div>
        </form>
      )}
    </>
  );
};

export default ChangePass;
