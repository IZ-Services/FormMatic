'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const PdfViewerPage = () => {
  const searchParams = useSearchParams();
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfTitles, setPdfTitles] = useState<string[]>([]);

  useEffect(() => {
    const loadPdfs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const pdfParam = searchParams.get('pdfs');
        const titlesParam = searchParams.get('titles');
        
        if (pdfParam) {
          const urls = JSON.parse(decodeURIComponent(pdfParam));
          
          if (!Array.isArray(urls) || urls.length === 0) {
            throw new Error('Invalid PDF URLs format');
          }
          
          const validUrls = urls.filter(url => typeof url === 'string');
          if (validUrls.length === 0) {
            throw new Error('No valid PDF URLs found');
          }
          
          setPdfUrls(validUrls);
          
          if (titlesParam) {
            try {
              const titles = JSON.parse(decodeURIComponent(titlesParam));
              if (Array.isArray(titles) && titles.length > 0) {
                const formattedTitles = validUrls.map((_, index) => {
                  return index < titles.length ? titles[index] : `PDF ${index + 1}`;
                });
                setPdfTitles(formattedTitles);
              } else {
                setPdfTitles(validUrls.map((_, index) => `PDF ${index + 1}`));
              }
            } catch (e) {
              setPdfTitles(validUrls.map((_, index) => `PDF ${index + 1}`));
            }
          } else {
            setPdfTitles(validUrls.map((_, index) => `PDF ${index + 1}`));
          }
        } else {
          throw new Error('No PDF URLs provided');
        }
      } catch (err: any) {
        console.error('Error loading PDFs:', err);
        setError(err.message || 'Failed to load PDF documents');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPdfs();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>Loading PDFs...</div>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 2s linear infinite',
            margin: '0 auto'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>Error Loading PDFs</h2>
        <p>{error}</p>
        <p style={{ marginTop: '20px' }}>
          Please try again or contact support if the problem persists.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (pdfUrls.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px' }}>No PDFs Available</h2>
        <p>No PDF documents were found for viewing.</p>
        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

 
  const pdfContainerHeight = `calc(100vh / ${pdfUrls.length})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
      {/* Stack all PDFs one after another */}
      {pdfUrls.map((url, index) => (
        <div key={`pdf-container-${index}`} style={{ position: 'relative', height: '100vh' }}>
          {/* PDF Title */}
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f0f0f0',
            borderBottom: '1px solid #ccc',
            fontWeight: 'bold',
            textAlign: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            {pdfTitles[index] || `PDF ${index + 1}`}
          </div>
          
          {/* PDF Content */}
          <iframe
            src={url}
            style={{ 
              width: '100%', 
              height: 'calc(100% - 41px)', 
              border: 'none',
              display: 'block'
            }}
            title={pdfTitles[index] || `PDF ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default PdfViewerPage;