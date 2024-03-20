// components/GeneratedPdfViewer.js
import axios from 'axios';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set the worker that does the heavy lifting of displaying pdf
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const GeneratedPdfViewer = ({ generatedPdfUrl }) => {

  const [newNumPages, setNewNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNewNumPages(numPages);
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get(generatedPdfUrl, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf ' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const filename = generatedPdfUrl.split('/').pop() // We extract the filename from the generatedPdfUrl
      link.href = url
      link.setAttribute('download', filename) // We use the extracted filename here
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Error downloading PDF : ', error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center  px-10 py-10  ">
      <div className = "text-4xl mb-10">Generated PDF</div>
      <div className="overflow-auto h-screen ">
        <Document
          file={generatedPdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(newNumPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="mb-5"
            />
          ))}
        </Document>
      </div>

      <button
        onClick={handleDownload}
        className="rounded-lg bg-blue-600 px-5 py-2 mt-10 text-3xl"
      >
        Download
      </button>

    </div>
  );
};

export default GeneratedPdfViewer;
