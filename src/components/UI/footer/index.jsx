import clasess from './Footer.module.scss';
// import { Link } from 'react-router-dom';

import { Link } from 'react-router-dom';

import footerLogo from '../../../assets/logo.png';

const Footer = () => {
  return (
    <footer className={clasess.footer}>
      <div className={clasess.footerTop}>
        <div className='container'>
          <div className={clasess.footerTitle}>
            <h2>
              <img src={footerLogo} alt='' />
            </h2>
          </div>
          <div className={clasess.footerLinks}>
            <div>
              <h3>خدمات مشتریان</h3>
              <ul>
                <li>
                  <a
                    href='https://www.maxmotorco.com/%d8%af%d8%b1%d8%a8%d8%a7%d8%b1%d9%87-%d9%85%d8%a7/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    درباره ما
                  </a>
                </li>

                <li>
                  <a
                    href='https://www.maxmotorco.com/%d8%aa%d9%85%d8%a7%d8%b3-%d8%a8%d8%a7-%d9%85%d8%a7/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    تماس با ما
                  </a>

                  {/* <Link to='/contact-us'>تماس با ما</Link> */}
                </li>
              </ul>
            </div>
            <div>
              <h3>راهنمای مشتریان</h3>
              <ul>
                <li>
                  <a
                    href='https://www.maxmotorco.com/%d9%88%d8%b1%d9%88%d8%af-%d8%a8%d9%87-%d8%b3%d8%a7%d9%85%d8%a7%d9%86%d9%87-%d8%a7%d8%b1%d8%aa%d8%a8%d8%a7%d8%b7-%d8%a8%d8%a7-%d9%85%d8%b4%d8%aa%d8%b1%db%8c%d8%a7%d9%86/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    ارتباط با مشتریان
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3>لینک های مرتبط</h3>
              <ul>
                <li>
                  <a
                    href='https://www.maxmotorco.com'
                    rel='noreferrer'
                    target='_blank'
                  >
                    وب سایت گروه خودرو سازی شرکت
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.maxmotorco.com/%d8%ae%d8%af%d9%85%d8%a7%d8%aa-%d9%be%d8%b3-%d8%a7%d8%b2-%d9%81%d8%b1%d9%88%d8%b4-%d9%85%d8%a7'
                    rel='noreferrer'
                    target='_blank'
                  >
                    خدمات پس از فروش
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.maxmotorco.com/dealerships'
                    rel='noreferrer'
                    target='_blank'
                  >
                    نمایندگی ها
                  </a>
                </li>
                {/* <li>
                  <a href=''>ارتباط با درگاه های بانکی</a>
                </li> */}
              </ul>
            </div>
            <div>
              <h3>امور مشتریان</h3>
              <ul>
                <li>
                  <a href=''>
                    تماس با شماره ۱۶۶۰ و ۰۲۱۴۱۷۵۵۸۰۰ داخلی ۱ سپس داخلی ۵
                  </a>
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
