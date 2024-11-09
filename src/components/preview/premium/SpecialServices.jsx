/* eslint-disable react/prop-types */
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";

const CoreServices = ({ businessData }) => {
  console.log(businessData, "businessData");
  return (
    <Box backgroundColor={"#F3F3F4"} padding={"5rem"}>
      <Container maxWidth={"lg"}>
        <Box
          maxWidth={"lg"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          margin={"2rem"}
        >
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            flexDirection={{ xs: "column", md: "row" }}
            alignItems={"flex-start"}
            gap={{ xs: "1rem", lg: "5rem" }}
            marginBottom={"5rem"}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "38px",
                  fontWeight: 700,
                  lineHeight: "54px",
                  letterSpacing: 0,
                  textTransform: "uppercase",
                }}
              >
                {businessData?.specialServices?.title}
              </Typography>
              <Box
                sx={{
                  border: `2px solid ${businessData?.theme}`,
                  width: "4rem",
                }}
              ></Box>
            </Box>
            <Box maxWidth={"600px"}>
              <Typography
                sx={{
                  color: "#3C4247",
                }}
              >
                {businessData?.specialServices?.description}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Stack spacing={2}>
              {businessData?.specialServices?.data.map((item, index) => (
                <Box
                  key={index}
                  backgroundColor={"#ffffff"}
                  padding={"1rem"}
                  sx={{
                    borderTopLeftRadius: "40px",
                    borderBottomRightRadius: "40px",
                    display: "flex",
                    gap: "2rem",
                  }}
                >
                  <Avatar
                    alt={item?.title}
                    src={item?.image}
                    // src={"/business/special_service.png"}
                    sx={{
                      width: 107,
                      height: 90,
                      marginLeft: "3rem",
                      "&:hover": {
                        backgroundColor: businessData?.theme
                      },
                    }}
                  />
                  <Box marginTop={"1rem"}>
                    <Typography fontWeight={"bold"}>{item?.title}</Typography>
                    <Typography>{item?.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CoreServices;
