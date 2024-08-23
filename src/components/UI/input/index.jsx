import { forwardRef, useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import authContext from '../../../context/auth/authContext';

export const NormalInput = forwardRef(function (props, ref) {
  return (
    <label className='flex w-full flex-col items-start text-black'>
      <h4 className='text-[1.4rem] px-4 w-[95%] truncate'>{props.label}</h4>
      <input
        type={!props.type ? 'text' : 'number'}
        ref={ref}
        {...props}
        className={`!bg-[#F3F3F3] rounded overflow-hidden p-3 w-full ${
          props.error ? 'border-[0.2rem] border-red-600 rounded-[0.5rem]' : ''
        }`}
      ></input>
      <div className='text-[1.4rem] px-3 w-[100%] h-10 text-center text-red-600 truncate'>
        {props.error?.message}
      </div>
    </label>
  );
});

export const PasswordInput = forwardRef(function (props, ref) {
  const [show, setShow] = useState(false);
  return (
    <label className='flex w-full flex-col items-start text-black'>
      <h4
        onClick={() => setShow((e) => !e)}
        className='text-[1.4rem] px-4 w-[95%] truncate'
      >
        {props.label}
      </h4>
      <input
        type={show ? 'text' : 'password'}
        ref={ref}
        {...props}
        className={`!bg-[#F3F3F3] rounded overflow-hidden p-3 w-full ${
          props.error ? 'border-[0.2rem] border-red-600 rounded-[0.5rem]' : ''
        }`}
      ></input>
      <div className='text-[1.4rem] px-3 w-[100%] h-10 text-right text-red-600 truncate'>
        {props.error?.message}
      </div>
    </label>
  );
});

export const SelectInput = forwardRef(function (props, ref) {
  const { label, error, onChange, ...newProps } = props;
  const { loadingUser } = useContext(authContext);

  return (
    props.options[props.defaultId - 1] && (
      <label className='flex w-full flex-col items-start text-black'>
        <h4 className='text-[1.4rem] px-4 truncate w-[95%]'>{props.label}</h4>
        <Select
          {...newProps}
          placeholder={props.label}
          defaultValue={props.options[props.defaultId - 1]}
          onChange={(e) => props.setValue(props.name, e.value)}
          className={`!bg-[#fff] rounded-[1rem] w-full whitespace-nowrap ${
            props.error ? 'border-[0.2rem] border-red-600 rounded-[0.5rem]' : ''
          }`}
          options={props.options}
          ref={ref}
        />
        <div className='text-[1.4rem] px-3 w-[100%] h-9 text-right text-red-600 truncate'>
          {props.error?.message}
        </div>
      </label>
    )
  );
});

export const SelectProvince = forwardRef(function (props, ref) {
  const { label, error, onChange, ...newProps } = props;
  const { getCities } = useContext(authContext);

  return (
    <label className='flex w-full flex-col items-start text-black mt-[0.1rem]'>
      {label && (
        <h4 className='text-[1.4rem] px-4 truncate w-[95%]'>{label}</h4>
      )}
      <Select
        placeholder={props.label}
        {...newProps}
        defaultValue={props.options[props.defaultId - 1]}
        onChange={async (e) => {
          props.setValue(props.name, e.value);
          const cities = await getCities(e.value);
          const selectCities = cities.map((city) => ({
            value: city.id,
            label: city.name,
          }));
          props.setCities(selectCities);
          props.setChangCities({ ...props.changeCities, [props.rel]: true });
        }}
        className={`!bg-[#fff] rounded-[0.5rem] w-full whitespace-nowrap ${
          error ? 'border-[0.25rem] border-red-600 rounded-[0.5rem]' : ''
        }`}
        options={props.options}
        ref={ref}
      />
      <div className='text-[1.4rem] px-3 w-[100%] h-9 text-right text-red-600 truncate'>
        {props.error?.message}
      </div>
    </label>
  );
});

export const SelectCities = forwardRef(function (props, ref) {
  const { label, error, onChange, ...newProps } = props;

  useEffect(() => {
    if (props.changeCities[props.rel]) {
      props.setValue(props.name, '');
      props.setChangCities({ ...props.changeCities, [props.rel]: false });
    }
  }, [props.changeCities]);

  const handleValue = () => {
    if (props.options?.find((e) => e.value === props.defaultId)) {
      return props.options?.find((e) => e.value === props.defaultId);
    } else {
      return '';
    }
  };

  return (
    <label className='flex w-full flex-col items-start text-black mt-[0.1rem]'>
      {props.label && (
        <h4 className='text-[1.4rem] px-4 truncate w-[95%]'>{props.label}</h4>
      )}
      <Select
        value={handleValue()}
        placeholder={props.placeholder}
        {...newProps}
        //   defaultValue={props.options.find((e) => e.value === props.defaultId)}
        onChange={async (e) => {
          props.setValue(props.name, e.value);
        }}
        className={`!bg-[#fff] rounded-[0.5rem] w-full whitespace-nowrap ${
          props.error ? 'border-[0.25rem] border-red-600 rounded-[0.5rem]' : ''
        }`}
        options={props.options}
        ref={ref}
      />
      <div className='text-[1.4rem] px-3 w-[100%] h-9 text-right text-red-600 truncate'>
        {props.error?.message}
      </div>
    </label>
  );
});
