import classes from './Modal.module.scss';

import closeIcon from '../../../assets/icons/close-modal-image.svg';

const Modal = ({
  children,
  setIsModalVisible,
  title,
  widthInnerModal = '560px',
}) => {
  const closeModalHandler = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={classes.modalContainer} onClick={closeModalHandler}>
      <section
        className={classes.modalInner}
        onClick={(e) => e.stopPropagation()}
        style={{ width: widthInnerModal }}
      >
        <header className={classes.header}>
          <img
            src={closeIcon}
            alt='icon'
            className={classes.headerClose}
            onClick={closeModalHandler}
          />

          <span className={classes.headerTitle}>{title}</span>
        </header>
        {children}
      </section>
    </div>
  );
};

export default Modal;
