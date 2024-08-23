import moment from 'jalali-moment';
import classes from './Announcement.module.scss';
import b64DecodeUnicode from '../../helpers/decodeBase64';

const Announcement = ({ announcement, showMoreHandler }) => {
  return (
    <div className={classes.announcementCart}>
      <div className={classes.announcementImage}>
        <img
          src={`../../dynamic-images/${
            announcement?.attachments?.find((item) => item.device === 0)
              ?.fileName
          }`}
          alt={`تصویر ${announcement?.title}`}
        />
      </div>
      <div className={classes.announcementContentWrapper}>
        <div className={classes.announcementHeader}>
          <span className={classes.title}>{announcement?.title}</span>
          <time className='faNum'>
            تاریخ اطلاعیه :{' '}
            {moment(announcement?.date)
              .locale('fa')
              .format('jDD / jMM / jYYYY')}
          </time>
        </div>
        <div
          className={classes.announcementBody}
          dangerouslySetInnerHTML={{
            __html:
              b64DecodeUnicode(announcement?.content).length < 220
                ? b64DecodeUnicode(announcement?.content)
                : b64DecodeUnicode(announcement?.content) + '...',
          }}
        ></div>
        <button
          onClick={() => {
            showMoreHandler(announcement?.id);
          }}
        >
          مشاهده کامل اطلاعیه
        </button>
      </div>
    </div>
  );
};

export default Announcement;
