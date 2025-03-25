import { useState } from "react";
import { Document, Page } from "react-pdf";
import { Spinner, Button } from "react-bootstrap";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

function PdfViewer({ url }) {
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
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Caricamento...</div>}
      >
        <Page pageNumber={pageNumber} width={600} />
      </Document>
      <div className="d-flex justify-content-between mt-2">
        <Button
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
          size="sm"
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber((p) => p + 1)}
        >
          Successiva
        </Button>
      </div>
    </div>
  );
}

export default PdfViewer;
