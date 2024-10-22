import classes from "./Brands.module.scss";

const BrandsList = ({ brands, selectedBrandId, setSelectedBrandId }) => {
  return (
    <ul className={classes.companiesLogoList}>
      {brands?.length > 0 ? (
        brands?.map((brand, index) => (
          <li
            className={
              selectedBrandId === "" && index === 0
                ? classes.selectedCompany
                : selectedBrandId === brand?.id
                ? classes.selectedCompany
                : null
            }
            key={brand?.id}
            onClick={() => {
              setSelectedBrandId(brand?.id);
            }}
          >
            <img
              src={`./dynamic-images/${brand?.attachments?.at(0)?.fileName}`}
              alt={brands?.title}
            />
          </li>
        ))
      ) : (
        <></>
      )}
    </ul>
  );
};

export default BrandsList;
