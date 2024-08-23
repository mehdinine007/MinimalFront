import classes from './AgenciesList.module.scss';

import agencyAfterSaleIcon from '../../../assets/agency-after-sale.svg';
import agencySaleIcon from '../../../assets/agency-sale.svg';
import agencyLocationIcon from '../../../assets/agency-location.svg';
import agencyCallIcon from '../../../assets/agency-call.svg';

import orangeLocationIcon from '../../../assets/icons/orange-location.svg';

const AgenciesList = ({ agencies = [] }) => {
  return (
    <ul className={classes.agenciesList}>
      {agencies.map((agency) => (
        <li key={agency.id} className={classes.agencyItem}>
          <div className={classes.agencyImage}>
            <figure>
              <img
                src={`../../dynamic-images/${
                  agency?.attachments?.at(0)?.fileName
                }`}
                alt=''
              />
            </figure>
          </div>
          <div className={classes.agencyContent}>
            <div className={classes.title}>
              <img src={orangeLocationIcon} alt='' />
              <h2>
                <span>{agency?.provinceTitle}</span>
                {agency?.cityTitle && <small>({agency?.cityTitle})</small>}
              </h2>
            </div>
            <div className={classes.agencyInfoRow}>
              <h3>{agency?.name}</h3>
              <p>
                <span>کد </span>
                <span>{agency?.code}</span>
              </p>
              <p>
                <img
                  src={
                    agency?.agencyType === 1
                      ? agencySaleIcon
                      : agencyAfterSaleIcon
                  }
                  alt=''
                />
                <span>{agency?.agencyTypeTitle}</span>
              </p>
            </div>
            <div className={classes.agencyInfoRow}>
              <h3>اطلاعات تماس</h3>
              <p>
                <img src={agencyLocationIcon} alt='' />
                <span>{agency?.address}</span>
              </p>
              <p>
                <img src={agencyCallIcon} alt='' />

                <span>{agency?.phoneNumber}</span>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AgenciesList;
