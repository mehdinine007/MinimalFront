import MainLayout from '../../components/layout/MainLayout';
import classes from './Agencies.module.scss';
import { useContext, useEffect, useState } from 'react';
import searchIcon from '../../assets/icons/search-icon-orange.svg';
import AgenciesList from '../../components/agencies/agencies-list';
import authContext from '../../context/auth/authContext';
import Select, { components } from 'react-select';
import { useSearchParams } from 'react-router-dom';

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <span className='custom-css-class'>موردی وجود ندارد</span>
    </components.NoOptionsMessage>
  );
};

const agencyTypesOptions = [
  { label: 'همه', value: 0 },
  { label: 'فروش', value: 1 },
  { label: 'خدمات پس از فروش', value: 2 },
];

const Agencies = () => {
  const { getAgencies, agencies, getProvinces, provinces } =
    useContext(authContext);
  const [searchParams] = useSearchParams();
  const agencyName = searchParams.get('agencyName');
  const [search, setSearch] = useState(() => (agencyName ? agencyName : ''));
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedTypeOfAgency, setSelectedTypeOfAgency] = useState(null);
  useEffect(() => {
    window?.scrollTo(0, 0);
    getAgencies();
    getProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let filteredAgencies = agencies;
  if (search.trim()) {
    filteredAgencies = agencies.filter((agency) =>
      agency.name.includes(search.trim())
    );
  }
  if (selectedProvince) {
    filteredAgencies = filteredAgencies.filter(
      (agency) => agency?.provinceId === selectedProvince?.value
    );
  }
  if (selectedTypeOfAgency) {
    filteredAgencies = filteredAgencies.filter(
      (agency) => agency?.agencyType === selectedTypeOfAgency?.value
    );
  }

  const provincesOptions = provinces?.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  provincesOptions?.unshift({ value: 0, label: 'همه' });

  return (
    <MainLayout>
      <div className={classes.agencyTop}>
        <div className='container'>
          <h1 className={classes.title}> نمایندگی ها</h1>

          <div className={classes.filters}>
            <div className={classes.searchBox}>
              <img src={searchIcon} alt='' />
              <input
                type='search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='جستجو بر اساس نام نمایندگی'
              />
            </div>
            <Select
              components={{ NoOptionsMessage }}
              options={provincesOptions}
              placeholder='استان را انتخاب کنید'
              defaultValue={provincesOptions?.at(0)}
              className={classes.select}
              onChange={async (option) => {
                if (option.value === 0) {
                  setSelectedProvince(null);
                } else {
                  setSelectedProvince(option);
                }
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  boxShadow: 'none',
                }),
              }}
            />
            <Select
              components={{ NoOptionsMessage }}
              options={agencyTypesOptions}
              placeholder='نوع نمایندگی را انتخاب کنید'
              className={classes.select}
              defaultValue={agencyTypesOptions?.at(0)}
              onChange={async (option) => {
                if (option.value === 0) {
                  setSelectedTypeOfAgency(null);
                } else {
                  setSelectedTypeOfAgency(option);
                }
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  boxShadow: 'none',
                }),
              }}
              isSearchable={false}
            />
          </div>
        </div>
      </div>
      <div className={`${'container'} ${classes.mainWrapper}`}>
        <AgenciesList agencies={filteredAgencies} />
      </div>
    </MainLayout>
  );
};

export default Agencies;
