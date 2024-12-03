import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";


import useBusiness from "../../api/useBusiness";
import Loader from "../Loader/Loader";
import { checkPaymentStatus, createPayment } from "../../common/functions";


export default function Razorpay() {
  const dispatch = useDispatch();
  
  const [id,setId]=useState('')
  const [isScriptLoaded, setScriptLoaded] = useState(false);
  const [loader, setLoader] = useState(false);
  const [businessData,setBusinessData]=useState([])
  const navigate = useNavigate()
  const {  businesses,getBusiness } = useBusiness();

  // useEffect(()=>{
  //   setBusinessData(businesses)
  // },[setBusinessData])
//   const planDetails = useSelector((state) => state.planDetails);
  const location = useLocation();

  const  planDetails  = location.state || {}; // Destructure state
console.log(planDetails);


  useEffect(() => {
    const fetchData = async () => {
      getBusiness();
    };

    // fetchData();
  }, []);



  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        setScriptLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        setScriptLoaded(false);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePrevStep = () => navigate("/subscription");

//     const options = {
//       key: 'rzp_test_DBApSwEptkCDdS', // Dummy Razorpay key ID for testing
//       amount: planDetails?.amount * 100, // Amount in paise (50000 paise = ₹500)
//       currency: 'INR',
//       name: 'InConnect',
//       description:
//         'InConnect is a comprehensive platform designed to simplify and enhance professional networking, providing seamless tools for business growth, collaboration, and community building',
//       image: 'https://instant-connect.in/src/assets/images/enConnectLogo.jpeg', // Dummy logo URL
//       handler: async function (response) {
//         console.log(response, 'response')
//         setLoader(true)
//         const interval = setInterval(async () => {
//           try {
//             const paymentData = await checkPaymentStatus(id, token)
//             const payment_status = paymentData?.data?.PaymentStatus
//             if (payment_status === 'success') {
//               setLoader(false)
//               clearInterval(interval) // Clear the interval if payment is successful
//               navigate(`/template/${id}`)
//             }
//             if (payment_status === 'failed') {
//               setLoader(false)
//               clearInterval(interval)
//               toast.error('Payment Failed ,try again ', {
//                 position: 'top-right',
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 theme: 'colored',
//                 style: {
//                   backgroundColor: '#e74c3c', // Custom red color for error
//                   color: '#FFFFFF', // White text
//                 },
//               })
//               setStep((prev) => prev - 1)
//             }
//           } catch (error) {
//             setLoader(false)
//             setStep((prev) => prev - 1)
//             console.error('Error fetching payment status:', error)
//           }
//         }, 2000)
  // Function to open Razorpay payment window
  const handlePayment = async (id, token) => {
    if (!isScriptLoaded) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }
    }

    const options = {
      key: "rzp_test_DBApSwEptkCDdS", // Dummy Razorpay key ID for testing
      amount: planDetails?.price * 100, // Amount in paise (50000 paise = ₹500)
      currency: "INR",
      name: "EnConnect",
      description:
        "EnConnect is a comprehensive platform designed to simplify and enhance professional networking, providing seamless tools for business growth, collaboration, and community building",
      image: "https://instant-connect.in/src/assets/images/enconnectLogo.png", // Dummy logo URL
      handler: async function (response) {
        console.log(response, "response");
        setLoader(true);
        const interval = setInterval(async () => {
          try {
            const paymentData = await checkPaymentStatus( token);
            console.log(paymentData,'payment dataaaaaaaa')
            const payment_status = paymentData?.data?.PaymentStatus;
            const id= paymentData?.business
            if (payment_status === "success") {
              setLoader(false);
              clearInterval(interval); // Clear the interval if payment is successful
              navigate(`/subscription`);
            //   dispatch(resetBusinessState());
            //   dispatch(resetPlanState());
            }
            if (payment_status === "failed") {
              setLoader(false);
              clearInterval(interval);
              toast.error("Payment Failed ,try again ", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
                style: {
                  backgroundColor: "#e74c3c", // Custom red color for error
                  color: "#FFFFFF", // White text
                },
              });
              handlePrevStep();
            }
          } catch (error) {
            setLoader(false);
            handlePrevStep();
            console.error("Error fetching payment status:", error);
          }
        }, 2000);

        // Set a timeout to clear the interval after 2 minutes
        setTimeout(() => {
          clearInterval(interval);
          setLoader(false);
          toast.error("Something went wrong , please try again!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
              backgroundColor: "#e74c3c", // Custom red color for error
              color: "#FFFFFF", // White text
            },
          });
          handlePrevStep();
          console.log("Stopped checking payment status after 2 minutes");
        }, 2 * 60 * 1000); // 2 minutes in milliseconds
      },
      modal: {
        ondismiss: function () {
          toast.warning("Payment process was cancelled. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
          handlePrevStep();
        },
      },
      prefill: {
        name: businessData?.businessName,
        email: businessData?.contactDetails?.email,
        contact: businessData?.contactDetails?.primaryNumber,
      },
      notes: {
        businessId: id,
      },
      theme: {
        color: businessData.theme, // Customize theme color
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const submitData = async () => {
        try { 
         
            const id = businessData._id
            const token = JSON.parse(localStorage.getItem('userCredential'))
            console.log(businessData,'kjkj')
            console.log(planDetails.plan,'ithaaan ath')
            const paymentRes= await createPayment({plan:planDetails.plan},token)
            if(paymentRes.success){
                handlePayment(id, token)
            }    
  
        } catch (error) {
          console.log(error, "razorpay-error");
        }
      

    };

    submitData();
  }, []);

  if (loader)
    return (
      <div
        style={{
          height: "100vh",
          top: "50%",
          left: "50%",
          display: "flex",
        }}
      >
        <Loader />
      </div>
    );

  return null;
}
