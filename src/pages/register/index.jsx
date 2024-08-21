import { useState, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Select, { components } from 'react-select';
import authContext from '../../context/auth/authContext';
import refreshIcon from '../../assets/icons/refresh.svg';
import persianToNumber from '../../helpers/convertNumber/persianToNumber';
import closeEye from '../../assets/icons/eye-close.svg';
import openEye from '../../assets/icons/eye-open.svg';
import { DatePicker } from 'react-advance-jalaali-datepicker';
import RegisterModal from '../../components/modals/register';
import classes from './Register.module.scss';
import moment from 'jalali-moment';
import MainLayout from '../../components/layout/MainLayout';
import Steps from '../../components/register/Steps';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/layout/AuthLayout';
import Spinner from '../../components/UI/spinner';

const tenDigitNumber = Math?.floor(Math.random() * 9000000000);

const Register = () => {
  const [passwordType, setPasswordType] = useState(true);
  const [stepStatus, setStepStatus] = useState(1);
  const [recaptchaImage, setRecaptchaImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    getCities,
    getProvinces,
    provinces,
    nationalCode,
    sendOtp,
    getRecaptcha,
  } = useContext(authContext);
  const [registerData, setRegisterData] = useState({});
  const [birthCitiesOptions, setBirthCitiesOptions] = useState([]);
  const [issuingCitiesOptions, setIssuingCitiesOptions] = useState([]);
  const [habitationCitiesOptions, setHabitationCitiesOptions] = useState([]);

  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.{8,})'
  );

  const provincesOptions = provinces?.map((province) => ({
    value: province.id,
    label: province.name,
  }));
  const DatePickerInput = (props) => {
    return (
      <input
        autoComplete='none'
        {...props}
        name={props.name}
        value={props.value}
      />
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    watch,
    trigger,
  } = useForm();

  const birthCitiesSelectRef = useRef();
  const issuingCitiesSelectRef = useRef();
  const habitationCitiesSelectRef = useRef();

  const genderOptions = [
    { value: 1, label: 'آقا' },
    { value: 2, label: 'خانم' },
  ];

  useEffect(() => {
    getProvinces();
    getRecaptchaHandler(tenDigitNumber);
    setValue('nationalCode', nationalCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = moment(new Date()).format('jYYYY/jMM/jDD');

  const triggerFirstStepInputs = () => {
    trigger('name');
    trigger('surname');
    trigger('gender');
    trigger('fatherName');
    trigger('birthDate');
  };

  const firstStepHandler = (event) => {
    event.preventDefault();
    triggerFirstStepInputs();
    if (
      watch('name')?.trim() === '' ||
      watch('surname')?.trim() === '' ||
      !watch('gender') === true ||
      watch('fatherName')?.trim() === '' ||
      !watch('birthDate')
    ) {
      null;
    } else if (watch('birthDate') > today) {
      toast.error('تاریخ تولد نمیتواند از تاریخ امروز بیشتر باشد!');
    } else if (watch('issuingDate') > today) {
      toast.error('تاریخ صدور شناسنامه نمیتواند از تاریخ امروز بیشتر باشد!');
    } else if (watch('birthDate') > watch('issuingDate')) {
      toast.error('تاریخ تولد نمیتواند از تاریخ صدور شناسنامه بیشتر باشد!');
    } else {
      setStepStatus(2);
    }
  };

  const triggerSecondStepInputs = () => {
    trigger('birthCertId');
    trigger('birthProvinceId');
    trigger('birthCityId');
    trigger('issuingDate');
    trigger('issuingProvinceId');
    trigger('issuingCityId');
  };

  const secondStepHandler = (event) => {
    event.preventDefault();
    triggerSecondStepInputs();
    if (
      watch('birthCertId')?.trim() === '' ||
      !watch('birthProvinceId') ||
      !watch('birthCityId') ||
      !watch('issuingDate') ||
      !watch('issuingProvinceId') ||
      !watch('issuingCityId')
    ) {
      null;
    } else if (watch('issuingDate') > today) {
      toast.error('تاریخ صدور شناسنامه نمیتواند از تاریخ امروز بیشتر باشد!');
    } else if (watch('birthDate') > watch('issuingDate')) {
      toast.error('تاریخ تولد نمیتواند از تاریخ صدور شناسنامه بیشتر باشد!');
    } else {
      setStepStatus(3);
    }
  };

  const triggerThirdStepInputs = () => {
    trigger('tel');
    trigger('mobile');
  };

  const regixMobileNumber = /^(0)?9\d{9}$/g;
  const regixTelNumber = /^0[0-9]{6,10}$/g;
  const regixPostalCode = /^[0-9]{10}$/g;

  const thirdStepHandler = (event) => {
    event.preventDefault();
    triggerThirdStepInputs();
    if (watch('tel')?.trim() === '' || watch('mobile')?.trim() === '') {
      null;
    } else if (!/^(0)?9\d{9}$/g.test(watch('mobile')?.trim())) {
      toast.error('فرمت شماره موبایل نامعتبر میباشد!');
    } else if (!/^0[0-9]{6,10}$/g.test(watch('tel')?.trim())) {
      toast.error('فرمت تلفن ثابت نامعتبر میباشد!');
    } else {
      setStepStatus(4);
    }
  };

  const triggerFourthStepInputs = () => {
    trigger('habitationProvinceId');
    trigger('habitationCityId');
    trigger('postalCode');
    trigger('street');
    trigger('alley');
    trigger('pelaq');
    trigger('regionId');
    trigger('address');
  };

  const fourthStepHandler = (event) => {
    event.preventDefault();
    triggerFourthStepInputs();
    if (
      !watch('habitationProvinceId') ||
      !watch('habitationCityId') ||
      watch('postalCode')?.trim() === '' ||
      watch('street')?.trim() === '' ||
      watch('alley')?.trim() === '' ||
      watch('pelaq')?.trim() === '' ||
      watch('regionId')?.trim() === '' ||
      watch('address')?.trim() === ''
    ) {
      null;
    } else if (!/^[0-9]{10}$/g.test(watch('postalCode')?.trim())) {
      toast.error('فرمت کدپستی نامعتبر میباشد!');
    } else {
      setStepStatus(5);
    }
  };

  const prevStepHandler = (event) => {
    event.preventDefault();
    setStepStatus((stepStatus) => stepStatus - 1);
  };
  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span className='custom-css-class'>موردی وجود ندارد</span>
      </components.NoOptionsMessage>
    );
  };

  const onSubmitForm = async (data) => {
    setLoading(true);
    const response = await sendOtp({
      nationalCode: persianToNumber(data?.nationalCode),
      recipient: persianToNumber(data?.mobile),
      smsLocation: 1,
      cit: String(tenDigitNumber),
      ck: String(persianToNumber(data?.recaptchaCode)),
      ct: 'string',
    });
    setLoading(false);

    if (response?.status === 200) {
      setShowModal(true);
      setRegisterData(data);
    } else {
      getRecaptchaHandler(tenDigitNumber);
    }
  };

  const getRecaptchaHandler = async () => {
    const recaptcha = await getRecaptcha(tenDigitNumber);
    setRecaptchaImage(recaptcha);
  };
  return (
    <MainLayout>
      {showModal && (
        <RegisterModal
          visibility={showModal}
          setShowModal={setShowModal}
          formData={registerData}
        />
      )}

      <AuthLayout title='ثبت نام'>
        <div className={classes.formAndStepWrapper}>
          <Steps stepStatus={stepStatus} />

          <form onSubmit={handleSubmit(onSubmitForm)}>
            {/* STEP 1 */}
            <div
              className={classes.activeStepWrapper}
              style={
                stepStatus === 1 ? { display: 'flex' } : { display: 'none' }
              }
            >
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={watch('name') ? classes.inputHasData : null}
                  >
                    نام
                  </label>
                  <input
                    autoComplete='none'
                    {...register('name', { required: 'نام اجباری میباشد!' })}
                    name='name'
                    className={errors.name ? classes.inputError : null}
                    placeholder='نام خود را وارد کنید'
                  />

                  {errors.name && <span>{errors.name.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('surname')?.trim() ? classes.inputHasData : null
                    }
                  >
                    نام خانوادگی
                  </label>
                  <input
                    autoComplete='none'
                    {...register('surname', {
                      required: 'نام خانوادگی اجباری میباشد!',
                    })}
                    name='surname'
                    className={errors.surname ? classes.inputError : null}
                    placeholder='نام خانوادگی خود را وارد کنید'
                  />

                  {errors.surname && <span>{errors.surname.message}</span>}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={watch('gender') ? classes.inputHasData : null}
                  >
                    جنسیت
                  </label>
                  <Select
                    {...register('gender', {
                      required: 'جنسیت اجباری میباشد!',
                    })}
                    isSearchable={false}
                    className='select-input'
                    name='gender'
                    placeholder='جنسیت خود را انتخاب کنید'
                    options={genderOptions}
                    required
                    onChange={(option) => {
                      setValue('gender', option ? option?.value : option);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors?.gender
                          ? '1px solid red !important'
                          : 'none',
                      }),
                    }}
                  />

                  {errors.gender && <span>{errors.gender.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('fatherName') ? classes.inputHasData : null
                    }
                  >
                    نام پدر
                  </label>
                  <input
                    autoComplete='none'
                    {...register('fatherName', {
                      required: 'نام پدر اجباری میباشد!',
                    })}
                    name='fatherName'
                    className={errors.fatherName ? classes.inputError : null}
                    placeholder='نام پدر خود را وارد کنید'
                  />

                  {errors.fatherName && (
                    <span>{errors.fatherName.message}</span>
                  )}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={watch('birthDate') ? classes.inputHasData : null}
                  >
                    تاریخ تولد
                  </label>
                  <DatePicker
                    {...register('birthDate', {
                      required: 'تاریخ تولد اجباری میباشد!',
                    })}
                    inputComponent={DatePickerInput}
                    className='date-picker'
                    format='jYYYY/jMM/jDD'
                    placeholder='تاریخ تولد خود را انتخاب کنید'
                    onChange={(unix, formatted) => {
                      setValue('birthDate', formatted);
                      if (formatted > today) {
                        setError('birthDate', {
                          type: 'manual',
                          message: 'تاریخ تولد نامعتبر میباشد!',
                        });
                      }
                    }}
                    id={errors.birthDate ? 'redBorderDatePicker' : null}
                  />

                  {errors.birthDate && <span>{errors.birthDate.message}</span>}
                </div>
              </div>
            </div>
            {/* STEP 2 */}
            <div
              className={classes.activeStepWrapper}
              style={
                stepStatus === 2 ? { display: 'flex' } : { display: 'none' }
              }
            >
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label className={nationalCode ? classes.inputHasData : null}>
                    کد ملی
                  </label>
                  <input
                    autoComplete='none'
                    disabled
                    {...register('nationalCode', {
                      required: true,
                    })}
                    name='nationalCode'
                    defaultValue={nationalCode}
                    type='text'
                    className='disabled'
                  />
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('birthCertId') ? classes.inputHasData : null
                    }
                  >
                    شماره شناسنامه
                  </label>
                  <input
                    autoComplete='none'
                    {...register('birthCertId', {
                      required: 'شماره شناسنامه اجباری میباشد!',
                    })}
                    name='birthCertId'
                    type='text'
                    className={errors.birthCertId ? classes.inputError : null}
                    placeholder='شماره شناسنامه خود را وارد کنید'
                  />

                  {errors.birthCertId && (
                    <span>{errors.birthCertId.message}</span>
                  )}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('birthProvinceId') ? classes.inputHasData : null
                    }
                  >
                    استان محل تولد
                  </label>
                  <Select
                    className='select-input'
                    options={provincesOptions}
                    name='birthProvinceId'
                    placeholder='استان محل تولد خود را انتخاب کنید'
                    {...register('birthProvinceId', {
                      required: 'استان محل تولد اجباری میباشد!',
                    })}
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
                          ? '1px solid red !important'
                          : 'none',
                        boxShadow: 'none',
                      }),
                    }}
                  />

                  {errors?.birthProvinceId && (
                    <span>{errors?.birthProvinceId?.message}</span>
                  )}
                </div>

                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('birthCityId') ? classes.inputHasData : null
                    }
                  >
                    شهر محل تولد
                  </label>
                  <Select
                    {...register('birthCityId', {
                      required: 'شهر محل تولد اجباری میباشد!',
                    })}
                    components={{ NoOptionsMessage }}
                    className='select-input'
                    placeholder='شهر محل تولد خود را انتخاب کنید'
                    options={birthCitiesOptions}
                    name='birthCityId'
                    ref={birthCitiesSelectRef}
                    onChange={(option) => {
                      setValue('birthCityId', option ? option?.value : null);
                      delete errors?.birthCityId;
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors?.birthCityId
                          ? '1px solid red !important'
                          : 'none',
                        boxShadow: 'none',
                      }),
                    }}
                  />

                  {errors?.birthCityId && (
                    <span>{errors?.birthCityId?.message}</span>
                  )}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('issuingDate') ? classes.inputHasData : null
                    }
                  >
                    تاریخ صدور شناسنامه
                  </label>

                  <DatePicker
                    {...register('issuingDate', {
                      required: 'تاریخ صدور شناسنامه اجباری میباشد!',
                    })}
                    inputComponent={DatePickerInput}
                    format='jYYYY/jMM/jDD'
                    onChange={(unix, formatted) => {
                      setValue('issuingDate', formatted);
                      if (formatted > today) {
                        setError('issuingDate', {
                          type: 'manual',
                          message: 'تاریخ صدور شناسنامه نامعتبر میباشد!',
                        });
                      }
                      if (watch('birthDate') > formatted) {
                        setError('issuingDate', {
                          type: 'manual',
                          message: 'تاریخ صدور شناسنامه نامعتبر میباشد!',
                        });
                      }
                    }}
                    name='issuingDate'
                    id={errors?.issuingDate ? 'redBorderDatePicker' : null}
                    placeholder='تاریخ صدور شناسنامه خود را انتخاب کنید'
                  />

                  {errors?.issuingDate && (
                    <span>{errors?.issuingDate?.message}</span>
                  )}
                </div>

                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('issuingProvinceId') ? classes.inputHasData : null
                    }
                  >
                    استان صدور شناسنامه
                  </label>
                  <Select
                    className='select-input'
                    placeholder='استان صدور شناسنامه خود را انتخاب کنید'
                    options={provincesOptions}
                    name='issuingProvinceId'
                    {...register('issuingProvinceId', {
                      required: 'استان صدور شناسنامه اجباری میباشد!',
                    })}
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
                          ? '1px solid red !important'
                          : 'none',
                        boxShadow: 'none',
                      }),
                    }}
                  />

                  {errors?.issuingProvinceId && (
                    <span>{errors?.issuingProvinceId?.message}</span>
                  )}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('issuingCityId') ? classes.inputHasData : null
                    }
                  >
                    شهر صدور شناسنامه
                  </label>
                  <Select
                    {...register('issuingCityId', {
                      required: 'شهر صدور شناسنامه اجباری میباشد!',
                    })}
                    components={{ NoOptionsMessage }}
                    className='select-input'
                    placeholder='شهر صدور شناسنامه خود را انتخاب کنید'
                    options={issuingCitiesOptions}
                    name='issuingCityId'
                    ref={issuingCitiesSelectRef}
                    onChange={(option) => {
                      setValue('issuingCityId', option ? option?.value : null);
                      delete errors?.issuingCityId;
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors?.issuingCityId
                          ? '1px solid red !important'
                          : 'none',
                        boxShadow: 'none',
                      }),
                    }}
                  />

                  {errors?.issuingCityId && (
                    <span>{errors?.issuingCityId?.message}</span>
                  )}
                </div>
              </div>
            </div>
            {/* STEP 3 */}
            <div
              className={classes.activeStepWrapper}
              style={
                stepStatus === 3 ? { display: 'flex' } : { display: 'none' }
              }
            >
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('tel')?.trim() ? classes.inputHasData : null
                    }
                  >
                    تلفن ثابت
                  </label>
                  <input
                    autoComplete='none'
                    {...register('tel', {
                      required: 'تلفن ثابت اجباری میباشد!',
                      pattern: {
                        value: persianToNumber(regixTelNumber),
                        message: 'فرمت وارد شده اشتباه میباشد!',
                      },
                    })}
                    name='tel'
                    type='text'
                    className={errors?.tel ? classes.inputError : null}
                    placeholder=' تلفن ثابت خود را وارد کنید'
                  />

                  {errors?.tel && <span>{errors?.tel.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('mobile')?.trim() ? classes.inputHasData : null
                    }
                  >
                    شماره موبایل
                  </label>
                  <input
                    autoComplete='none'
                    type='number'
                    {...register('mobile', {
                      required: 'شماره موبایل اجباری میباشد!',
                      pattern: {
                        value: persianToNumber(regixMobileNumber),
                        message: 'فرمت وارد شده اشتباه میباشد!',
                      },
                      minLength: 11,
                      maxLength: 11,
                    })}
                    name='mobile'
                    className={errors?.mobile ? classes.inputError : null}
                    placeholder='شماره موبایل خود را وارد کنید'
                  />

                  {errors?.mobile && <span>{errors?.mobile?.message}</span>}
                  {errors?.mobile?.type === 'minLength' && (
                    <span>شماره موبایل نامعتبر میباشد!</span>
                  )}
                  {errors?.mobile?.type === 'maxLength' && (
                    <span>شماره موبایل نامعتبر میباشد!</span>
                  )}
                </div>
              </div>
            </div>
            {/* STEP 4 */}
            <div
              className={classes.activeStepWrapper}
              style={
                stepStatus === 4 ? { display: 'flex' } : { display: 'none' }
              }
            >
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('habitationProvinceId')
                        ? classes.inputHasData
                        : null
                    }
                  >
                    استان محل سکونت
                  </label>
                  <Select
                    className='select-input'
                    placeholder='استان محل سکونت خود را انتخاب کنید'
                    options={provincesOptions}
                    name='habitationProvinceId'
                    {...register('habitationProvinceId', {
                      required: 'استان محل سکونت اجباری میباشد!',
                    })}
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
                      habitationCitiesSelectRef.current?.clearValue();
                      setHabitationCitiesOptions(selectCities);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors?.habitationProvinceId
                          ? '1px solid red !important'
                          : 'none',
                        boxShadow: 'none',
                      }),
                    }}
                  />

                  {errors?.habitationProvinceId && (
                    <span>{errors?.habitationProvinceId?.message}</span>
                  )}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('habitationCityId') ? classes.inputHasData : null
                    }
                  >
                    شهر محل سکونت
                  </label>
                  <Select
                    {...register('habitationCityId', {
                      required: 'شهر محل سکونت اجباری میباشد!',
                    })}
                    placeholder='شهر محل سکونت خود را انتخاب کنید'
                    components={{ NoOptionsMessage }}
                    className='select-input'
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
                          ? '1px solid red !important'
                          : 'none',
                        boxShadow: 'none',
                      }),
                    }}
                  />

                  {errors?.habitationCityId && (
                    <span>{errors?.habitationCityId?.message}</span>
                  )}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('postalCode')?.trim() ? classes.inputHasData : null
                    }
                  >
                    کد پستی
                  </label>
                  <input
                    {...register('postalCode', {
                      required: 'کدپستی اجباری میباشد!',
                      pattern: {
                        value: regixPostalCode,
                        message: 'فرمت وارد شده اشتباه میباشد!',
                      },
                    })}
                    name='postalCode'
                    type='text'
                    className={errors?.postalCode ? classes.inputError : null}
                    placeholder='کدپستی خود را وارد کنید'
                  />

                  {errors?.postalCode && (
                    <span>{errors?.postalCode?.message}</span>
                  )}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('street')?.trim() ? classes.inputHasData : null
                    }
                  >
                    خیابان
                  </label>
                  <input
                    type='text'
                    {...register('street', {
                      required: 'خیابان اجباری میباشد!',
                    })}
                    name='street'
                    className={errors?.street ? classes.inputError : null}
                    placeholder='نام خیابان خود را وارد کنید'
                  />

                  {errors?.street && <span>{errors?.street?.message}</span>}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('alley')?.trim() ? classes.inputHasData : null
                    }
                  >
                    کوچه
                  </label>
                  <input
                    type='text'
                    {...register('alley', {
                      required: 'کوچه اجباری میباشد!',
                    })}
                    name='alley'
                    className={errors?.alley ? classes.inputError : null}
                    placeholder='نام کوچه خود را وارد کنید'
                  />

                  {errors?.alley && <span>{errors?.alley?.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('pelaq')?.trim() ? classes.inputHasData : null
                    }
                  >
                    پلاک
                  </label>
                  <input
                    type='text'
                    {...register('pelaq', {
                      required: 'پلاک اجباری میباشد!',
                    })}
                    name='pelaq'
                    className={errors?.pelaq ? classes.inputError : null}
                    placeholder='پلاک خود را وارد کنید'
                  />

                  {errors?.pelaq && <span>{errors?.pelaq?.message}</span>}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('regionId')?.trim() ? classes.inputHasData : null
                    }
                  >
                    کد منطقه
                  </label>
                  <input
                    type='number'
                    {...register('regionId', {
                      required: 'کد منطقه اجباری میباشد!',
                    })}
                    name='regionId'
                    className={errors?.regionId ? classes.inputError : null}
                    defaultValue={'1'}
                    placeholder='کد منطقه خود را وارد کنید'
                  />

                  {errors?.regionId && <span>{errors?.regionId?.message}</span>}
                </div>
              </div>
              <div className={classes.rowWrapperFull}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('address')?.trim() ? classes.inputHasData : null
                    }
                  >
                    آدرس
                  </label>
                  <textarea
                    {...register('address', {
                      required: 'آدرس اجباری میباشد!',
                    })}
                    name='address'
                    className={errors?.address ? classes.inputError : null}
                    placeholder='آدرس خود را وارد کنید'
                  ></textarea>

                  {errors?.address && <span>{errors?.address?.message}</span>}
                </div>
              </div>
            </div>
            {/* STEP 5 */}
            <div
              className={classes.activeStepWrapper}
              style={
                stepStatus === 5 ? { display: 'flex' } : { display: 'none' }
              }
            >
              <div className={classes.rowWrapper}>
                <div className={classes.inputWrapper}>
                  <label
                    className={watch('password') ? classes.inputHasData : null}
                  >
                    رمز عبور
                  </label>
                  <input
                    type={passwordType ? 'password' : 'text'}
                    autoComplete='none'
                    {...register('password', {
                      required: 'رمز عبور اجباری میباشد!',
                      pattern: {
                        value: strongRegex,
                        message: 'فرمت وارد شده اشتباه میباشد!',
                      },
                    })}
                    name='password'
                    className={errors?.password ? classes.inputError : null}
                    placeholder='رمز عبور خود را وارد کنید'
                  />

                  <img
                    onClick={() => {
                      setPasswordType(!passwordType);
                    }}
                    src={passwordType ? closeEye : openEye}
                    alt='eye icon'
                  />
                  {errors?.password && <span>{errors?.password?.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('confirmPassword') ? classes.inputHasData : null
                    }
                  >
                    تکرار رمز عبور
                  </label>
                  <input
                    {...register('confirmPassword', {
                      required: true,
                      validate: (val) => {
                        if (watch('password') != val) {
                          return '!رمز عبور و تکرار رمز عبور یکسان نیست';
                        }
                      },
                    })}
                    autoComplete='none'
                    className={
                      watch('password')?.trim() !==
                      watch('confirmPassword')?.trim()
                        ? classes.inputError
                        : null
                    }
                    type={passwordType ? 'password' : 'text'}
                    name='confirmPassword'
                    placeholder='رمز عبور خود را مجددا وارد کنید'
                  />

                  <img
                    onClick={() => {
                      setPasswordType(!passwordType);
                    }}
                    src={passwordType ? closeEye : openEye}
                    alt='eye icon'
                  />
                  {watch('password')?.trim() !==
                    watch('confirmPassword')?.trim() && (
                    <span>رمز عبور و تکرار رمز باید یکسان باشد</span>
                  )}
                </div>
              </div>
              <div className={classes.rowWrapper}>
                <div className={classes.captchaWrapper}>
                  <div className={classes.captchaImageWrapper}>
                    {recaptchaImage && (
                      <img src={recaptchaImage} alt='recaptcha' />
                    )}
                  </div>
                  <div className={classes.refreshImageWrapper}>
                    <img
                      src={refreshIcon}
                      alt='refresh recaptcha'
                      onClick={() => getRecaptchaHandler(tenDigitNumber)}
                    />
                  </div>
                </div>

                <div className={classes.inputWrapper}>
                  <div className={classes.captchaInputWrapper}>
                    <input
                      name='recaptchaCode'
                      {...register('recaptchaCode', {
                        required: 'کپچا اجباری میباشد!',
                      })}
                      type='number'
                      placeholder='حاصل عبارت را وارد کنید'
                    />
                  </div>

                  {errors?.recaptchaCode && (
                    <span>{errors?.recaptchaCode?.message}</span>
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
            </div>

            {stepStatus === 1 ? (
              <div className={classes.btnWrapper}>
                <div
                  className={classes.nextStepBtn}
                  onClick={(e) => {
                    firstStepHandler(e);
                  }}
                >
                  <span>مرحله بعد</span>
                </div>
              </div>
            ) : stepStatus === 2 ? (
              <div className={classes.btnWrapper}>
                <span
                  className={classes.previousStepBtn}
                  onClick={(e) => {
                    prevStepHandler(e);
                  }}
                >
                  مرحله قبل
                </span>
                <span
                  className={classes.nextStepBtn}
                  onClick={(e) => {
                    secondStepHandler(e);
                  }}
                >
                  مرحله بعد
                </span>
              </div>
            ) : stepStatus === 3 ? (
              <div className={classes.btnWrapper}>
                <span
                  className={classes.previousStepBtn}
                  onClick={(e) => {
                    prevStepHandler(e);
                  }}
                >
                  مرحله قبل
                </span>
                <span
                  className={classes.nextStepBtn}
                  onClick={(e) => {
                    thirdStepHandler(e);
                  }}
                >
                  مرحله بعد
                </span>
              </div>
            ) : stepStatus === 4 ? (
              <div className={classes.btnWrapper}>
                <span
                  className={classes.previousStepBtn}
                  onClick={(e) => {
                    prevStepHandler(e);
                  }}
                >
                  مرحله قبل
                </span>
                <span
                  className={classes.nextStepBtn}
                  onClick={(e) => {
                    fourthStepHandler(e);
                  }}
                >
                  مرحله بعد
                </span>
              </div>
            ) : stepStatus === 5 ? (
              <div className={classes.btnWrapper}>
                <span
                  className={classes.previousStepBtn}
                  onClick={(e) => {
                    prevStepHandler(e);
                  }}
                >
                  مرحله قبل
                </span>
                {loading ? (
                  <button className={classes.registerBtn} type='button'>
                    <Spinner isButton />
                  </button>
                ) : (
                  <button className={classes.registerBtn} type='submit'>
                    تایید
                  </button>
                )}
              </div>
            ) : null}
          </form>
        </div>
      </AuthLayout>
    </MainLayout>
  );
};
export default Register;
