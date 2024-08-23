import { useState } from 'react';
import classes from './Gallery.module.scss';

// import arrowLeft from '../../assets/images/icons/arrow-left-product-details.svg';
import imagePreviewIcon from '../../assets/icons/image-preview.svg';
import closeModalImageIcon from '../../assets/icons/close-modal-image.svg';

const Gallery = ({ galleryImages, initialMainImage }) => {
  const [currentImage, setCurrentImage] = useState(initialMainImage);
  const [modal, setModal] = useState(null);
  return (
    <div className='container'>
      {modal && (
        <div className={classes.modal} onClick={() => setModal(null)}>
          <div className={classes.modalInner}>
            <img
              src={closeModalImageIcon}
              className={classes.closeModal}
              onClick={() => setModal(null)}
              alt=''
            />
            <img
              onClick={(e) => e.stopPropagation()}
              className={classes.modalImage}
              src={`../../../dynamic-images/${currentImage?.fileName}`}
              alt=''
            />
          </div>
        </div>
      )}
      <div className={`${classes.galleryWrapper}`}>
        <ul>
          {galleryImages?.map((item) => (
            <li
              key={item?.id}
              className={item.id === currentImage.id ? classes.active : ''}
              onClick={() => setCurrentImage(item)}
            >
              <img
                className={classes.img}
                src={`../../../dynamic-images/${item?.fileName}`}
                alt={item.description}
              />
            </li>
          ))}
        </ul>
        <div className={classes.mainImage}>
          <div className={classes.mainImageInner}>
            <img
              className={classes.main}
              src={`../../../dynamic-images/${currentImage?.fileName}`}
              alt=''
            />
            <img
              className={classes.preview}
              onClick={() => setModal(currentImage)}
              src={imagePreviewIcon}
              alt=''
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
