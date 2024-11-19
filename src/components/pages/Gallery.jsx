const data = [
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
  "https://www.shutterstock.com/image-vector/circle-business-logo-company-name-260nw-626261534.jpg",
];

const Gallery = () => {
    const handleEditImage = ()=>{
        
    }
    const handleDeleteImage = ()=>{

    }
  return (
    <>
      <div className="container">
        <div className="flex rounded-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-700">Gallery</h2>
        </div>
        <div className="row ">
          {data.map((item) => (
            <div className="col-md-3 p-2  ">
              <div className=" w-fit h-full border relative rounded-md mx-auto hover:shadow-xl duration-300 ">
                <img src={item} alt="" className=" w-48 h-auto mx-auto" />
                <div className="absolute left-0 bottom-0 flex justify-between w-full  hover:flex  py-2 ">
                  <button className=" rounded shadow  text-xs ">
                    <img
                      src="/icons/edit.svg"
                      alt="Edit"
                      className="w-5 h-5 cursor-pointer ms-1"
                    />
                  </button>
                  <button>
                    <img
                      alt="pics"
                      src="/icons/delete.svg"
                      className="w-6 h-6 rounded-full mr-2 fill-red-500"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Gallery;
