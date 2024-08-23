import classes from './MobileSpecifications.module.scss';
import sortByPriority from '../../helpers/sortByPriority';
import MobileSingleSpecification from './MobileSingleSpecification';

const MobileSpecifications = ({ features }) => {
  const featuresSorted = features?.sort(sortByPriority);
  return (
    <div className={`${classes.specificationwWrapper} container`}>
      {featuresSorted?.map(
        (item) =>
          item?.display && (
            <MobileSingleSpecification key={item.id} singleFeature={item} />
          )
      )}
    </div>
  );
};

export default MobileSpecifications;
