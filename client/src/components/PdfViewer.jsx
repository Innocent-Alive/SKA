

import { useState, useEffect} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FaPlus, FaMinus, FaExpand,FaRedo,FaColumns } from "react-icons/fa";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();


export default function PDFViewer() {
   const {id}=useParams()
  const [numPages, setNumPages] = useState(null);
   const [note, setNote] = useState(null);
  const [isTwoPageMode, setIsTwoPageMode] = useState(false);
  const [loadedPages, setLoadedPages] = useState(() => {
    return parseInt(localStorage.getItem("loadedPages")) || 1;
  });
  const [pageWidth, setPageWidth] = useState(900);
  const [isFullPage, setIsFullPage] = useState(false);
  const [rotation, setRotation] = useState(0);

  const toggleFitToPage = () => {
    if (!isFullPage) {
      setPageWidth(window.innerWidth);
    } else {
      setPageWidth(900);
    }
    setIsFullPage(!isFullPage);
  };
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/notes/${id}`
        );
        setNote(response.data);
      } catch (err) {
       console.loh("Failed to fetch note details. Please try again later.");
      }
    };
    fetchNote();
  }, [id]);

  const toggleTwoPageMode = () => {
    setIsTwoPageMode((prev) => !prev);
    setPageWidth((prev) => (isTwoPageMode ? prev * 1.5 : prev / 1.5));
  };

  const zoomIn = () => {
    setIsFullPage(false);
    setPageWidth((prevWidth) => Math.min(prevWidth + 50, 1200));
  };

  const zoomOut = () => {
    setIsFullPage(false);
    setPageWidth((prevWidth) => Math.max(prevWidth - 50, 300));
  };

  const rotatePDF = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageWidth(900);
    setIsFullPage(false);
  }

  let lastScrollY = 0;
  let isScrolling = false;

  function handleScroll() {
    const scrollPosition = window.scrollY;

    if (
      scrollPosition + window.innerHeight >= document.body.offsetHeight - 50 &&
      loadedPages < numPages
    ) {
      setLoadedPages((prev) => {
        const newPages = Math.min(prev + 1, numPages);
        localStorage.setItem("loadedPages", newPages);
        return newPages;
      });
    } else if (scrollPosition < lastScrollY && loadedPages > 1 && !isScrolling) {
      isScrolling = true;
      setLoadedPages((prev) => {
        const newPages = Math.max(prev - 1, 1);
        localStorage.setItem("loadedPages", newPages);
        return newPages;
      });
      setTimeout(() => {
        isScrolling = false;
      }, 200);
    }
    lastScrollY = scrollPosition;
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadedPages, numPages]);

  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full p-6">
      <div className="w-full h-[65px] bg-[#333333] border-b border-gray-600 flex justify-between items-center px-4 fixed top-0 left-0 z-10">
        <div>{note.title && <h2 className="text-white text-lg font-semibold">{note.title}</h2>}</div>
        <div className="flex items-center gap-2">
          <div className="border-r-2 flex border-gray-600">
            <button className="w-8 h-8 flex items-center justify-center text-white" onClick={zoomOut}><FaMinus size={15} /></button>
            <button className="w-8 h-8 flex items-center justify-center text-white" onClick={zoomIn}><FaPlus size={15} /></button>
            <button className={`w-8 h-8 flex items-center justify-center text-white rounded-full ${isFullPage ? "bg-accent" : ""}`} onClick={toggleFitToPage}><FaExpand size={15} /></button>
          </div>
          {numPages && (
            <div className="text-white text-sm font-semibold border-r-2 border-r-gray-600 pr-4 h-[33px] flex items-center">
              <p>Page <span className="bg-[#333333] border border-2 border-gray-500 p-2 mx-2">{loadedPages}</span> of <span>{numPages}</span></p>
            </div>
          )}
          <button className="w-8 h-8 flex items-center justify-center text-white" onClick={rotatePDF}><FaRedo size={15} /></button>
          <button className={`w-8 h-8 flex items-center justify-center text-white rounded-full ${isTwoPageMode ? "bg-accent" : ""}`} onClick={toggleTwoPageMode}><FaColumns size={15} /></button>
        </div>
       
        <div> <h2 className="text-white text-lg font-semibold">Shree Kalam Academy</h2></div>
       
      </div>
      {note.pdfUrl && (
        <div className="flex flex-col items-center mt-[70px] w-full">
          <Document file={note.pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {isTwoPageMode
              ? Array.from({ length: Math.ceil(loadedPages / 2) }, (_, index) => {
                  const page1 = index * 2 + 1;
                  const page2 = page1 + 1;
                  return (
                    <div key={index} className="flex gap-4">
                      <Page pageNumber={page1} className="mb-4" width={pageWidth} rotate={rotation} />
                      {page2 <= numPages && <Page pageNumber={page2} className="mb-4" width={pageWidth} rotate={rotation} />}
                    </div>
                  );
                })
              : Array.from({ length: loadedPages }, (_, index) => (
                  <Page key={index} pageNumber={index + 1} className="mb-4" width={pageWidth} rotate={rotation} />
                ))}
          </Document>
        </div>
      )}
    </div>
  );
}