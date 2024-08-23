import persianToNumber from '../../helpers/convertNumber/persianToNumber';
import validNationalCode from './validNationalCode';

const authValidate = (data) => {
  const errors = {};
  if (!data?.nationalCode) {
    errors.nationalCode = 'کد ملی خود را وارد کنید';
  } else if (!/^[0-9]{10}$/.test(persianToNumber(data.nationalCode))) {
    errors.nationalCode = 'فرمت کد ملی را صحیح وارد کنید';
  } else {
    delete errors.nationalCode;
  }

  if (!validNationalCode(data.nationalCode)) {
    errors.nationalCode = 'فرمت کد ملی را صحیح وارد کنید';
  }

  if (!data.recaptchaCode) {
    errors.recaptchaCode = 'کد تصویر را وارد کنید';
  } else {
    delete errors?.recaptchaCode;
  }

  return errors;
};

export default authValidate;
