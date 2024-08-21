import classes from "./Services.module.scss";
import securityIcon from "../../../assets/images/icons/security-services.svg";
import cupIcon from "../../../assets/images/icons/cup-services.svg";
import likeIcon from "../../../assets/images/icons/like-services.svg";
import supportIcon from "../../../assets/images/icons/support-services.svg";

const Services = () => {
  return (
    <section className={`${classes.servicesSection} container`}>
      <div className={classes.serviceItem}>
        <div className={classes.circle}>
          <img src={securityIcon} alt="security icon" />
        </div>
        <span>لورم ایپسوم</span>
      </div>
      <div className={classes.serviceItem}>
        <div className={classes.circle}>
          <img src={cupIcon} alt="security icon" />
        </div>
        <span>لورم ایپسوم</span>
      </div>
      <div className={classes.serviceItem}>
        <div className={classes.circle}>
          <img src={likeIcon} alt="security icon" />
        </div>
        <span>لورم ایپسوم</span>
      </div>
      <div className={classes.serviceItem}>
        <div className={classes.circle}>
          <img src={supportIcon} alt="security icon" />
        </div>
        <span>لورم ایپسوم</span>
      </div>
    </section>
  );
};

export default Services;
