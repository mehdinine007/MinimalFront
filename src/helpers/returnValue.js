const returnValue = (value) => {
  if (value.toLowerCase() === "true") {
    return "دارد";
  } else if (value.toLowerCase() === "false") {
    return "ندارد";
  } else {
    return value;
  }
};
export default returnValue;
