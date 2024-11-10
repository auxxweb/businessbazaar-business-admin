const SubscribeSection = () => {
  return (
    <section className="h-auto david-font" id="contact">
      <div className="container p-top">
        <div className="col-12 newsletter position-relative">
          <img
            src="/src/assets/images/newsletter.png"
            alt=""
            className="w-100"
          />
          <div className="text-center newsletter-content position-absolute">
            <div className="d-none d-lg-block">
              <h2 className="fs-45 mb-3 fw-bold text-white">
                Create Your Own Business <br />
                Subscribing To Our Newsletter
              </h2>
              <div className="row bg-white align-items-center input-div p-2">
                <div className="col-lg-8">
                  <input
                    type="email"
                    style={{ border: "0 !important" }}
                    className="form-control form-control-lg"
                  />
                </div>
                <div className="col-lg-4">
                  <button className="btn theme btn-lg w-100">Subscribe</button>
                </div>
              </div>
            </div>

            <div className="d-block d-lg-none">
              <h2 className="fs-16 fw-bold text-white">
                Create Your Own Business <br />
                Subscribing To Our Newsletter
              </h2>
              <div className="row">
                <div className="col-12">
                  <input
                    type="email"
                    style={{ border: "0 !important" }}
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-12">
                  <button className="btn theme btn-sm mt-1 w-100">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
