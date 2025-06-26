import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ docUrl }) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef();

  function onDocumentLoadSuccess({ noOfPages }) {
    setNumPages(noOfPages);
  }

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <Document file={docUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {containerWidth && (
          <Page pageNumber={pageNumber} width={containerWidth} />
        )}
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
    </div>
  );
}

PdfViewer.propTypes = {
  docUrl: PropTypes.string.isRequired,
};
