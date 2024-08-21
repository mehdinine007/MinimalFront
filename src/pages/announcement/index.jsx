import classes from './Announcement.module.scss';
import MainLayout from '../../components/layout/MainLayout';
import { useContext, useEffect, useState } from 'react';
import authContext from '../../context/auth/authContext';
import Spinner from '../../components/UI/spinner/index';
import AnnouncementList from '../../components/announcement/AnnouncementList';

import MoreModal from '../../components/home/AnnouncementAndNotices/MoreModal';

const Announcement = () => {
  const { announcements, getAnnouncements, loadingAnnouncements } =
    useContext(authContext);

  useEffect(() => {
    getAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [modalContent, setModalContent] = useState(null);

  const showMoreHandler = (announcementId) => {
    setModalContent(announcements?.find((item) => item?.id === announcementId));
  };

  return (
    <>
      {modalContent && (
        <MoreModal
          modalContent={modalContent}
          setModalContent={setModalContent}
        />
      )}
      <MainLayout>
        <div className={`container ${classes.announcementWrapper}`}>
          <div className={classes.title}>
            <h2>اطلاعیه ها</h2>
          </div>
          {loadingAnnouncements ? (
            <Spinner />
          ) : (
            <AnnouncementList
              showMoreHandler={showMoreHandler}
              announcements={announcements}
            />
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default Announcement;
