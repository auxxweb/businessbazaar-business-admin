import { useState } from "react";
import useTermsAndConditions from "../../Hooks/useTermsAndConditions";
import BackdropLoader from "../reUsableCmponent/BackdropLoader";

const TermsAndConditions = () => {
  const {
    termsAndConditions,
    loading,
    deleteTermsAndConditions,
    createTermsAndConditions,
  } = useTermsAndConditions();

  const [title, setTitle] = useState("");
  const [data, setData] = useState("");

  const handleAddTerm = () => {
    if (title && data) {
      if (title && data) {
        createTermsAndConditions({ termsAndConditions: [{ title, data }] });
        setTitle("");
        setData("");
      }
    }
  };

  const handleDeleteTerm = async (id) => {
    await deleteTermsAndConditions(id);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Terms & Conditions</h1>

      {/* Form Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Term</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Data"
            className="border p-2 rounded"
            value={data}
            onChange={(e) => setData(e.target.value)}
          ></textarea>
          <button
             className="mt-6 bg-[#105193] text-white py-2 px-4 rounded-lg hover:bg-[#107D93] transition "
            onClick={handleAddTerm}
          >
            Add Term
          </button>
        </div>
      </div>

      {/* Listing Section */}
      <h2 className="text-lg font-semibold mb-4">Terms & Conditions List</h2>
      <BackdropLoader isLoading={loading} />

      <div className="space-y-4">
        {termsAndConditions.map((term) => (
          <div
            key={term.id}
            className="p-4 border rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-bold">{term.title}</h3>
              <p>{term.data}</p>
            </div>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDeleteTerm(term._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;
