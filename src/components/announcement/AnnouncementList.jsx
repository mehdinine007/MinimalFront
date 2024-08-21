import Announcement from "./Announcement";
import classes from "./AnnouncementList.module.scss";

const AnnouncementList = ({ announcements = [], showMoreHandler }) => {
  return (
    <div className={classes.announcementList}>
      {announcements.map((announcement) => (
        <Announcement
          showMoreHandler={showMoreHandler}
          announcement={announcement}
          key={announcement?.id}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
