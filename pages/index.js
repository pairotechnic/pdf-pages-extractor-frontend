import React, { useCallback, useState } from 'react';
import axios from 'axios';
import UploadForm from '@/components/UploadForm';
import GeneratedPdfViewer from '@/components/GeneratedPdfViewer';
import OriginalPdfViewer from '@/components/OriginalPdfViewer';
import dotenv from 'dotenv'
import path from 'path';

// dotenv.config({ path: path.resolve('../.env') }) // Only used during development

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL

const Index = () => {

  const [file, setFile] = useState(null);
  const [originalPdfUrl, setOriginalPdfUrl] = useState('');
  const [selectedPages, setSelectedPages] = useState([]) // Lifted the state to be able to reset checkboxes when new PDF is uploaded
  const [isGeneratedPdfUploaded, setIsGeneratedPdfUploaded] = useState(false)
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState('');

  const resetSelection = useCallback(() => {
    setSelectedPages([]); // Reset the selected pages
  }, []); // Empty dependency array since resetSelection does not depend on any props or state

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post(`${backend_url}api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const filePath = response.data.filePath;
        const fullUrl = `${filePath}`;
        setOriginalPdfUrl(fullUrl);
        setIsGeneratedPdfUploaded(true)
      } else {
        alert('File Upload Failed');
      }
    } catch (error) {
      console.error('Error Uploading file: ', error);
      alert('File Upload Failed');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-20 text-white bg-black">

      <div className="text-6xl text-white leading-loose">Extract PDF Pages</div>
      <div className="text-3xl text-white">Extract PDF pages online and save result as new PDF</div>

      <UploadForm
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />

      <div className="text-3xl text-white mt-20 leading-loose">
        Click on pages to select them for extraction. <br />
      </div>

      <div className="h-screen " >

        <div className="flex flex-row justify-between my-20 bg-gray-700 h-5/6" >

          {originalPdfUrl && <OriginalPdfViewer
            originalPdfUrl={originalPdfUrl}
            resetSelection={resetSelection}
            selectedPages={selectedPages} setSelectedPages={setSelectedPages}
            setIsGeneratedPdfUploaded={setIsGeneratedPdfUploaded}
            setGeneratedPdfUrl={setGeneratedPdfUrl}

          />}

          {!isGeneratedPdfUploaded && generatedPdfUrl && <GeneratedPdfViewer generatedPdfUrl={generatedPdfUrl} />}

        </div>

      </div>

    </div>
  );
};

export default Index;
