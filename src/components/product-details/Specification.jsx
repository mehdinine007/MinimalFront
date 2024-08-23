import classes from './Specification.module.scss';
import SingleSpecification from './SingleSpecification';
import sortByPriority from '../../helpers/sortByPriority';
import { useState } from 'react';

const Specification = ({ features }) => {
  const [selected, setSelected] = useState(() =>
    features?.find((feature) => feature?.display)
  );

  // const detailsRef = useRef();

  const featuresSorted = features?.sort(sortByPriority);

  return (
    <div className={`${classes.detailsWrapper} container`}>
      <div className={classes.titles}>
        <div className={classes.titlesInner}></div>
        {featuresSorted?.map(
          (item) =>
            item?.display && (
              <h3
                key={item?.id}
                className={item?.id === selected?.id ? classes.selected : null}
                onClick={() => {
                  setSelected(item);
                  // window.scrollTo(0, detailsRef.current.offsetTop);
                }}
              >
                {item?.title}
              </h3>
            )
        )}
      </div>
      <div className={classes.specificationwWrapper}>
        {featuresSorted?.map(
          (item) =>
            item?.display && (
              <SingleSpecification
                key={item?.id}
                singleFeature={item}
                selected={selected}
              />
            )
        )}
      </div>
    </div>
  );
};

export default Specification;
