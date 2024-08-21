import classes from './Agencies.module.scss';

import Select, { components } from 'react-select';

import ageneciesIcon from '../../../assets/icons/ageincies-location-icon.svg';
import searchIcon from '../../../assets/icons/search-icon.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className='custom-css-class'>موردی وجود ندارد</span>
    </components.NoOptionsMessage>
  );
};
const Agencies = ({ agencies = [] }) => {
  const agenciesOptions = agencies?.map((agency) => ({
    value: agency.id,
    label: agency.name,
  }));

  const [agencyName, setAgencyName] = useState(null);

  return (
    <div className={classes.agencies}>
      <h2>نمایندگی های شرکت</h2>
      {/* select box */}
      <div className={classes.selectWrapper}>
        <img src={ageneciesIcon} alt='' className={classes.locationIcon} />
        <Select
          components={{ NoOptionsMessage }}
          options={agenciesOptions}
          placeholder='نام نمایندگی را وارد کنید'
          className={classes.select}
          onChange={async (option) => {
            setAgencyName(option.label);
          }}
          styles={{
            control: (base) => ({
              ...base,
              boxShadow: 'none',
            }),
          }}
        />
        <Link
          to={agencyName ? `/agencies?agencyName=${agencyName}` : `/agencies`}
          className={classes.search}
        >
          <img src={searchIcon} alt='' />
          <span> جست و جو</span>
        </Link>
      </div>
    </div>
  );
};

export default Agencies;
