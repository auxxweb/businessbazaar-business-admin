/* eslint-disable react/prop-types */
const TemplateFooter = ({ businessData, closeDays }) => {
  return (
    <footer className="h-auto">
      <div className="container pjs  p-top">
        <div className="mt-1">
          <div className="row">
            <div className="col-12 col-lg-3">
              <div className="col-12 d-block d-lg-flex text-center text-lg-start text mt-5">
                <div className="nav-logo width-fit">
                  <img src={businessData?.logo} alt="" />
                </div>
                <span className="ms-2 fs-30 text-white">
                  {businessData?.businessName}
                </span>
              </div>
              <div
                className="col-12 mt-4  text-center text-lg-start"
                style={{ color: "#A4B3CB" }}
              >
                <p>{businessData?.description}</p>
              </div>
            </div>

            <div className="col-12 col-lg-2">
              <div className="col-12 mt-5">
                <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                  <a
                    href="#"
                    className=" fs-14 text-decoration-none text-orange"
                  >
                    NAVIGATION
                  </a>
                </div>
                <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                  <a
                    href="#"
                    className="fs-14 text-decoration-none"
                    style={{ color: "#A4B3CB" }}
                  >
                    Menu
                  </a>
                </div>
                <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                  <a
                    href="#"
                    className="fs-14 text-decoration-none"
                    style={{ color: "#A4B3CB" }}
                  >
                    About Us
                  </a>
                </div>
                <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                  <a
                    href="#"
                    className="fs-14 text-decoration-none"
                    style={{ color: "#A4B3CB" }}
                  >
                    Contact Us
                  </a>
                </div>
                <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                  <a
                    href="#"
                    className="fs-14 text-decoration-none"
                    style={{ color: "#A4B3CB" }}
                  >
                    Main Dishes
                  </a>
                </div>
              </div>
            </div>

            <div className="col-4">
              <div className="row mt-5">
                <div className="col-lg-6">
                  <div className="col-12">
                    <div className="col-12 mb-3 text-center text-lg-start">
                      <a
                        href="#"
                        className=" fs-14 text-decoration-none text-orange"
                      >
                        OPENING HOURS
                      </a>
                    </div>
                    <div
                      className="mt-3 text-center text-lg-start"
                      style={{ color: "#A4B3CB" }}
                    >
                      {businessData?.businessTiming?.workingDays?.map(
                        (day, index) => (
                          <p key={index}>{day}</p>
                        )
                      )}
                    </div>
                    <div
                      className="mt-3 text-center text-lg-start"
                      style={{ color: "#A4B3CB" }}
                    >
                      <span>8:00 am to 9:00 pm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="col-12 mt-5">
                <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                  <a
                    href="#"
                    className=" fs-14 text-decoration-none text-orange"
                  >
                    FOLLOW US
                  </a>
                </div>

                <div className="mt-5 col-12 row gap-3 jcc-md text-center text-lg-start">
                  <a
                    href={
                      businessData?.socialMediaLinks?.length &&
                      businessData?.socialMediaLinks[0]?.link
                    }
                    className="contact-banner text-orange text-center text-lg-start"
                  >
                    <i className="bi bi-facebook text-orange"></i>
                  </a>
                  <a
                    href={
                      businessData?.socialMediaLinks?.length &&
                      businessData?.socialMediaLinks[1]?.link
                    }
                    className="contact-banner text-center text-lg-start"
                  >
                    <i className="bi bi-instagram text-orange"></i>
                  </a>
                  <a
                    href={
                      businessData?.socialMediaLinks?.length &&
                      businessData?.socialMediaLinks[2]?.link
                    }
                    className="contact-banner text-center text-lg-start"
                  >
                    <i className="bi bi-twitter text-orange"></i>
                  </a>
                  {/* <hr style={{width:"fit-content",opacity: 0.15,}}></hr> */}
                </div>
              </div>
            </div>
            <div className="col-12">
              <hr style={{ width: "100%", opacity: 0.25, color: "white" }} />
              <div class="footer-bottom">
                <div class="row w-full justify-content-between">
                  <div class="col-sm-4 text-left">
                    <a href={`/terms-and-conditions/${businessData?._id}`}>Terms and Conditions</a>
                  </div>
                  <div class="col-sm-4 text-right">
                    <div style={{ color: "#A4B3CB" }} class="text-right">
                      <span>
                        Copyright &copy;
                        {new Date().getFullYear()} In Connect. All Rights
                        Reserved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TemplateFooter;
