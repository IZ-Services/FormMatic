"use client";
import { useState, useEffect } from 'react';

export default function DownloadPDF() {
  const [pdfData, setPdfData] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch('/api/pdfLoader'); 
        const data = await response.json();
        setPdfData(data.pdfData);
      }
	   catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, []); 
  return (
    <div>
      {pdfData && (
        <object
          type="application/pdf"
          width="100%"
          height="600px"
          data={`data:application/pdf;base64,${pdfData}`}
        >
          Your browser does not support PDFs.
        </object>
      )}
    </div>
  );
}
