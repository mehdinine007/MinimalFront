import { useContext, useState } from 'react';
import classes from './Register.module.scss';
import OtpCounter from '../../otp-counter';
import authContext from '../../../context/auth/authContext';
import { useForm } from 'react-hook-form';
import Modal from '../modal';
import Spinner from '../../UI/spinner';

const RegisterModal = ({ setShowModal, formData }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { registerUser } = useContext(authContext);

  const onSubmitFormOTP = async (data) => {
    setLoading(true);
    await registerUser({
      ...formData,
      smsCode: data?.smsCode,
      userName: formData?.nationalCode,
    });

    setLoading(false);
  };

  return (
    <Modal
      title='تایید شماره موبایل'
      setIsModalVisible={setShowModal}
      widthInnerModal='700px'
    >
      <div className={classes.modalDetailWrapper}>
        <div>
          <p>رمز یکبار مصرف به شماره همراه شما ارسال شد</p>
          <p>جهت تکمیل ثبت نام رمز یک بار مصرف دریافت شده را وارد کنید</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmitFormOTP)}
          className={classes.modalForm}
        >
          <div className={classes.inputWrapper}>
            <input
              {...register('smsCode', {
                required: 'رمز یکبارمصرف اجباری میباشد!',
                maxLength: {
                  value: 6,
                  message: 'کد وارد شده میبایست 6 رقم باشد!',
                },
                minLength: {
                  value: 6,
                  message: 'کد وارد شده میبایست 6 رقم باشد!',
                },
              })}
              className={classes.otpCodeActive}
              name='smsCode'
              type='number'
              autoComplete='off'
              placeholder='کد ارسالی را وارد کنید'
            />
            {errors.smsCode && (
              <span className={classes.inputError}>
                {errors?.smsCode?.message}
              </span>
            )}
          </div>
          <OtpCounter initialSeconds='60' />
          {loading ? (
            <button type='button' className={classes.modalBtn}>
              <Spinner isButton />
            </button>
          ) : (
            <button type='submit' className={classes.modalBtn}>
              تایید
            </button>
          )}
        </form>
      </div>
    </Modal>

    // <div
    //   className={`modal-container ${visibility ? "flex" : "hidden"} ${
    //     classes.modalWrapper
    //   }`}
    // >
    //   <div className={`modal-area ${classes.modalView} modal-home-pag`}>
    //     <div className={`${classes.modalHeader} modal-title-area`}>
    //       <h1>تایید شماره موبایل </h1>
    //       <img onClick={() => hide()} src={closeIcon} alt="close icon" />
    //     </div>
    //     <div className="modal-box-area">
    //       <div>
    //         <p>
    //           رمز یکبار مصرف به شماره همراه شما ارسال شد
    //           <br /> جهت تکمیل ثبت نام رمز یک بار مصرف دریافت شده را وارد کنید
    //         </p>
    //         <form
    //           onSubmit={handleSubmit(onSubmitFormOTP)}
    //           className={classes.modalForm}
    //         >

    //           <OtpCounter initialSeconds="60" />

    //           <button type="submit" className={classes.modalBtn}>
    //             تایید
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
export default RegisterModal;
