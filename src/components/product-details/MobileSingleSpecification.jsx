import classes from './MobileSingleSpecification.module.scss';
import arrowUpIcon from '../../assets/images/icons/arrow-up-specification.svg';
import arrowDownIcon from '../../assets/images/icons/arrow-down-specification.svg';
import { useState } from 'react';

const MobileSingleSpecification = ({ singleFeature }) => {
  const [showDetails, setShowDetails] = useState(true);
  return (
    <>
      <div
        className={classes.title}
        onClick={() => {
          setShowDetails(!showDetails);
        }}
      >
        <span>{singleFeature?.title}</span>
        <img src={showDetails ? arrowUpIcon : arrowDownIcon} alt='' />
        {showDetails && <div className={classes.orangeLine}></div>}
      </div>

      {showDetails && (
        <ul className={classes.features}>
          {singleFeature?.properties?.map((item) => (
            <li key={item?.key}>
              <span className={classes.featureTitle}>{item?.title}</span>
              <span className={classes.featureDetail}>
                {item?.value === 'True'
                  ? 'دارد'
                  : item?.value === 'False'
                  ? 'ندارد'
                  : item?.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MobileSingleSpecification;
