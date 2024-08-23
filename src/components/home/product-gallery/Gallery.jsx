import classes from './Gallery.module.scss';
const Gallery = ({ galleries }) => {
  return (
    <div className={classes.galleryWrapper}>
      <h2>گالری تصاویر</h2>
      <div className={classes.gallery}>
        <div>
          <img
            src={`../../../../dynamic-images/${galleries?.at(0)?.fileName}`}
            alt=''
          />
        </div>
        <div>
          <img
            src={`../../../../dynamic-images/${galleries?.at(1)?.fileName}`}
            alt=''
          />
          <img
            src={`../../../../dynamic-images/${galleries?.at(2)?.fileName}`}
            alt=''
          />
        </div>{' '}
        <div>
          <img
            src={`../../../../dynamic-images/${galleries?.at(3)?.fileName}`}
            alt=''
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
