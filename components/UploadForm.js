import React from 'react';

const UploadForm = ({ handleFileChange, handleSubmit }) => {
  
 return (
    <div className = "bg-gray-800 mt-20 w-2/3">
      <form 
        onSubmit={handleSubmit}
        className = "flex flex-col justify-center items-center py-10 "
      >
        <div className = "text-3xl mb-10">Upload a new PDF</div>
        <input className = "mb-10" type="file" accept="application/pdf" onChange={handleFileChange} />
        <button 
          className = "rounded-lg bg-green-600 px-5 py-2 text-3xl" 
          type="submit"
        >
          Upload
        </button>
        
      </form>
    </div>
 );
};

export default UploadForm;

