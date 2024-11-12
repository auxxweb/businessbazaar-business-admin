import axios from 'axios'
import { useEffect, useState } from 'react'
import useBusiness from '../../api/useBusiness'
import usePayment from '../../api/usePayment'

export const Razorpay = ({ paymentData, handlePaymentResponse }) => {
  const [isScriptLoaded, setScriptLoaded] = useState(false)
  const [businessId, setBusinessId] = useState('')

  const { businesses, getBusiness } = useBusiness()
  const { loading, createPayment } = usePayment()

  useEffect(() => {
    const fetchBusiness = async () => {
      await getBusiness()
    }
    fetchBusiness()
  }, [])

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

  // Function to open Razorpay payment window
  const handlePayment = async (id) => {
    if (!isScriptLoaded) {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        alert('Razorpay SDK failed to load. Are you online?')
        return
      }
    }

    const options = {
      key: 'rzp_test_SGRm1pfUuOFpzu', // Dummy Razorpay key ID for testing
      amount: paymentData?.amount * 100, // Amount in paise (50000 paise = ₹500)
      currency: 'INR',
      name: 'Demo Company',
      description: 'Test Transaction',
      image: businesses?.logo, // Dummy logo URL
      handler: async function (response) {
          await handlePaymentResponse(response)
        var paymentDetails = {
          plan: paymentData?.selectedPlan,
          paymentId: response?.razorpay_payment_id,
          date: new Date(),
        }
        try {
          const response = await createPayment(paymentDetails)
          if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const data = response.data
          if (data.success) {
            return data
          } else {
            console.error(
              'Failed to create business details:',
              data.message || 'Unknown error',
            )
            throw new Error(data.message || 'Failed to create business details')
          }
        } catch (error) {
          console.error(
            'Error occurred while fetching business site details:',
            error.message,
          )
          throw error
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Sample Address',
      },
      theme: {
        color: '#F37254', // Customize theme color
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }
//   const submitData = async () => {
//     const res = await CreateBusinessDetails(formData)
//     const id = res.data._id || res.data.data?._id
//     setBusinessId(id)
//     handlePayment(id)
//   }
//   submitData()
}
