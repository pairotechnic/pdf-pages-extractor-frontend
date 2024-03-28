import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import dotenv from 'dotenv'
import path from 'path';

dotenv.config({ path: path.resolve('../.env') })

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL
const aws_url = process.env.NEXT_PUBLIC_AWS_URL

// Set the worker that does the heavy lifting of displaying pdf
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const OriginalPdfViewer = ({ originalPdfUrl, resetSelection, selectedPages, setSelectedPages, setIsGeneratedPdfUploaded, setGeneratedPdfUrl }) => {

  const [originalNumPages, setOriginalNumPages] = useState(null);
  const pdfContainerRef = useRef(null) // Create a ref for the PDF container

  useEffect(() => {
    resetSelection()// Reset the selection when the component mounts, or when the originalPdfUrl changes
  }, [originalPdfUrl, resetSelection])

  useEffect(() => { // This useEffect will scroll the container into view when originalPdfUrl changes
    if(pdfContainerRef.current){
      pdfContainerRef.current.scrollIntoView({behavior : 'smooth'})
    }
  }, [originalPdfUrl])

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

    try {

      const response = await axios.post(`${backend_url}api/extract-pages`, {
        originalPdfPath: originalPdfUrl.split(`${aws_url}`)[1],
        selectedPages,
      });

      if (response.status === 200) {
        const generatedPdfUrl = `${response.data.filePath}`;

        setGeneratedPdfUrl(generatedPdfUrl)
        console.log("generatedPdfUrl has been set to : ", generatedPdfUrl)
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
    <div className="flex flex-col justify-center items-center  px-10 py-10  " ref = {pdfContainerRef}>
      <div className="text-4xl mb-10">Original PDF</div>
      <div className="overflow-auto h-screen ">

        <Document
          file={originalPdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {console.log("Printing original pdf", originalNumPages)}

          {Array.from(new Array(originalNumPages), (el, index) => (
            <div key={`page_${index + 1}`} className="flex items-center ">
              <input
                type="checkbox"
                className="form-checkbox w-10 h-10 mx-5 "
                checked={selectedPages.includes(index + 1)}
                onChange={() => handlePageSelect(index + 1)}
              />
              <div
                onClick={() => handlePageSelect(index + 1)}
              >
                <Page
                  pageNumber={index + 1}
                  className="mb-5"
                />
              </div>
              
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

