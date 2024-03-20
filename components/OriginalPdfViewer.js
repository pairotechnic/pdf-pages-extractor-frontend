import axios from 'axios';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the worker that does the heavy lifting of displaying pdf
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const OriginalPdfViewer = ({ originalPdfUrl, resetSelection, selectedPages, setSelectedPages, setIsGeneratedPdfUploaded, setGeneratedPdfUrl }) => {

  const [originalNumPages, setOriginalNumPages] = useState(null);

  useEffect(() => {
    resetSelection()// Reset the selection when the component mounts, or when the originalPdfUrl changes
  }, [originalPdfUrl, resetSelection])

  function onDocumentLoadSuccess({ numPages }) {
    setOriginalNumPages(numPages)
  }

  const handlePageSelect = (pageNumber) => {
    setSelectedPages(prevSelectedPages => {
      if (prevSelectedPages.includes(pageNumber)) {
        // If the page is already selected, remove it from the selection
        return prevSelectedPages.filter(page => page !== pageNumber);
      } else {
        // If the page is not selected, add it to the selection
        return [...prevSelectedPages, pageNumber];
      }
    });
  };

  const handleExtractPages = async () => {

    console.log("Selected pages : ", selectedPages) // Debugging

    try {

      const response = await axios.post('http://localhost:4000/api/extract-pages', {
        originalPdfPath: originalPdfUrl.split('http://localhost:4000/')[1],
        selectedPages,
      });

      if (response.status === 200) {
        const generatedPdfUrl = `http://localhost:4000/${response.data.filePath}`;
        setGeneratedPdfUrl(generatedPdfUrl)
        setIsGeneratedPdfUploaded(false)

      } else {
        alert('Failed to create new PDF');
      }
    } catch (error) {
      console.error('Error creating new PDF: ', error);
      alert('Failed to create new PDF');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center  px-10 py-10  ">
      <div className="text-4xl mb-10">Original PDF</div>
      <div className="overflow-auto h-screen ">

        <Document
          file={originalPdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        // className = " w-1/4"
        >
          {console.log("Printing original pdf", originalNumPages)}

          {Array.from(new Array(originalNumPages), (el, index) => (
            <div key={`page_${index + 1}`} className="flex items-center ">
              <div
                onClick={() => handlePageSelect(index + 1)}
              >
                <Page
                  pageNumber={index + 1}
                  className="mb-5"
                />
              </div>
              <input
                type="checkbox"
                className="form-checkbox w-10 h-10 mx-5 "
                checked={selectedPages.includes(index + 1)}
                onChange={() => handlePageSelect(index + 1)}
              />
            </div>
          ))}

        </Document>
      </div>

      <button
        onClick={handleExtractPages}
        className="rounded-lg bg-red-600 px-5 py-2 mt-10 text-3xl"
      >
        Extract Pages
      </button>

    </div>
  );
};

export default OriginalPdfViewer;

