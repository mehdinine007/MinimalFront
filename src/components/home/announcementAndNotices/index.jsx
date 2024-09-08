import { useState } from "react";
import { Link } from "react-router-dom";
// import moment from 'jalali-moment';
import b64DecodeUnicode from "../../../helpers/decodeBase64";
import classes from "./AnnouncementAndNotices.module.scss";

import announcementImage from "../../../assets/announcement-car1.png";
import MoreModal from "./MoreModal";

const AnnouncementAndNotices = ({ announcement }) => {
  const currentAnnouncment = announcement?.carouselData?.at(0);
  console.log(currentAnnouncment);
  const [modalContent, setModalContent] = useState(null);

  return (
    <div className={classes.wrapper}>
      {/* image */}
      {modalContent && (
        <MoreModal
          modalContent={modalContent}
          setModalContent={setModalContent}
        />
      )}
      <div className={classes.image}>
        <img
          src={
            "../../dynamic-images/" +
            currentAnnouncment?.attachments[0]?.fileName
          }
          alt=""
        />
      </div>
      {/* current plans */}
      <div className={classes.currentPlans}>
        <h2>
          {currentAnnouncment?.title}
          <span>شماره اطلاعیه...</span>
        </h2>
        <div
          className={classes.description}
          dangerouslySetInnerHTML={{
            __html:
              b64DecodeUnicode(currentAnnouncment?.content).length >= 750
                ? b64DecodeUnicode(currentAnnouncment?.content).substring(
                    0,
                    250
                  ) + "..."
                : b64DecodeUnicode(currentAnnouncment?.content),
          }}
        ></div>

        <div className={classes.actions}>
          <div
            className={classes.more}
            onClick={() => setModalContent(currentAnnouncment)}
          >
            مشاهده بیشتر
          </div>
          <Link to={"./announcement"}>مشاهده کامل اطلاعیه ها</Link>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementAndNotices;
