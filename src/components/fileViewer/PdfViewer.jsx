import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Spinner, Button } from "react-bootstrap";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configurazione del worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div>
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" size="sm" />
          <span className="ms-2">Caricamento PDF...</span>
        </div>
      )}
      <div className="d-flex justify-content-center">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div>Caricamento...</div>}
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(window.innerWidth - 40, 800)}
            renderTextLayer={false}
          />
        </Document>
      </div>
      {numPages && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="outline-primary"
            size="sm"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
          >
            Precedente
          </Button>
          <span>
            Pagina {pageNumber} di {numPages}
          </span>
          <Button
            variant="outline-primary"
            size="sm"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            Successiva
          </Button>
        </div>
      )}
    </div>
  );
}
