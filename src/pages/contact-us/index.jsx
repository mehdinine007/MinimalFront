import { useForm } from 'react-hook-form';
import MainLayout from '../../components/layout/MainLayout';
import Select from 'react-select';
import classes from './ContactUs.module.scss';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';

import contact1 from '../../assets/icons/contact1.svg';
import contact2 from '../../assets/icons/contact2.svg';
import contact3 from '../../assets/icons/contact3.svg';

import 'leaflet/dist/leaflet.css';

const ContactUs = () => {
  const position = [36.71398239496468, 51.2172139875299];

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const departmentOptions = [
    { value: 'فروش', label: 'فروش' },
    { value: 'خدمات پس از فروش', label: 'خدمات پس از فروش' },
    { value: 'بازرگانی', label: 'بازرگانی' },
    { value: 'مالی', label: 'مالی' },
    { value: 'مدیریت', label: 'مدیریت' },
    { value: 'مارکتینگ', label: 'مارکتینگ' },
    { value: 'سایر', label: 'سایر' },
  ];

  const onSubmit = (data, e) => {
    e.preventDefault();
    window.location.href = `mailto:CRM@test.com?subject=${'فرم تماس با ما سایت'}&body=موضوع: ${
      data?.subject
    } ||| نام خانوادگی: ${data?.fullName} ||| شماره تماس: ${
      data?.tell
    } ||| دپارتمان: ${data?.department} ||| متن پیام: ${data?.userMessage}`;
  };

  useEffect(() => {
    window?.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
      <div className={classes.bgWrapper}>
        <div className='container'>
          <div className={classes.contentWrapper}>
            <h1>ارتباط با ما</h1>

            <div className={classes.mapAndFormWrapper}>
              <div className={classes.mapWrapper}>
                <MapContainer
                  center={position}
                  zoom={15}
                  scrollWheelZoom={true}
                >
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <Marker position={position}>
                    <Popup>شرکت</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('fullName')?.trim() && classes.inputHasData
                    }
                  >
                    نام و نام خانوادگی
                  </label>
                  <input
                    {...register('fullName', {
                      required: 'نام و نام خانوادگی اجباری میباشد!',
                      minLength: 2,
                    })}
                    type='text'
                    name='fullName'
                    className={errors.fullName ? classes.inputError : null}
                    placeholder='نام و نام خانوادگی خود را وارد کنید'
                  />

                  {errors.fullName && <span>{errors.fullName.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={watch('tell')?.trim() && classes.inputHasData}
                  >
                    شماره تماس
                  </label>
                  <input
                    {...register('tell', {
                      required: 'تلفن تماس اجباری میباشد!',
                      minLength: 7,
                      maxLength: 11,
                    })}
                    type='number'
                    name='tell'
                    className={errors.tell ? classes.inputError : null}
                    placeholder='شماره تماس خود را وارد کنید'
                  />

                  {errors.tell && <span>{errors.tell.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={watch('subject')?.trim() && classes.inputHasData}
                  >
                    موضوع
                  </label>
                  <input
                    {...register('subject', {
                      required: 'موضوع اجباری میباشد!',
                      minLength: 3,
                    })}
                    type='text'
                    name='subject'
                    className={errors.subject ? classes.inputError : null}
                    placeholder='موضوع پیام را وارد کنید'
                  />

                  {errors.subject && <span>{errors.subject.message}</span>}
                </div>
                <div className={classes.inputWrapper}>
                  <label
                    className={
                      watch('department') ? classes.inputHasData : undefined
                    }
                  >
                    دپارتمان
                  </label>
                  <Select
                    {...register('department', {
                      required: 'دپارتمان اجباری میباشد!',
                    })}
                    isSearchable={false}
                    className='select-input'
                    name='department'
                    placeholder='انتخاب دپارتمان'
                    options={departmentOptions}
                    onChange={(option) => {
                      setValue('department', option ? option?.value : option);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: errors?.department ? '1px solid red' : 'none',
                        boxShadow: 'none',
                        width: '100%',
                        height: '58px',
                      }),
                    }}
                  />

                  {errors.department && (
                    <span>{errors.department.message}</span>
                  )}
                </div>
                <div className={classes.fullWidth}>
                  <label
                    className={
                      watch('userMessage')?.trim() && classes.inputHasData
                    }
                  >
                    متن پیام
                  </label>
                  <textarea
                    {...register('userMessage', {
                      required: 'متن پیام اجباری میباشد!',
                      minLength: 3,
                    })}
                    type='text'
                    name='userMessage'
                    className={errors.userMessage ? classes.inputError : null}
                    placeholder='پیام خود را بنویسید'
                  ></textarea>

                  {errors.userMessage && (
                    <span>{errors.userMessage.message}</span>
                  )}
                </div>
                <div className={classes.buttonWrapper}>
                  <button type='submit'>ارسال </button>
                </div>
              </form>
            </div>
            <ul className={classes.contacts}>
              <li>
                <img src={contact1} alt='' />
                <p>‍CRM@test.com</p>
              </li>
              <li>
                <img src={contact2} alt='' />
                <p>آدرس</p>
              </li>
              <li>
                <img src={contact3} alt='' />
                <p>02100000000</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUs;

{
  /* <div className={classes.callInfo}>
<h2>اطلاعات تماس</h2>
<p>با ما از طریق راه های ارتباطی زیر در تماس باشید:</p>
<ul>
  <li>
    : صندوق پستی
    <p className='faNum'>13445-554</p>
  </li>
  <li>
    کد پستی :<p className='faNum'>13311-13961</p>
  </li>
  <li>
    شماره نمابر
    <p className='faNum'> 44194934-5 (021)</p>
  </li>

  <li>
    {/* <img src={locationIcon} alt='location icon' /> */
}
// <p className='faNum'>
{
  /* آدرس : تهران - كيلومتر 15 بزرگراه شهيد لشگري (جاده مخصوص */
}
{
  /* كرج) - شركت سايپا */
}
{
  /* </p> */
}
// </li>
// </ul>
// </div> */}
