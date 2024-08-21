import classes from './Steps.module.scss';

const Steps = ({ stepStatus }) => {
  return (
    <>
      <div className={classes.step}>
        <div className={classes.stepItem}>
          <div
            className={`${classes.icon} ${
              stepStatus > 0 ? classes.active : ''
            }`}
          >
            <span>1</span>
          </div>
          <h4 className={classes.stepText}>اطلاعات فردی</h4>
        </div>

        <div className={classes.stepItem}>
          <div
            className={`${classes.icon} ${
              stepStatus > 1 ? classes.active : ''
            }`}
          >
            <span>2</span>
          </div>
          <h4 className={classes.stepText}>اطلاعات شناسایی</h4>
        </div>

        <div className={classes.stepItem}>
          <div
            className={`${classes.icon} ${
              stepStatus > 2 ? classes.active : ''
            }`}
          >
            <span>3</span>
          </div>
          <h4 className={classes.stepText}>اطلاعات تماس</h4>
        </div>

        <div className={classes.stepItem}>
          <div
            className={`${classes.icon} ${
              stepStatus > 3 ? classes.active : ''
            }`}
          >
            <span>4</span>
          </div>
          <h4 className={classes.stepText}>اطلاعات محل سکونت</h4>
        </div>

        <div className={classes.stepItem}>
          <div
            className={`${classes.icon} ${
              stepStatus > 4 ? classes.active : ''
            }`}
          >
            <span>5</span>
          </div>
          <h4 className={classes.stepText}>تعیین رمز عبور</h4>
        </div>
      </div>
      <span className={classes.stepName}>
        {stepStatus === 1
          ? 'اطلاعات فردی'
          : stepStatus === 2
          ? 'اطلاعات شناسایی'
          : stepStatus === 3
          ? 'اطلاعات تماس'
          : stepStatus === 4
          ? 'اطلاعات محل سکونت '
          : stepStatus === 5
          ? 'تعیین رمز عبور'
          : null}
      </span>
    </>
  );
};

export default Steps;
