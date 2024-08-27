import persianToNumber from '../convertNumber/persianToNumber';

const loginValidate = (data) => {
  const errors = {};

  if (!data.password) {
    errors.password = 'رمزعبور خود را وارد کنید!';
  } else if (data.password.length < 8) {
    errors.password = 'رمزعبور باید حداقل 8 حرف باشد!';
  } else {
    delete errors.password;
  }

  if (!data.nationalCode) {
    errors.nationalCode = 'کد ملی خود را وارد کنید!';
  } else if (!/^[0-9]{10}$/.test(persianToNumber(data.nationalCode))) {
    errors.nationalCode = 'فرمت کد ملی را صحیح وارد کنید!';
  } else {
    delete errors.nationalCode;
  }

  return errors;
};

export default loginValidate;
