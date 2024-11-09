/* eslint-disable react/prop-types */
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";

const WriteReviewModal = ({ visible, setVisible }) => {
  const [review, setReview] = useState([
    {
      rating: "",
      name: "",
      description: "",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
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
  );
};

export default WriteReviewModal;
