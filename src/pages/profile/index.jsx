import { useContext, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Select, { components } from 'react-select';
import { DatePicker } from 'react-advance-jalaali-datepicker';
import { toast } from 'react-toastify';
import moment from 'jalali-moment';

import classes from './Profile.module.scss';

import MainLayout from '../../components/layout/MainLayout';

import authContext from '../../context/auth/authContext';
import refreshIcon from '../../assets/images/refresh.svg';
import Loader from '../../components/UI/loader';
import Modal from '../../components/modals/modal';

import profileIcon1 from '../../assets/icons/profile-icon1.svg';
import profileIcon2 from '../../assets/icons/profile-icon2.svg';
import profileIcon3 from '../../assets/icons/profile-icon3.svg';
import profileIcon4 from '../../assets/icons/profile-icon4.svg';

const genderOptions = [
  { value: 1, label: 'آقا' },
  { value: 2, label: 'خانم' },
];

const DatePickerInput = (props) => {
  return <input className='popo' {...props} />;
};

const regixPostalCode = /^[0-9]{10}$/g;

const regixMobileNumber = /^(0)?9\d{9}$/g;

const regixTelNumber = /^0[0-9]{6,10}$/g;

const today = moment(new Date()).format('jYYYY/jMM/jDD');

const formatDateToEnglishStyle = (date) =>
  date.substr(0, 2) !== '13' && date.substr(0, 2) !== '14'
    ? moment(date, 'YYYY/MM/DD').format('YYYY-MM-DD')
    : moment(date, 'jYYYY/jMM/jD').format('YYYY-MM-DD');

const tenDigitNumber = Math?.floor(Math.random() * 9000000000);

const Profile = () => {
  const [activeStep, setActiveStep] = useState(1);
  const {
    getProvinces,
    getCities,
    loadingUser,
    provinces,
    getRecaptcha,
    sendOtp,
    editUser,
    nationalCode,
    getUser,
    userProfileData,
    token,
  } = useContext(authContext);

  const [recaptcha, setRecaptcha] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [registerData, setRegisterData] = useState({});

  const [smsCodeError, setSmsCodeError] = useState(false);

  const smsCodeRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useForm();

  const getRecaptchaHandler = async (tenDigitNumber) => {
    const response = await getRecaptcha(tenDigitNumber);
    setRecaptcha(response);
  };

  const onSubmit = async (data) => {
    if (
      formatDateToEnglishStyle(getValues('issuingDate')) <
      formatDateToEnglishStyle(getValues('birthDate'))
    ) {
      toast.error('تاریخ صدور شناسنامه نمی تواند از تاریخ تولد کمتر باشد.');
    } else {
      if (userProfileData?.mobile === data?.mobile) {
        const finalData = {
          ...data,
          userName: userProfileData?.nationalCode,
          nationalCode: userProfileData?.nationalCode,
        };

        const { success } = await editUser(finalData);
        if (success) {
          toast.success('تغییرات با موفقیت اعمال شد!');
          getRecaptchaHandler(tenDigitNumber);
          getUser();
        }
      } else {
        const response = await sendOtp({
          nationalCode: userProfileData?.nationalCode
            ? userProfileData?.nationalCode
            : nationalCode,
          recipient: data?.mobile,
          smsLocation: 3,
          cit: tenDigitNumber?.toString(),
          ck: data?.recaptchaCode?.toString(),
          ct: 'string',
        });

        if (response?.status === 200) {
          setRegisterData({
            ...data,
            userName: userProfileData?.nationalCode
              ? userProfileData?.nationalCode
              : nationalCode,
            nationalCode: userProfileData?.nationalCode
              ? userProfileData?.nationalCode
              : nationalCode,
          });
          setIsModalVisible(true);
        } else {
          getRecaptchaHandler(tenDigitNumber);
        }
      }
    }
  };

  useEffect(() => {
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

  // provinces and cities
  const birthCitiesSelectRef = useRef();
  const issuingCitiesSelectRef = useRef();
  const habitationCitiesSelectRef = useRef();

  const [birthCitiesOptions, setBirthCitiesOptions] = useState([]);
  const [issuingCitiesOptions, setIssuingCitiesOptions] = useState([]);
  const [habitationCitiesOptions, setHabitationCitiesOptions] = useState([]);

  // show profile provinces when user goes in profile page
  const issuingProvince = provinces?.find(
    (province) => province?.id === userProfileData?.issuingProvinceId
  );

  const birthProvince = provinces?.find(
    (province) => province?.id === userProfileData?.birthProvinceId
  );
  const habitationProvince = provinces?.find(
    (province) => province?.id === userProfileData?.habitationProvinceId
  );

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className='custom-css-class'>موردی وجود ندارد</span>
      </components.NoOptionsMessage>
    );
  };

  // birth date and issuing date default
  const birthDateDefault =
    userProfileData?.birthDate &&
    userProfileData?.birthDate?.substr(0, 2) !== '13' &&
    userProfileData?.birthDate?.substr(0, 2) !== '14'
      ? moment(userProfileData?.birthDate).format('jYYYY/jMM/jDD')
      : userProfileData?.birthDate?.substr(0, 10).replaceAll('-', '/');

  const issuingDateDefault =
    userProfileData?.issuingDate &&
    userProfileData?.issuingDate?.substr(0, 2) !== '13' &&
    userProfileData?.issuingDate?.substr(0, 2) !== '14'
      ? moment(userProfileData?.issuingDate)?.format('jYYYY/jMM/jDD')
      : userProfileData?.issuingDate?.substr(0, 10)?.replaceAll('-', '/');

  // modal submit for register

  const submitRegister = async (e) => {
    e.preventDefault();

    if (smsCodeRef?.current?.value === '') {
      setSmsCodeError(true);
    } else {
      const finalData = {
        ...registerData,
        smsCode: smsCodeRef?.current?.value,
        userName: registerData?.nationalCode,
      };

      // we will edit if we have user profile data
      if (userProfileData) {
        const { success } = await editUser(finalData);
        if (success) {
          toast.success('تغییرات با موفقیت اعمال شد.');
        }
        getRecaptchaHandler(tenDigitNumber);
        setIsModalVisible(false);
        getUser();
      }
    }
  };

  useEffect(() => {
    getRecaptchaHandler(tenDigitNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const provincesOptions = provinces?.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  const issuingCityDefault = issuingCitiesOptions?.find(
    (city) => city.value === userProfileData?.issuingCityId
  );

  const birthCityDefault = birthCitiesOptions?.find(
    (city) => city.value === userProfileData?.birthCityId
  );

  const habitationCityDefault = habitationCitiesOptions?.find(
    (city) => city.value === userProfileData?.habitationCityId
  );

  const getAllCities = async () => {
    if (userProfileData?.issuingProvinceId) {
      const issuingCities = await getCities(userProfileData?.issuingProvinceId);
      setIssuingCitiesOptions(
        issuingCities?.map((city) => ({ value: city?.id, label: city?.name }))
      );
    }
    if (userProfileData?.birthProvinceId) {
      const birthCities = await getCities(userProfileData?.birthProvinceId);
      setBirthCitiesOptions(
        birthCities?.map((city) => ({ value: city?.id, label: city?.name }))
      );
    }
    if (userProfileData?.habitationProvinceId) {
      const habitationCities = await getCities(
        userProfileData?.habitationProvinceId
      );
      setHabitationCitiesOptions(
        habitationCities?.map((city) => ({
          value: city?.id,
          label: city?.name,
        }))
      );
    }
  };

  useEffect(() => {
    getAllCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfileData?.birthProvinceId,
    userProfileData?.issuingProvinceId,
    userProfileData?.habitationProvinceId,
  ]);

  useEffect(() => {
    if (userProfileData) {
      setValue('name', userProfileData?.name);
      setValue('surname', userProfileData?.surname);
      setValue('fatherName', userProfileData?.fatherName);
      setValue('gender', userProfileData?.gender);
      setValue('mobile', userProfileData?.mobile);
      setValue('tel', userProfileData?.tel);
      setValue('postalCode', userProfileData?.postalCode);
      setValue('birthCertId', userProfileData?.birthCertId);
      setValue('issuingProvinceId', userProfileData?.issuingProvinceId);
      setValue('issuingCityId', userProfileData?.issuingCityId);
      setValue('birthProvinceId', userProfileData?.birthProvinceId);
      setValue('birthCityId', userProfileData?.birthCityId);
      setValue('habitationProvinceId', userProfileData?.habitationProvinceId);
      setValue('habitationCityId', userProfileData?.habitationCityId);
      setValue('birthDate', userProfileData?.birthDate);
      setValue('issuingDate', userProfileData?.issuingDate);
      setValue('address', userProfileData?.address);
      setValue('regionId', userProfileData?.regionId);
      setValue('street', userProfileData?.street);
      setValue('pelaq', userProfileData?.pelaq);
      setValue('alley', userProfileData?.alley);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData?.nationalCode]);

  return (
    <>
      {loadingUser ? (
        <Loader />
      ) : (
        <MainLayout>
          <div className={classes.profilePageWrapper}>
            <h1 className={classes.title}>پروفایل</h1>
            <div className={classes.bgImage}></div>
            <div className={classes.bgc}></div>
            {isModalVisible && (
              <Modal
                title='تایید شماره موبایل '
                setIsModalVisible={setIsModalVisible}
              >
                <div
                  onSubmit={handleSubmit(submitRegister)}
                  className={classes.modalWrapper}
                >
                  <p>رمز یکبار مصرف به شماره همراه شما ارسال شد</p>
                  <p>
                    جهت تکمیل ثبت نام رمز یک بار مصرف دریافت شده را وارد کنید{' '}
                  </p>
                  <div className={classes.modalInputWrapper}>
                    <input
                      type='number'
                      name='smsCode'
                      ref={smsCodeRef}
                      // placeholder="لطفا کد ارسالی به شماره خود را وارد کنید"
                      style={smsCodeError ? { border: '1px solid red' } : null}
                      maxLength='6'
                      minLength='6'
                    />
                    {smsCodeError && <span>کد پیامک شده الزامی میباشد</span>}
                  </div>
                  <button onClick={(e) => submitRegister(e)}>تایید</button>
                </div>
              </Modal>
            )}
            <div className={`${classes.cardWrapper} container`}>
              <div className={classes.steps}>
                <div
                  className={`${classes.stepItem} ${
                    activeStep === 1 ? classes.stepItemActive : ''
                  }`}
                  onClick={() => setActiveStep(1)}
                >
                  <div className={classes.circle}>
                    <img src={profileIcon1} alt='' />
                  </div>
                  <span>اطلاعات فردی</span>
                </div>
                <div
                  className={`${classes.stepItem} ${
                    activeStep === 2 ? classes.stepItemActive : ''
                  }`}
                  onClick={() => setActiveStep(2)}
                >
                  <div className={classes.circle}>
                    <img src={profileIcon2} alt='' />
                  </div>
                  <span>اطلاعات شناسایی</span>
                </div>
                <div
                  className={`${classes.stepItem} ${
                    activeStep === 3 ? classes.stepItemActive : ''
                  }`}
                  onClick={() => setActiveStep(3)}
                >
                  <div className={classes.circle}>
                    <img src={profileIcon3} alt='' />
                  </div>
                  <span>اطلاعات تماس</span>
                </div>
                <div
                  className={`${classes.stepItem} ${
                    activeStep === 4 ? classes.stepItemActive : ''
                  }`}
                  onClick={() => setActiveStep(4)}
                >
                  <div className={classes.circle}>
                    <img src={profileIcon4} alt='' />
                  </div>
                  <span>اطلاعات محل سکونت</span>
                </div>
              </div>

              <div className={classes.formWrapper}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div
                    style={
                      activeStep === 1
                        ? { display: 'flex' }
                        : { display: 'none' }
                    }
                    className={classes.activeStepWrapper}
                  >
                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('name', {
                            required: 'نام اجباری میباشد!',
                            maxLength: 100,
                            minLength: 2,
                          })}
                          name='name'
                          className={errors.name ? classes.inputError : null}
                          defaultValue={userProfileData?.name}
                        />
                        <label
                          className={
                            watch('name')?.trim() && classes.inputHasData
                          }
                        >
                          نام
                        </label>

                        {errors?.name && <span>{errors?.name?.message}</span>}
                      </div>

                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('surname', {
                            required: 'نام خانوادگی اجباری میباشد!',
                            maxLength: 100,
                            minLength: 2,
                          })}
                          name='surname'
                          className={errors.surname ? classes.inputError : null}
                          defaultValue={
                            userProfileData?.surname
                              ? userProfileData?.surname
                              : ''
                          }
                        />
                        <label
                          className={
                            watch('surname')?.trim() && classes.inputHasData
                          }
                        >
                          نام خانوادگی
                        </label>

                        {errors?.surname && (
                          <span>{errors?.surname?.message}</span>
                        )}
                      </div>

                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('fatherName', {
                            required: 'نام پدر اجباری میباشد!',
                            maxLength: 100,
                            minLength: 2,
                          })}
                          name='fatherName'
                          className={
                            errors.fatherName ? classes.inputError : null
                          }
                          defaultValue={
                            userProfileData?.fatherName
                              ? userProfileData?.fatherName
                              : ''
                          }
                        />
                        <label
                          className={
                            watch('fatherName')?.trim() && classes.inputHasData
                          }
                        >
                          نام پدر
                        </label>
                        {errors.fatherName && (
                          <span>{errors?.fatherName?.message}</span>
                        )}
                      </div>
                    </div>

                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <Select
                          className='select-input'
                          {...register('gender', {
                            required: 'جنسیت اجباری میباشد!',
                          })}
                          isSearchable={false}
                          name='gender'
                          defaultValue={
                            userProfileData?.gender
                              ? genderOptions[userProfileData?.gender - 1]
                              : genderOptions[0]
                          }
                          options={genderOptions}
                          onChange={(option) => {
                            setValue('gender', option ? option?.value : option);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: errors?.gender ? '1px solid red' : 'none',
                            }),
                          }}
                        />
                        <label
                          className={watch('gender') && classes.inputHasData}
                        >
                          جنسیت
                        </label>
                      </div>

                      <div className={classes.inputWrapper}>
                        <DatePicker
                          {...register('birthDate', {
                            required: 'تاریخ تولد اجباری میباشد!',
                          })}
                          inputComponent={DatePickerInput}
                          format='jYYYY/jMM/jDD'
                          onChange={(unix, formatted) => {
                            setValue('birthDate', formatted);
                            if (formatted > today) {
                              setError('birthDatebiggerThanToday', {
                                type: 'custom',
                                message: 'تاریخ تولد نامعتبر است!',
                              });
                            } else {
                              clearErrors('birthDatebiggerThanToday');
                            }
                          }}
                          id={errors.birthDate ? 'redBorderDatePicker' : null}
                          preSelected={
                            userProfileData?.birthDate ? birthDateDefault : ''
                          }
                        />
                        <label
                          className={
                            watch('birthDate')?.trim() && classes.inputHasData
                          }
                        >
                          تاریخ تولد
                        </label>

                        {errors.birthDatebiggerThanToday && (
                          <span>تاریخ تولد نامعتبر</span>
                        )}
                        {errors?.birthDate && (
                          <span>{errors?.birthDate?.message}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={
                      activeStep === 2
                        ? { display: 'flex' }
                        : { display: 'none' }
                    }
                    className={classes.activeStepWrapper}
                  >
                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          disabled
                          name='nationalCode'
                          className='disabled'
                          defaultValue={
                            nationalCode
                              ? nationalCode
                              : userProfileData?.nationalCode
                              ? userProfileData?.nationalCode
                              : ''
                          }
                        />
                        <label
                          className={
                            userProfileData?.nationalCode &&
                            classes.inputHasData
                          }
                        >
                          کد ملی
                        </label>
                      </div>
                      <div className={classes.inputWrapper}>
                        <input
                          type='number'
                          {...register('birthCertId', {
                            required: 'شماره شناسنامه اجباری میباشد!',
                            maxLength: 10,
                            minLength: 1,
                          })}
                          name='birthCertId'
                          className={
                            errors.birthCertId ? classes.inputError : null
                          }
                          defaultValue={
                            userProfileData?.birthCertId
                              ? userProfileData?.birthCertId
                              : ''
                          }
                        />
                        <label
                          className={
                            watch('birthCertId')?.trim() && classes.inputHasData
                          }
                        >
                          شماره شناسنامه
                        </label>
                        {errors?.birthCertId && (
                          <span>{errors?.birthCertId?.message}</span>
                        )}
                        {errors?.birthCertId?.type === 'maxLength' && (
                          <span>شماره شناسنامه نامعتبر میباشد!</span>
                        )}
                      </div>
                      <div className={classes.inputWrapper}>
                        <Select
                          className='select-input'
                          options={provincesOptions}
                          name='birthProvinceId'
                          {...register('birthProvinceId', {
                            required: 'استان محل تولد اجباری میباشد!',
                          })}
                          placeholder={
                            <div className='placeholder-text'>
                              {birthProvince?.name
                                ? birthProvince?.name
                                : 'انتخاب کنید'}
                            </div>
                          }
                          defaultValue={
                            birthProvince
                              ? {
                                  value: birthProvince?.id,
                                  label: birthProvince?.name,
                                }
                              : null
                          }
                          onChange={async (option) => {
                            setValue(
                              'birthProvinceId',
                              option ? option?.value : option
                            );
                            const cities = await getCities(option?.value);
                            const selectCities = cities?.map((city) => ({
                              value: city.id,
                              label: city.name,
                            }));
                            delete errors?.birthProvinceId;
                            birthCitiesSelectRef.current?.clearValue();
                            setBirthCitiesOptions(selectCities);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: errors?.birthProvinceId
                                ? '1px solid red'
                                : 'none',
                            }),
                          }}
                        />
                        <label
                          className={
                            watch('birthProvinceId') && classes.inputHasData
                          }
                        >
                          استان محل تولد
                        </label>

                        {errors?.birthProvinceId && (
                          <span>{errors?.birthProvinceId?.message}</span>
                        )}
                      </div>
                    </div>

                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <Select
                          {...register('birthCityId', {
                            required: 'شهر محل تولد اجباری میباشد!',
                          })}
                          components={{ NoOptionsMessage }}
                          className='select-input'
                          options={birthCitiesOptions}
                          name='birthCityId'
                          ref={birthCitiesSelectRef}
                          placeholder={
                            <div className='placeholder-text'>
                              {birthCityDefault?.label
                                ? birthCityDefault?.label
                                : 'انتخاب کنید'}
                            </div>
                          }
                          defaultValue={birthCityDefault?.label}
                          onChange={(option) => {
                            setValue(
                              'birthCityId',
                              option ? option?.value : null
                            );
                            delete errors?.birthCityId;
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: errors?.birthCityId
                                ? '1px solid red'
                                : 'none',
                            }),
                          }}
                        />
                        <label
                          className={
                            watch('birthCityId') && classes.inputHasData
                          }
                        >
                          شهر محل تولد
                        </label>
                        {errors?.birthCityId && (
                          <span>{errors?.birthCityId?.message}</span>
                        )}
                      </div>

                      <div className={classes.inputWrapper}>
                        <DatePicker
                          {...register('issuingDate', {
                            required: 'تاریخ صدور شناسنامه اجباری میباشد!',
                          })}
                          inputComponent={DatePickerInput}
                          format='jYYYY/jMM/jDD'
                          onChange={(unix, formatted) => {
                            setValue('issuingDate', formatted);
                            if (formatted > today) {
                              setError('issuingDatebiggerThanToday', {
                                type: 'custom',
                                message: 'تاریخ صدور شناسنامه نامعتبر',
                              });
                            } else {
                              clearErrors('issuingDatebiggerThanToday');
                            }
                          }}
                          id={errors.issuingDate ? 'redBorderDatePicker' : null}
                          preSelected={
                            userProfileData?.issuingDate
                              ? issuingDateDefault
                              : ''
                          }
                          placeholder={
                            issuingDateDefault
                              ? issuingDateDefault
                              : 'انتخاب کنید'
                          }
                        />
                        <label
                          className={
                            watch('issuingDate')?.trim() && classes.inputHasData
                          }
                        >
                          تاریخ صدور شناسنامه
                        </label>
                        {errors.issuingDate && (
                          <span>{errors?.issuingDate?.message}</span>
                        )}
                        {errors.issuingDatebiggerThanToday && (
                          <span>تاریخ صدور شناسنامه نامعتبر</span>
                        )}
                      </div>

                      <div className={classes.inputWrapper}>
                        <Select
                          className='select-input'
                          options={provincesOptions}
                          name='issuingProvinceId'
                          {...register('issuingProvinceId', {
                            required: 'استان  صدور شناسنامه اجباری میباشد!',
                          })}
                          placeholder={
                            issuingProvince?.name
                              ? issuingProvince?.name
                              : 'انتخاب کنید'
                          }
                          defaultValue={
                            issuingProvince
                              ? {
                                  value: issuingProvince?.id,
                                  label: issuingProvince?.name,
                                }
                              : null
                          }
                          onChange={async (option) => {
                            setValue(
                              'issuingProvinceId',
                              option ? option?.value : option
                            );
                            const cities = await getCities(option?.value);
                            const selectCities = cities?.map((city) => ({
                              value: city.id,
                              label: city.name,
                            }));
                            delete errors?.issuingProvinceId;
                            issuingCitiesSelectRef?.current?.clearValue();
                            setIssuingCitiesOptions(selectCities);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: errors?.issuingProvinceId
                                ? '1px solid red'
                                : 'none',
                            }),
                          }}
                        />
                        <label
                          className={
                            watch('issuingProvinceId') && classes.inputHasData
                          }
                        >
                          استان محل صدور شناسنامه
                        </label>
                        {errors.issuingProvinceId && (
                          <span>{errors.issuingProvinceId.message}</span>
                        )}
                      </div>
                    </div>

                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <Select
                          {...register('issuingCityId', {
                            required: 'شهر صدور شناسنامه اجباری میباشد!',
                          })}
                          className='select-input'
                          placeholder={
                            <div className='placeholder-text'>
                              {issuingCityDefault?.label
                                ? issuingCityDefault?.label
                                : 'انتخاب کنید'}
                            </div>
                          }
                          defaultValue={issuingCityDefault}
                          components={{ NoOptionsMessage }}
                          options={issuingCitiesOptions}
                          name='issuingCityId'
                          ref={issuingCitiesSelectRef}
                          onChange={(option) => {
                            setValue(
                              'issuingCityId',
                              option ? option?.value : null
                            );
                            delete errors?.issuingCityId;
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: errors?.issuingCityId
                                ? '1px solid red'
                                : 'none',
                            }),
                          }}
                        />
                        <label
                          className={
                            watch('issuingCityId') && classes.inputHasData
                          }
                        >
                          شهر محل صدور شناسنامه
                        </label>

                        {errors.issuingCityId && (
                          <span>{errors.issuingCityId.message}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={
                      activeStep === 3
                        ? { display: 'flex' }
                        : { display: 'none' }
                    }
                    className={classes.activeStepWrapper}
                  >
                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <input
                          type='number'
                          {...register('mobile', {
                            required: 'شماره موبایل اجباری میباشد!',
                            pattern: regixMobileNumber,
                            minLength: 11,
                            maxLength: 11,
                          })}
                          name='mobile'
                          className={errors.mobile ? classes.inputError : null}
                          defaultValue={
                            userProfileData?.mobile
                              ? userProfileData?.mobile
                              : ''
                          }
                        />
                        <label
                          className={
                            watch('mobile')?.trim() && classes.inputHasData
                          }
                        >
                          شماره موبایل
                        </label>
                        {errors.mobile && <span>{errors.mobile.message}</span>}
                        {errors?.mobile?.type === 'pattern' && (
                          <span>شماره موبایل نامعتبر میباشد!</span>
                        )}
                        {errors?.mobile?.type === 'minLength' && (
                          <span>شماره موبایل نامعتبر میباشد!</span>
                        )}
                        {errors?.mobile?.type === 'maxLength' && (
                          <span>شماره موبایل نامعتبر میباشد!</span>
                        )}
                      </div>

                      <div className={classes.inputWrapper}>
                        <input
                          type='number'
                          {...register('tel', {
                            required: 'شماره تلفن ثابت اجباری میباشد!',
                            pattern: regixTelNumber,
                          })}
                          name='tel'
                          className={errors.tel ? classes.inputError : null}
                          defaultValue={
                            userProfileData?.tel ? userProfileData?.tel : ''
                          }
                        />
                        <label
                          className={
                            watch('tel')?.trim() && classes.inputHasData
                          }
                        >
                          تلفن ثابت
                        </label>
                        {errors?.tel && <span>{errors?.tel?.message}</span>}
                        {errors?.tel?.type === 'pattern' && (
                          <span>شماره تلفن ثابت نامعتبر میباشد!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={
                      activeStep === 4
                        ? { display: 'flex' }
                        : { display: 'none' }
                    }
                    className={classes.activeStepWrapper}
                  >
                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <Select
                          className='select-input'
                          options={provincesOptions}
                          name='habitationProvinceId'
                          {...register('habitationProvinceId', {
                            required: 'استان  محل سکونت اجباری میباشد!',
                          })}
                          placeholder={
                            habitationProvince?.name
                              ? habitationProvince?.name
                              : 'انتخاب کنید'
                          }
                          defaultValue={
                            habitationProvince
                              ? {
                                  value: habitationProvince?.id,
                                  label: habitationProvince?.name,
                                }
                              : null
                          }
                          onChange={async (option) => {
                            setValue(
                              'habitationProvinceId',
                              option ? option?.value : option
                            );
                            const cities = await getCities(option?.value);
                            const selectCities = cities?.map((city) => ({
                              value: city.id,
                              label: city.name,
                            }));
                            delete errors?.habitationProvinceId;
                            habitationCitiesSelectRef?.current?.clearValue();
                            setHabitationCitiesOptions(selectCities);
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: errors?.habitationProvinceId
                                ? '1px solid red'
                                : 'none',
                            }),
                          }}
                        />
                        <label
                          className={
                            watch('habitationProvinceId') &&
                            classes.inputHasData
                          }
                        >
                          استان محل سکونت
                        </label>
                        {errors.habitationProvinceId && (
                          <span>{errors.habitationProvinceId.message}</span>
                        )}
                      </div>

                      <div className={classes.inputWrapper}>
                        <Select
                          {...register('habitationCityId', {
                            required: 'شهر محل سکونت اجباری میباشد!',
                          })}
                          className='select-input'
                          placeholder={
                            <div className='placeholder-text'>
                              {habitationCityDefault?.label
                                ? habitationCityDefault?.label
                                : 'انتخاب کنید'}
                            </div>
                          }
                          defaultValue={habitationCityDefault}
                          components={{ NoOptionsMessage }}
                          options={habitationCitiesOptions}
                          name='habitationCityId'
                          ref={habitationCitiesSelectRef}
                          onChange={(option) => {
                            setValue(
                              'habitationCityId',
                              option ? option?.value : null
                            );
                            delete errors?.habitationCityId;
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: errors?.habitationCityId
                                ? '1px solid red'
                                : 'none',
                            }),
                          }}
                        />
                        <label
                          className={
                            watch('habitationCityId') && classes.inputHasData
                          }
                        >
                          شهر محل سکونت
                        </label>
                        {errors.habitationCityId && (
                          <span>{errors.habitationCityId.message}</span>
                        )}
                      </div>

                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('postalCode', {
                            required: 'کدپستی اجباری میباشد!',
                            pattern: regixPostalCode,
                          })}
                          name='postalCode'
                          className={
                            errors.postalCode ? classes.inputError : null
                          }
                          defaultValue={
                            userProfileData?.postalCode
                              ? userProfileData?.postalCode
                              : ''
                          }
                        />
                        <label
                          className={
                            watch('postalCode')?.trim() && classes.inputHasData
                          }
                        >
                          کد پستی
                        </label>

                        {errors.postalCode && (
                          <span>{errors.postalCode.message}</span>
                        )}
                        {errors?.postalCode?.type === 'pattern' && (
                          <span>کدپستی نامعتبر میباشد!</span>
                        )}
                      </div>
                    </div>
                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('street', {
                            required: 'خیابان اجباری میباشد!',
                          })}
                          name='street'
                          className={
                            errors?.street ? classes?.inputError : null
                          }
                          defaultValue={
                            userProfileData?.street
                              ? userProfileData?.street
                              : ''
                          }
                        />
                        <label
                          className={
                            watch('street')?.trim() && classes.inputHasData
                          }
                        >
                          خیابان
                        </label>
                        {errors.street && <span>{errors.street.message}</span>}
                      </div>

                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('alley', {
                            required: 'کوچه اجباری مبیباشد!',
                          })}
                          name='alley'
                          className={errors?.alley ? classes?.inputError : null}
                          defaultValue={
                            userProfileData?.alley ? userProfileData?.alley : ''
                          }
                        />
                        <label
                          className={
                            watch('alley')?.trim() && classes.inputHasData
                          }
                        >
                          کوچه
                        </label>

                        {errors.alley && <span>{errors.alley.message}</span>}
                      </div>
                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('pelaq', {
                            required: 'پلاک اجباری مبیباشد!',
                          })}
                          name='pelaq'
                          className={errors?.pelaq ? classes?.inputError : null}
                          defaultValue={
                            userProfileData?.pelaq ? userProfileData?.pelaq : ''
                          }
                        />
                        <label
                          className={
                            watch('pelaq')?.trim() && classes.inputHasData
                          }
                        >
                          پلاک
                        </label>

                        {errors.pelaq && <span>{errors.pelaq.message}</span>}
                      </div>
                    </div>
                    <div className={classes.rowWrapper}>
                      <div className={classes.inputWrapper}>
                        <input
                          type='number'
                          {...register('regionId', {
                            required: 'کد منطقه اجباری مبیباشد!',
                          })}
                          name='regionId'
                          className={
                            errors.regionId ? classes.inputError : null
                          }
                          defaultValue={
                            userProfileData?.regionId
                              ? userProfileData?.regionId
                              : ''
                          }
                        />
                        <label
                          className={watch('regionId') && classes.inputHasData}
                        >
                          کد منطقه
                        </label>
                        {errors.regionId && (
                          <span>{errors.regionId.message}</span>
                        )}
                      </div>
                    </div>

                    <div className={classes.rowWrapperFull}>
                      <div className={classes.inputWrapper}>
                        <input
                          type='text'
                          {...register('address', {
                            required: 'آدرس اجباری میباشد!',
                          })}
                          name='address'
                          className={errors.address ? classes.inputError : null}
                          defaultValue={
                            userProfileData?.address
                              ? userProfileData?.address
                              : ''
                          }
                        ></input>
                        <label
                          className={watch('address') && classes.inputHasData}
                        >
                          آدرس
                        </label>
                        {errors.address && (
                          <span>{errors.address.message}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={classes.btnWrapper}>
                    {userProfileData &&
                    watch('mobile') === userProfileData?.mobile ? (
                      <div
                        className={`${classes.recaptchaBox} ${
                          classes.recaptchaOpacity
                        } ${userProfileData ? classes.recaptchaBoxEdit : ''}`}
                      ></div>
                    ) : (
                      <div
                        className={`${classes.captchaBox} ${
                          errors?.recaptchaCode && classes.captchaError
                        }`}
                      >
                        {recaptcha && (
                          <div className={classes.captchaImageWrapper}>
                            <img
                              className={classes.captchaImage}
                              src={recaptcha}
                              alt='captcha'
                            />
                          </div>
                        )}

                        <div className={classes.refreshImageWrapper}>
                          <img
                            className={classes.refreshIcon}
                            src={refreshIcon}
                            alt='refresh'
                            onClick={() => getRecaptchaHandler(tenDigitNumber)}
                          />
                        </div>

                        <div className={classes.captchaInputWrapper}>
                          <input
                            type='number'
                            {...register('recaptchaCode', {
                              required:
                                userProfileData &&
                                watch('mobile') === userProfileData?.mobile
                                  ? false
                                  : true,
                            })}
                            name='recaptchaCode'
                            placeholder='حاصل عبارت را وارد کنید'
                            className={classes.inputCaptcha}
                          />
                          {errors.recaptchaCode && (
                            <span>لطفا کد کپچا را وارد کنید</span>
                          )}
                        </div>
                      </div>
                    )}
                    <button>ذخیره تغییرات</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </MainLayout>
      )}
    </>
  );
};

export default Profile;
