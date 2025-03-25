import { useState, useEffect } from "react";
import api from "../api/api";

function TextFileViewer({ url }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTextFile = async () => {
      try {
        const response = await api.get(url, { responseType: "text" });
        setContent(response.data);
      } catch (error) {
        console.error("Errore nel caricamento del file:", error);
        setContent("Impossibile caricare il contenuto del file.");
      } finally {
        setLoading(false);
      }
    };

    fetchTextFile();
  }, [url]);

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" size="sm" />
        <span className="ms-2">Caricamento in corso...</span>
      </div>
    );
  }

  return (
    <pre className="p-3 bg-light rounded" style={{ whiteSpace: "pre-wrap" }}>
      {content}
    </pre>
  );
}

export default TextFileViewer;
