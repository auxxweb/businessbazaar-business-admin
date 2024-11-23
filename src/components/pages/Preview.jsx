import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavLink } from "react-bootstrap";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import useBusiness from "../../Hooks/useBusiness";
import ContactForm from "../preview/common/contactForm";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import '../../assets/css/template.css';
import FullPageLoader from "../FullPageLoader/FullPageLoader";

export default function Preview() {
  const { businessData, colorTheme, closeDays, loading, isPremium } =
    useBusiness();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState([
    {
      rating: "",
      name: "",
      description: "",
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isPremium) {
      navigate("/preview/premium", { replace: true });
    }
  }, [isPremium]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    arrows: false,
    // centerMode: true,
    speed: 500,
    slidesToShow: 2, // Number of dishes to show
    // mobileFirst: true,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const setting2 = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    // centerMode: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settings3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    // centerMode: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const gallery = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="h-100vh text-center ">
        <div className="row h-100 justify-content-center align-items-center">
          <FullPageLoader/>
        </div>
      </div>
    );
  }

  // If there's no business data (e.g., fetch failed), show an error message
  if (!businessData) {
    return <div>Error loading business data.</div>;
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <style>
        {" "}
        {`
                      ::-webkit-scrollbar {
                            width: 12px; /* Width of the entire scrollbar */
                        }
    
                        /* Scrollbar track */
                        ::-webkit-scrollbar-track {
                            background: rgb(243, 243, 244); /* Background of the scrollbar track */
                        }::-webkit-scrollbar-thumb {
                            background-color: ${colorTheme}; /* Color of the scrollbar thumb */
                            border-radius: 10px;     /* Rounded edges of the thumb */
                            border: 3px solid  ${colorTheme}; /* Padding around the thumb */
                        }
                    .theme
                    {
                        background-color: ${colorTheme};
                        color: white;
                        border: none;
                    }.service-design.active{
                        background-color: ${colorTheme};
                    }.address-section{
                    background-color:${colorTheme};
                    }.address-logo i{
                    color: ${colorTheme};
                    }.cat-option{
                        border-right: 1px dashed ${colorTheme};
                    }.text-orange{
                            color: ${colorTheme};
                        }.dish-div:hover{
                            background-color: ${colorTheme};
                            color:white;
                        }.product-section{
                        padding:20px;
                        border:1px solid ${colorTheme};
                        border-radius:16px;
                            }.slick-dots .slick-active button{
                                background-color: ${colorTheme};
                                border-radius: 16px;
                            }
                        `}
      </style>
      <Navbar
        expand="lg"
        className="bg-white pjs fixed-top"
        style={{ paddingBlock: "5px" }}
      >
        <Box ml={2}>
          <IconButton aria-label="delete" size="small" onClick={()=> navigate("/")}>
            <ArrowBackIosIcon fontSize="inherit" /> back
          </IconButton>
        </Box>
        <Container>
          {/* Align Brand to the start (left side) */}
          <Navbar.Brand
            href="#"
            className="fw-bold w-50 nav-logo d-flex"
            style={{ fontSize: "36px" }}
          >
            <img src={businessData?.logo} alt="" />
            <span className="ms-2">{businessData?.businessName}</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ color: "black" }}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto w-100 justify-content-evenly jcc">
              <NavLink
                href="#"
                className="text-black text-center text-lg-start  text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                Home
              </NavLink>
              <NavLink
                href="#about"
                className="text-black text-center text-lg-start  text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                About
              </NavLink>
              <NavLink
                href="#gallery"
                className="text-black text-center text-lg-start  text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                Gallery
              </NavLink>
              <NavLink
                href="#contact"
                className="text-black text-center text-lg-start  text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                Contact
              </NavLink>
              <NavLink
                to="/create-business"
                style={{
                  backgroundColor: colorTheme,
                  color: "white",
                  borderRadius: "10px 0px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
                }}
                className="fw-bold text-decoration-none text-center text-lg-start"
              >
                Services
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <section className="h-auto mt-[100px]">
        <div className="container p-top mt-5">
          <div className="row align-items-center banner-section">
            {/* Left Image for Mobile View */}
            <div className="col-12 col-lg-6 text-end d-block d-lg-none">
              <img
                src={businessData?.landingPageHero?.coverImage}
                alt=""
                className="banner-image"
              />
              <div className="banner-image-2 d-none">
                <img src="/src/assets/images/baner-image2.png" alt="" />
              </div>
            </div>

            {/* Text Content */}
            <div className="col-12 col-lg-6">
              <div className="row align-items-center">
                <div className="col-12">
                  <h1 className="text-start text-dark fw-bold david-font fw-bold banner-title text-center text-lg-start">
                    {businessData?.landingPageHero?.title}
                  </h1>
                </div>
                <div className="col-12">
                  <p className="text-secondary text-center text-lg-start david-font">
                    {businessData?.landingPageHero?.description}
                  </p>
                </div>
                <div className="mt-3 col-12">
                  <div className="row">
                    <div className="col-6 col-lg-3 mb-2">
                      <NavLink
                        to="#about"
                        className="btn btn-dark text-white radius-theme box-shadow w-100 p-1"
                        style={{ backgroundColor: "#212529" }}
                      >
                        View More
                      </NavLink>
                    </div>
                    <div className="col-6 col-lg-3 mb-2">
                      <NavLink
                        to="#service"
                        className="btn btn-dark text-white radius-theme box-shadow theme w-100 p-1"
                      >
                        Services
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="mt-5 col-12 social-media gap-3">
                  <a
                    href={
                      businessData?.socialMediaLinks?.length &&
                      businessData?.socialMediaLinks[0]?.link
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="contact-banner text-dark"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href={
                      businessData?.socialMediaLinks?.length &&
                      businessData?.socialMediaLinks[1]?.link
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="contact-banner text-dark"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    href={
                      businessData?.socialMediaLinks?.length &&
                      businessData?.socialMediaLinks[2]?.link
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="contact-banner text-dark"
                  >
                    <i className="bi bi-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Image for Desktop View */}
            <div className="col-12 col-lg-6 text-end d-none d-lg-block">
              <img
                src={businessData?.landingPageHero?.coverImage}
                alt=""
                className="banner-image"
              />
              <div className="banner-image-2 d-none">
                <img src="/src/assets/images/baner-image2.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 mb-5">
        <div className="container p-top">
          <div className="col-12 address-section">
            <div className="row justify-content-between">
              <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                <div className="row align-items-center justify-content-start">
                  <div className="col-auto address-logo">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="col">
                    <span className="fs-13">Address</span>
                    <p className="fs-16">
                      {businessData?.address?.buildingName},{" "}
                      {businessData?.address?.city},
                      {businessData?.address?.landMark},
                      {businessData?.address?.streetName},{" "}
                      {businessData?.address?.state}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                <div className="row align-items-center justify-content-start">
                  <div className="col-auto address-logo">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className="col">
                    <span className="fs-13">Send Email</span>
                    <p className="fs-16">
                      {businessData?.contactDetails?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                <div className="row align-items-center justify-content-start">
                  <div className="col-auto address-logo">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div className="col">
                    <span className="fs-13">Contact</span>
                    <p className="fs-16 mb-0">
                      {businessData?.contactDetails?.primaryNumber}
                    </p>
                    <p className="fs-16 mt-0">
                      {businessData?.contactDetails?.secondaryNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        className=" h-auto"
        style={{ backgroundColor: "#F3F3F4" }}
        id="about"
      >
        <div className="container p-top">
          <div className="row mt-5 align-items-center mb-5">
            <div className="col-12 col-lg-6 mt-2 text-center text-lg-start about-image">
              <img
                src={businessData?.welcomePart?.coverImage}
                className="img-fluid about-image"
                alt=""
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="col-12 mb-3">
                <h1 className="text-center text-lg-start text-dark fw-bold david-font fw-bold banner-title">
                  {businessData?.welcomePart?.title}
                </h1>
              </div>
              <div className="col-12 mt-4">
                <p className="text-secondary text-center text-lg-start david-font mt-4">
                  {businessData?.welcomePart?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-auto" style={{ backgroundColor: "#F3F3F4" }}>
        <div className="container p-top">
          <div className="col-12 mb-5">
            <div className="mt-5 text-center">
              <div className="col-12">
                <h1 className="text-center text-dark fw-bold david-font fw-bold banner-title fs-45">
                  {businessData?.specialServices?.title}
                </h1>
              </div>
              <div className="row justify-content-center">
                <div className="col-12 col-lg-6 ">
                  <p className="text-secondary text-center mb-2">
                    {businessData?.specialServices?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="col-12 mb-5 david-font row justify-content-center gap-3">
              {businessData?.specialServices?.data.length > 2 ? (
                <Slider {...settings}>
                  {businessData?.specialServices?.data.map((dish, index) => (
                    <div
                      key={index}
                      className="dish-div col-12 text-center p-3"
                    >
                      <div className="col-12 position-relative text-center">
                        <img
                          src={dish.image}
                          alt={dish.title}
                          style={{
                            width: "300px",
                            height: "300px",
                            objectFit: "cover",
                            marginInline:"auto",
                          }}
                            className="mb-3"
                        />
                      </div>
                      <div className="col-12">
                        <h2 className="fs-20 fw-bold">{dish.title}</h2>
                      </div>
                      <div className="col-12 mt-3 mb-3">
                        <p>{dish.description}</p>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                businessData?.specialServices?.data.map((dish, index) => (
                  <div
                    key={index}
                    className="dish-div col-12 col-lg-6 text-center p-3"
                  >
                    <div className="col-12 position-relative">
                      <img
                        src={dish.image}
                        alt={dish.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          maxWidth: "300px",
                          objectFit: "cover",
                          marginInline:"auto",
                        }}
                        className="mb-3"
                      />
                    </div>
                    <div className="col-12">
                      <h2 className="fs-20 fw-bold">{dish.title}</h2>
                    </div>
                    <div className="col-12 mt-3 mb-3">
                      <p>{dish.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white h-auto david-font" id="menu">
        <div className="container  p-top">
          <div className="col-12 mb-5">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 text-center">
                <h1 className="text-dark fw-bold david-font banner-title fs-45">
                  Menu
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-5 david-font">
            <div className="mb-5">
              <div className="row mb-3">
                {businessData?.productSection?.map((item, index) => (
                  <div
                    className="col-12 col-lg-6 mt-3 "
                    style={{ padding: "0 30px" }}
                    key={index}
                  >
                    <div className="row  product-section align-items-center">
                      <div className="col-2">
                        <img src={item.image} alt="" className="w-100" />
                      </div>
                      <div className="col-8">
                        <h1 className="fs-20 fw-bold">{item.title}</h1>
                        <p className="mt-2">{item.description}</p>
                      </div>
                      <div className="col-2 p-0">
                        <span className="fw-bold">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="h-auto david-font"
        style={{ backgroundColor: "#F3F3F4" }}
      >
        <div className="container p-top">
          <div className="col-12 mt-5 text-center text-lg-start">
            <h1 className="fw-bold text-center">Services We Provide</h1>
          </div>
          <div className="col-12 row justify-content-center mb-5">
          {businessData?.service?.length > 3 ? (
                <Slider {...setting2} className="mb-5">
                  {businessData?.service?.map((service, index) => (
                    <div
                      key={index}
                      className={`col-12 col-lg-4 service-design ${
                        index === currentSlide ? 'active' : ''
                      } mt-5 mb-5 text-center`}
                    >
                      <div className="col-12 text-center">
                        <h3>{service.title}</h3>
                      </div>
                      <div className="col-12 mt-5">
                        <p className="text-center">{service.description}</p>
                      </div>
                      <div
                        className="col-12 text-center"
                        style={{ height: '100px' }}
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-100"
                          style={{marginInline:'auto',borderRadius: '8px'}}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                businessData?.service?.map((service, index) => (
                  <div
                    key={index}
                    className={`col-12 col-lg-4 service-design ${
                      index === currentSlide ? 'active' : ''
                    } mt-5 mb-5 text-center`}
                  >
                    <div className="col-12 text-center">
                      <h3>{service.title}</h3>
                    </div>
                    <div className="col-12 mt-5">
                      <p className="text-center">{service.description}</p>
                    </div>

                    <div
                      className="col-12 text-center"
                      style={{ height: '100px' }}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-100"
                          style={{marginInline:'auto',borderRadius: '8px'}}
                      />
                    </div>
                  </div>
                ))
              )}
          </div>

          <div className="col-12 mb-5" id="gallery">
            <div className="col-12 mb-5 mt-5">
              <h1 className="fw-bold text-center">Gallery</h1>
            </div>
            <Slider {...gallery} className="gallery-slider">
              {businessData?.gallery?.map((image, index) => (
                <div key={index} className="p-2">
                  <img src={image} alt="" className="w-100 gallery-img" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      <section className="bg-white d-none">
        <div className="container p-top">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 row align-items-center">
              <div>
                <div className="col-12 text-center text-lg-start">
                  <h1 className="fw-bold fs-45">Our Expert Chef</h1>
                </div>
                <div className="col-12 text-center text-lg-start">
                  <p className="fs-25">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    non neque elit. Sed ut tellus ac neque fermentum tristique.
                    Donec sed facilisis tellus, a vulputate turpis. Duis eget
                    turpis non tellus tincidunt fermentum.
                  </p>
                </div>
              </div>
              <div className="mt-3 col-12 mb-5">
                <div className="row">
                  <div className="menu-button">
                    <button className="btn btn-dark text-white radius-theme box-shadow w-100">
                      Menu
                    </button>
                  </div>
                  <div className="book-a-table">
                    <button className="btn btn-dark text-white radius-theme box-shadow theme w-100">
                      Book a table
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="col-12 text-center">
                <img
                  src="/src/assets/images/chef.png"
                  alt=""
                  className="chef-div img-fluid w-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="" style={{ backgroundColor: "#F3F3F4" }}>
        <div className="container david-font p-top">
          <div className="col-12 text-center">
            <h1>Our Happy Customers</h1>
          </div>
          <div className="col-12">
            <p className="text-center">
              At Our Restaurant, we strive to provide the best dining experience
              possible. Our loyal customers have been satisfied with our
              culinary skills, service, and overall ambiance. Our positive
              feedback has helped us continuously improve our dining experience.
              If you're a loyal customer, we'd love to hear from you!
            </p>
          </div>

          <div className="mt-5">
            <Slider {...settings3}>
              {businessData?.testimonial?.reviews.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white col-12 p-3 mt-2 test-div-bottom"
                >
                  <div className="col-12 text-center test-button-img-div">
                    <img
                      src="/src/assets/images/user.png"
                      alt={testimonial?.name}
                      className="img-fluid"
                    />
                  </div>

                  <div className="text-warning text-center mt-0 m-0">
                    {[...Array(Math.floor(testimonial?.rating))].map(
                      (star, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      )
                    )}
                    {testimonial?.rating % 1 !== 0 && (
                      <i className="bi bi-star-half"></i>
                    )}
                  </div>

                  <div className="col-12 mt-3">
                    <p>{testimonial?.review}</p>
                  </div>

                  <div className="col-12 text-center mb-5">
                    <span className="fw-bold david-font">
                      {testimonial?.name}
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="col-12">
            <div className="col-12 text-center mb-3">
              <button
                className="btn btn-dark text-white radius-theme box-shadow theme mt-5"
                onClick={() => setVisible(true)}
              >
                Write Review
              </button>
            </div>
          </div>
        </div>
      </section>
      <Dialog
        header="Write a Review"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <div className="container">
          <div className="p-3 justify-content-center">
            <Rating
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.value })}
              cancel={false}
            />
          </div>
          <div className="col-12">
            <InputText
              keyfilter="text"
              placeholder="Full Name"
              className="w-100"
              value={review.name}
              name="name"
              onChange={handleInputChange}
            />
          </div>

          {/* Description Input Field */}
          <div className="col-12 mt-3">
            <div className="card flex justify-content-center">
              <InputTextarea
                value={review.description} // Bind the description from state
                onChange={handleInputChange} // Update description in state
                rows={5}
                cols={30}
                name="description" // Important: use `name` for targeting in handleInputChange
                placeholder="Write your review here..."
              />
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <button className="btn-theme2 btn theme radius">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <section className="david-font" id="contact">
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
                    <button className="btn theme btn-lg w-100">
                      Subscribe
                    </button>
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


      <ContactForm businessData={businessData} />

     

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
                      <a href="/terms-and-conditions">Terms and Conditions</a>
                    </div>
                    <div class="col-sm-4 text-right">
                      <div style={{ color: "#A4B3CB" }} class="text-right">
                        <span>
                          Copyright &copy;
                          {new Date().getFullYear()} En Connect. All Rights
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
    </>
  );
}
