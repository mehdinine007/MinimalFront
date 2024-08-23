import persianToNumber from "../convertNumber/persianToNumber";

const validNationalCode = function (viewValue) {
  var meli_code = viewValue;

  if (meli_code === undefined || meli_code.length === 0) return true;
  for (var i = 0; i < 10; i++) {
    viewValue = viewValue.replace(persianToNumber[i]);
  }
  meli_code = viewValue;
  var regExp = new RegExp("^\\d+$");

  if (meli_code.length !== 10 || !regExp.test(meli_code)) {
    return false;
  }
  if (meli_code?.length === 10) {
    if (
      meli_code === "1111111111" ||
      meli_code === "0000000000" ||
      meli_code === "2222222222" ||
      meli_code === "3333333333" ||
      meli_code === "4444444444" ||
      meli_code === "5555555555" ||
      meli_code === "6666666666" ||
      meli_code === "7777777777" ||
      meli_code === "8888888888" ||
      meli_code === "9999999999"
    ) {
      return false;
    }
    var c = parseInt(meli_code.charAt(9));
    var n =
      parseInt(meli_code.charAt(0)) * 10 +
      parseInt(meli_code.charAt(1)) * 9 +
      parseInt(meli_code.charAt(2)) * 8 +
      parseInt(meli_code.charAt(3)) * 7 +
      parseInt(meli_code.charAt(4)) * 6 +
      parseInt(meli_code.charAt(5)) * 5 +
      parseInt(meli_code.charAt(6)) * 4 +
      parseInt(meli_code.charAt(7)) * 3 +
      parseInt(meli_code.charAt(8)) * 2;
    var r = n - parseInt(n / 11) * 11;
    if (
      (r === 0 && r === c) ||
      (r === 1 && c === 1) ||
      (r > 1 && c === 11 - r)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default validNationalCode;
