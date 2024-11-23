/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { checkPaymentStatus,CreateBusinessDetails } from '../../common/functions'
import Loader from '../Loader/Loader'
export default function Razorpay({ formData, planDetails, setStep }) {
  const [isScriptLoaded, setScriptLoaded] = useState(false)
  const [loader, setLoader] = useState(false)
  const [businessId, setBusinessId] = useState('')
  const navigate = useNavigate()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        setScriptLoaded(true)
        resolve(true)
      }
      script.onerror = () => {
        setScriptLoaded(false)
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

//     const options = {
//       key: 'rzp_test_DBApSwEptkCDdS', // Dummy Razorpay key ID for testing
//       amount: planDetails?.amount * 100, // Amount in paise (50000 paise = ₹500)
//       currency: 'INR',
//       name: 'InConnect',
//       description:
//         'InConnect is a comprehensive platform designed to simplify and enhance professional networking, providing seamless tools for business growth, collaboration, and community building',
//       image: 'https://instant-connect.in/src/assets/images/enConnectLogo.jpg', // Dummy logo URL
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
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        alert('Razorpay SDK failed to load. Are you online?')
        return
      }
    }

    const options = {
      key: 'rzp_test_DBApSwEptkCDdS', // Dummy Razorpay key ID for testing
      amount: planDetails?.amount * 100, // Amount in paise (50000 paise = ₹500)
      currency: 'INR',
      name: 'InConnect',
      description:
        'InConnect is a comprehensive platform designed to simplify and enhance professional networking, providing seamless tools for business growth, collaboration, and community building',
      image: 'https://instant-connect.in/src/assets/images/logo.jpeg', // Dummy logo URL
      handler: async function (response) {
        console.log(response, 'response')
        setLoader(true)
        const interval = setInterval(async () => {
          try {
            const paymentData = await checkPaymentStatus(id, token)
            const payment_status = paymentData?.data?.PaymentStatus
            if (payment_status === 'success') {
              setLoader(false)
              clearInterval(interval) // Clear the interval if payment is successful
              navigate(`/template/${id}`)
            }
            if (payment_status === 'failed') {
              setLoader(false)
              clearInterval(interval)
              toast.error('Payment Failed ,try again ', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'colored',
                style: {
                  backgroundColor: '#e74c3c', // Custom red color for error
                  color: '#FFFFFF', // White text
                },
              })
              setStep((prev) => prev - 1)
            }
          } catch (error) {
            setLoader(false)
            setStep((prev) => prev - 1)
            console.error('Error fetching payment status:', error)
          }
        }, 2000)

        // Set a timeout to clear the interval after 2 minutes
        setTimeout(() => {
          clearInterval(interval)
          setLoader(false)
          toast.error('Something went wrong , please try again!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
            style: {
              backgroundColor: '#e74c3c', // Custom red color for error
              color: '#FFFFFF', // White text
            },
          })
          setStep((prev) => prev - 1)
          console.log('Stopped checking payment status after 2 minutes')
        }, 2 * 60 * 1000) // 2 minutes in milliseconds
      },
      modal: {
        ondismiss: function () {
          toast.warning('Payment process was cancelled. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
          })
          setStep((prev) => prev - 1)
        },
      },
      prefill: {
        name: formData?.businessName,
        email: formData?.contactDetails?.email,
        contact: formData?.contactDetails?.primaryNumber,
      },
      notes: {
        businessId: id,
      },
      theme: {
        color: "#105193", // Customize theme color
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const submitData = async () => {
    console.log(formData, 'formData')

    try {
      const res = await CreateBusinessDetails(formData)

      const id = res.data?._id || res.data.data?._id
      const token = res.data?.token || res.data?.data?.token
      setBusinessId(id)
      handlePayment(id, token)
    } catch (error) {
      console.log(error, 'razorpay-error')
    }
  }
  useEffect(() => {
    submitData()
  }, [])

  if (loader)
    return (
      <div
        style={{
          height: '100vh',
          top: '50%',
          left: '50%',
          display: 'flex',
        }}
      >
        <Loader />
      </div>
    )

  return null
}
