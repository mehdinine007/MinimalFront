import classes from "./Spinner.module.scss";
const Spinner = ({ isButton }) => (
  <div
    className={`${classes.spinner} ${
      isButton ? `${classes.spinnerInButton}` : null
    }`}
  ></div>
);

export default Spinner;
