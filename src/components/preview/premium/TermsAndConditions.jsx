// src/TermsAndConditions.js
import React from "react";
import "/src/assets/css/TermsAndConditions.css";
import TemplateHeader from "/src/components/Business/TemplateHeader";
import useBusiness from "/src/Hooks/useBusiness";
import { Box } from "@mui/material";

const TermsAndConditions = ({ htmlContent }) => {
    const { businessData, loading, closeDays } = useBusiness();
    console.log(businessData,"businessData");
    
  return (
    <Box sx={{ overflowX: "hidden" }}>
        <TemplateHeader businessData={businessData} />
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      <div
        className="terms-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
    </Box>

  );
};

export default TermsAndConditions;
