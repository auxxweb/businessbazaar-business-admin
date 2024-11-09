import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import TemplateHeader from "../preview/common/TemplateHeader";
import useBusiness from "../../Hooks/useBusiness";
import BackdropLoader from "../preview/common/BackdropLoader";
import ContactSection from "../preview/premium/ContactSection";
import WelcomeCard from "../preview/premium/WelcomeCard";
import TemplateFooter from "../preview/common/TemplateFooter";
import SpecialServices from "../preview/premium/SpecialServices";
import SubscribeSection from "../preview/premium/SubscribeSection";
import ReviewSection from "../preview/premium/ReviewSection";
import Gallery from "../preview/premium/Gallery";
import ServicesSection from "../preview/premium/ServicesSection";
import MenuSection from "../preview/premium/MenuSection";
import ContactForm from "../preview/common/contactForm";
import { useNavigate } from "react-router-dom";

const PremiumPreview = () => {
  const { businessData, loading, closeDays, isPremium } = useBusiness();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isPremium) {
      navigate("/preview", { replace: false });
    }
  }, [isPremium]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
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
                        background-color: ${businessData?.theme}; /* Color of the scrollbar thumb */
                        border-radius: 10px;     /* Rounded edges of the thumb */
                        border: 3px solid  ${businessData?.theme}; /* Padding around the thumb */
                    }
                .theme
                {
                    background-color: ${businessData?.theme};
                    color: white;
                    border: none;
                }.service-design.active{
                    background-color: ${businessData?.theme};
                }.address-section{
                background-color:${businessData?.theme};
                }.address-logo i{
                color: ${businessData?.theme};
                }.cat-option{
                    border-right: 1px dashed ${businessData?.theme};
                }.text-orange{
                        color: ${businessData?.theme};
                    }.dish-div:hover{
                        background-color: ${businessData?.theme};
                        color:white;
                    }.product-section{
                    padding:20px;
                    border:1px solid ${businessData?.theme};
                    border-radius:16px;
                        }.slick-dots .slick-active button{
                            background-color: ${businessData?.theme};
                            border-radius: 16px;
                        }
                    `}
      </style>

      <Box sx={{ overflowX: "hidden" }}>
        <TemplateHeader businessData={businessData} />
        <Box
          sx={{
            backgroundImage: `url(${businessData?.landingPageHero?.coverImage})`,
            // backgroundImage: `url(/business/dm.png)`,
            backgroundSize: "cover",
            objectFit: "fill",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "800px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#D3DFEB",
              maxWidth: "611px",
              height: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              fontSize={"64px"}
              lineHeight={"76.8px"}
              fontWeight={"bold"}
              marginBottom={"15px"}
            >
              {businessData?.landingPageHero?.title}
            </Typography>
            <Typography fontSize={"16px"} lineHeight={"24px"}>
              {businessData?.landingPageHero?.description}
            </Typography>
            <Box marginTop={"30px"}>
              <Button
                sx={{
                  textTransform: "capitalize",
                  background: "#212529",
                  color: "#ffffff",
                  borderTopLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  marginRight: "19px",
                }}
              >
                {" "}
                Menu{" "}
              </Button>
              <Button
                sx={{
                  textTransform: "capitalize",
                  background: businessData?.theme,
                  color: "#ffffff",
                  borderTopLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                {" "}
                Book a table{" "}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{ position: "absolute", bottom: { xs: "-30%", md: "-21%" } }}
          >
            <ContactSection businessData={businessData} />
          </Box>
        </Box>
        <Box mt={{ xs: "10rem", md: "5rem" }}>
          <WelcomeCard businessData={businessData} />
        </Box>

        <SpecialServices businessData={businessData} />
        <MenuSection businessData={businessData} />
        <ServicesSection businessData={businessData} />
        <Gallery businessData={businessData} />
        <ReviewSection businessData={businessData} />
        <ContactForm businessData={businessData} />
        <SubscribeSection />

        <TemplateFooter businessData={businessData} closeDays={closeDays} />
        <BackdropLoader open={loading} />
      </Box>
    </>
  );
};

export default PremiumPreview;
