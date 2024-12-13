import { toast } from "sonner"

export const showToast = (message) => {
    toast(message, {
      theme: "colored",
      position: "top-right",
      duration: 2000,
      style: {
        backgroundColor: "orange",
        color: "#FFFFFF",
        height: "60px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }
    }
    )
  }