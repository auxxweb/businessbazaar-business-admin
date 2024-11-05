import React, { useState } from 'react'

const PrivacyPolicies = () => {
    const [policies, setTerms] = useState([]);
    const [title, setTitle] = useState('');
    const [data, setData] = useState('');
  
    const handleAddTerm = () => {
      if (title && data) {
        setTerms([...policies, { title, data, id: Date.now() }]);
        setTitle('');
        setData('');
      }
    };
  
    const handleDeletePolicy = (id) => {
      setTerms(policies.filter((policy) => policy.id !== id));
    };
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Privacy Policies</h1>
  
        {/* Form Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Privacy Policy</h2>
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
              Add Policy
            </button>
          </div>
        </div>
  
        {/* Listing Section */}
        <h2 className="text-lg font-semibold mb-4">Privacy Policies List</h2>
        <div className="space-y-4">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="p-4 border rounded flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold">{policy.title}</h3>
                <p>{policy.data}</p>
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDeletePolicy(policy.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
}

export default PrivacyPolicies
