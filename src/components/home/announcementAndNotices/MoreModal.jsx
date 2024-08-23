import classes from './MoreModal.module.scss';

import closeIcon from '../../../assets/icons/close-more.svg';

import decodeBase64 from '../../../helpers/decodeBase64';

const MoreModal = ({ modalContent, setModalContent }) => {
  const content = decodeBase64(modalContent?.description);
  return (
    <div className={classes.modal} onClick={() => setModalContent(null)}>
      <div
        className={classes.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.close} onClick={() => setModalContent(null)}>
          <img src={closeIcon} alt='' />
        </div>
        <div className={classes.content}>
          <h2>{modalContent?.title}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MoreModal;
