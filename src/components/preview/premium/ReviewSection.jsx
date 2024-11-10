/* eslint-disable react/prop-types */
import { useState } from "react";
import Slider from "react-slick";
import WriteReviewModal from "./WriteReviewModal";
import { Avatar, Box, Button, Rating, Typography } from "@mui/material";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
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
      breakpoint: 390,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
const ReviewSection = ({ businessData }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Box backgroundColor={"#F3F3F4"} padding={"3rem 5rem"}>
      <Box
        maxWidth={"lg"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        margin={"1rem 2rem"}
      >
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={"flex-start"}
          gap={{ xs: "1rem", lg: "5rem" }}
          marginBottom={"1rem"}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "38px",
                fontWeight: 700,
                // lineHeight: "54px",
                letterSpacing: 0,
                textTransform: "uppercase",
              }}
            >
              Our Happy Customer
            </Typography>
            <Box
              sx={{
                border: `2px solid ${businessData?.theme}`,
                width: "4rem",
              }}
            ></Box>
          </Box>
          <Box maxWidth={"72%"}>
            <Typography
              sx={{
                color: "#3C4247",
                mt: "1rem",
              }}
            >
              At Our Restaurant, we strive to provide the best dining experience
              possible. Our loyal customers have been satisfied with our
              culinary skills, service, and overall ambiance. Our positive
              feedback has helped us continuously improve our dining experience.
              If you&apos;re a loyal customer, we&apos;d love to hear from you!
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Slider {...settings}>
            {businessData?.testimonial?.reviews.map((testimonial, index) => (
              <Box
                key={index}
                sx={{ position: "relative", paddingBottom: "6rem" }}
              >
                <Box
                  sx={{
                    maxWidth: 340,
                    paddingBottom: "2rem",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      backgroundColor: "#ffffff",
                      padding: "2rem",
                      paddingBottom: "1rem",
                      borderRadius: "8px",
                      textAlign: "center",
                      overflow: "visible",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-2.8rem",
                        left: "30%",
                        zIndex: 5,
                        transform: "translateX(-50%)",
                        borderWidth: "25px",
                        borderStyle: "solid",
                        borderColor:
                          "#ffffff transparent transparent transparent",
                      },
                    }}
                  >
                    <Typography
                      textAlign={"left"}
                      fontSize={"16px"}
                      color={"#212529"}
                    >
                      {testimonial?.review}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "1.4rem",
                    left: "15%",
                    zIndex: "5",
                    width: "100px",
                    height: "80px",
                  }}
                >
                  <Box display={"flex"} gap={"1rem"}>
                    <Avatar
                      alt={testimonial?.name}
                      sx={{ width: 79, height: 79 }}
                      src={testimonial?.image}
                    />
                    <Box>
                      <Typography>{testimonial?.name}</Typography>
                      <Rating
                        name="half-rating-read"
                        defaultValue={testimonial?.rating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
      <Box className="col-12">
        <Box className="col-12 text-center mb-3">
          <Button
            className="btn btn-dark text-white radius-theme box-shadow theme mt-5"
            onClick={() => setVisible(true)}
          >
            Write Review
          </Button>
        </Box>
      </Box>
      <WriteReviewModal visible={visible} setVisible={setVisible} />
    </Box>
  );
};

export default ReviewSection;
