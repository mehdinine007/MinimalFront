import { DatePicker } from 'react-advance-jalaali-datepicker';

const DatepickerAndLabel = ({
  onChange,
  preSelected,
  label,
  formData,
  errors,
  submited,
  date,
  placeholder,
  name,
}) => {
  const DatePickerInput = (props) => {
    return (
      <div className='flex flex-col'>
        <label
          className='mb-[1rem] text-[1.4rem] whitespace-nowrap'
          id='label-input'
        >
          <span> {label} </span>
        </label>
        <input
          className={`bg-[#F3F3F3] h-[4.2rem] px-5 outline-none rounded-[.4rem] ${
            errors.birthDate && submited && 'border border-[#FE4231]'
          }`}
          aria-labelledby='label-input'
          {...props}
          placeholder={placeholder}
        />
      </div>
    );
  };

  const change = (_unix, formatted) => {
    onChange({ ...formData, [date]: formatted }); // returns the selected value in the format you've entered, forexample, "تاریخ: 1396/02/24 ساعت: 18:30".
  };

  return (
    <section>
      <DatePicker
        inputComponent={DatePickerInput}
        placeholder=''
        format='jYYYY/jMM/jDD'
        onChange={change}
        id='datePicker'
        preSelected={preSelected ? preSelected : ''}
        name={name}
      />
    </section>
  );
};

export default DatepickerAndLabel;
