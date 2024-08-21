import classes from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.ldsHourglass}></div>
    </div>
  );
};

export default Loader;
