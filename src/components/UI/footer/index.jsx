import clasess from "./Footer.module.scss";
// import footerLogo from "../../../../public/dynamic-images/logo.png";

const Footer = (objFooter) => {
  return (
    <footer className={clasess.footer}>
      <div className={clasess.footerTop}>
        <div className="container">
          <div className={clasess.footerTitle}>
            <h2>
              <img className={clasess.footerLogo} src="../../../../dynamic-images/logo.png" alt="" />
            </h2>
          </div>
          <div className={clasess.footerLinks}>
            <section>
              <h2>{objFooter?.footerData?.footerTitle}</h2>
              <p  dangerouslySetInnerHTML={{
              __html: objFooter?.footerData?.footerBody,
            }}>
              </p>
              <p  dangerouslySetInnerHTML={{
              __html: objFooter?.footerData?.footerAddress,
            }}>
              </p>
            </section>
            {/* <div>
              <h3>خدمات مشتریان</h3>
              <ul>
                <li>
                  <a
                    href="https://imanmehrsperlous.ir/%d8%a7%d8%b1%d8%aa%d8%a8%d8%a7%d8%b7-%d8%a8%d8%a7-%d9%85%d8%a7/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    درباره ما
                  </a>
                </li>

                <li>
                  <a
                    href="https://imanmehrsperlous.ir/%d8%a7%d8%b1%d8%aa%d8%a8%d8%a7%d8%b7-%d8%a8%d8%a7-%d9%85%d8%a7/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    تماس با ما
                  </a>

                  <Link to="/contact-us">تماس با ما</Link>
                </li>
              </ul>
            </div> */}
            {/* <div>
              <h3>راهنمای مشتریان</h3>
              <ul>
                <li>
                  <a
                    href="https://imanmehrsperlous.ir/%d8%a7%d8%b1%d8%aa%d8%a8%d8%a7%d8%b7-%d8%a8%d8%a7-%d9%85%d8%a7/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    ارتباط با مشتریان
                  </a>
                </li>
                <li>
                  <a
                    href="https://imanmehrsperlous.ir/%da%af%d8%a7%d8%b1%d8%a7%d9%86%d8%aa%db%8c/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    خدمات پس از فروش
                  </a>
                </li>
              </ul>
            </div> */}

            <div>
              <h3>ارتباط با ما</h3>
              <ul>
                <li  dangerouslySetInnerHTML={{
              __html: objFooter?.footerData?.contactUsTitle,
            }}>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li  dangerouslySetInnerHTML={{
              __html: objFooter?.footerData?.enamadHtml,
            }}>
              

                  {/* <a
                    referrerPolicy="origin"
                    target="_blank"
                    href="https://trustseal.enamad.ir/?id=524487&Code=6aAcHfWAzF2MTbCLKDOzPmMopP2RNGmd"
                  >
                    <img
                      style={{ width: "100px" }}
                      referrerPolicy="origin"
                      src="https://trustseal.enamad.ir/logo.aspx?id=524487&Code=6aAcHfWAzF2MTbCLKDOzPmMopP2RNGmd"
                      alt=""
                      code="6aAcHfWAzF2MTbCLKDOzPmMopP2RNGmd"
                    />
                  </a> */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={clasess.footerBottom}>
        تمام حقوق این وب سایت برای شرکت ایمان مهر اسپرلوس است
      </div>
    </footer>
  );
};

export default Footer;
