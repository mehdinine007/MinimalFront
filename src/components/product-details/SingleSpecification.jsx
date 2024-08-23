import classes from './SingleSpecification.module.scss';
// import arrowUpIcon from '../../assets/images/icons/arrow-up-specification.svg';
// import arrowDownIcon from '../../assets/images/icons/arrow-down-specification.svg';
// import { useState } from 'react';

const SingleSpecification = ({ singleFeature, selected }) => {
  // const [showDetails, setShowDetails] = useState(true);

  return (
    <>
      {selected?.id === singleFeature?.id && (
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

export default SingleSpecification;
