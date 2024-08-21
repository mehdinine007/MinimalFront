import clasess from './Footer.module.scss';
// import { Link } from 'react-router-dom';

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={clasess.footer}>
      <div className={clasess.footerTop}>
        <div className='container'>
          <div className={clasess.footerTitle}>
            <h2>LOGO</h2>
          </div>
          <div className={clasess.footerLinks}>
            <div>
              <h3>خدمات مشتریان</h3>
              <ul>
                <li>
                  <a href=''>قوانین و مقررات</a>
                </li>
                <li>
                  <a href=''>سوالات متداول</a>
                </li>
                <li>
                  <Link to='/contact-us'>تماس با پشتیبانی</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>راهنمای مشتریان</h3>
              <ul>
                <li>
                  <a href=''>راهنمای خرید اینترنتی</a>
                </li>
              </ul>
            </div>
            <div>
              <h3>لینک های مرتبط</h3>
              <ul>
                <li>
                  <a href=''>وب سایت گروه خودرو سازی شرکت</a>
                </li>
                <li>
                  <a href=''>ارتباط با درگاه های بانکی</a>
                </li>
              </ul>
            </div>
            <div>
              <h3>پشتیبانی مشتریان</h3>
              <ul>
                <li>
                  <a href=''>پشتیبانی وب سایت: 000000-021</a>
                </li>
                <li>
                  <a href=''>واحد ارتباط با مشتریان شرکت:00000 </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={clasess.footerBottom}>
        تمام حقوق این وب سایت برای شرکت ...... است
      </div>
    </footer>
  );
};

export default Footer;
