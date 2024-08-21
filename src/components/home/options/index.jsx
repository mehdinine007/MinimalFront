import classes from './Options.module.scss';

import option1 from '../../../assets/option1.svg';
import option2 from '../../../assets/option2.svg';
import option3 from '../../../assets/option3.svg';

const Options = () => {
  return (
    <div className={classes.options}>
      <ul className={classes.optionsInner}>
        <li>
          <img src={option1} alt='' />
        </li>
        <li>
          <img src={option2} alt='' />
        </li>
        <li>
          <img src={option3} alt='' />
        </li>
      </ul>
    </div>
  );
};

export default Options;
