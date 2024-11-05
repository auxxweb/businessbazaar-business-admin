import { useState } from "react";

const TermsAndConditions = () => {
  const [terms, setTerms] = useState([]);
  const [title, setTitle] = useState("");
  const [data, setData] = useState("");

  const handleAddTerm = () => {
    if (title && data) {
      setTerms([...terms, { title, data, id: Date.now() }]);
      setTitle("");
      setData("");
    }
  };

  const handleDeleteTerm = (id) => {
    setTerms(terms.filter((term) => term.id !== id));
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
            className="bg-[rgb(6,138,85)] text-white p-2 rounded hover:bg-[rgb(22,202,187)] "
            onClick={handleAddTerm}
          >
            Add Term
          </button>
        </div>
      </div>

      {/* Listing Section */}
      <h2 className="text-lg font-semibold mb-4">Terms & Conditions List</h2>
      <div className="space-y-4">
        {terms.map((term) => (
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
              onClick={() => handleDeleteTerm(term.id)}
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
