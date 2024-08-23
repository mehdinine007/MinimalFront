import classes from './Steps.module.scss';

import step1Icon from '../../../assets/icons/step1.svg';
import step1WhiteIcon from '../../../assets/icons/step1-white.svg';
import step2Icon from '../../../assets/icons/step2.svg';
import step2WhiteIcon from '../../../assets/icons/step2-white.svg';
import step3Icon from '../../../assets/icons/step3.svg';
import step3WhiteIcon from '../../../assets/icons/step3-white.svg';
import step4Icon from '../../../assets/icons/step4.svg';
import step4WhiteIcon from '../../../assets/icons/step4-white.svg';
import stepsArrowLeftIcon from '../../../assets/icons/steps-arrow-left.svg';
import stepsArrowBottomIcon from '../../../assets/icons/steps-arrow-bottom.svg';

const Steps = () => {
  return (
    <div className={classes.stepsWrapper}>
      {/* <h2>لورم ایپسوم متن ساختگی</h2> */}
      <ul className={classes.steps}>
        <li>
          <div className={classes.circle}>
            <img src={step1Icon} alt='' />
            <img src={step1WhiteIcon} alt='' />
          </div>
          <div className={classes.leftArrowImage}>
            <img src={stepsArrowLeftIcon} alt='' />
          </div>
          <div className={classes.bottomArrowImage}>
            <img src={stepsArrowBottomIcon} alt='' />
          </div>
          <span>ثبت نام</span>
        </li>
        <li>
          <div className={classes.circle}>
            <img src={step2Icon} alt='' />
            <img src={step2WhiteIcon} alt='' />
          </div>
          <div className={classes.leftArrowImage}>
            <img src={stepsArrowLeftIcon} alt='' />
          </div>
          <div className={classes.bottomArrowImage}>
            <img src={stepsArrowBottomIcon} alt='' />
          </div>
          <span>سفارش گذاری</span>
        </li>
        <li>
          <div className={classes.circle}>
            <img src={step3Icon} alt='' />
            <img src={step3WhiteIcon} alt='' />
          </div>
          <div className={classes.leftArrowImage}>
            <img src={stepsArrowLeftIcon} alt='' />
          </div>
          <div className={classes.bottomArrowImage}>
            <img src={stepsArrowBottomIcon} alt='' />
          </div>
          <span>پرداخت الکترونیک</span>
        </li>
        <li>
          <div className={classes.circle}>
            <img src={step4Icon} alt='' />
            <img src={step4WhiteIcon} alt='' />
          </div>
          <span>قراداد الکترونیک</span>
        </li>
      </ul>
    </div>
  );
};

export default Steps;
