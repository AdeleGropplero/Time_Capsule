import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import MyHome from "./components/MyHome";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CapsulaCreate from "./components/CapsulaCreate.jsx";
import Registration from "./components/Registration";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // Importa ProtectedRoute
import Capsula from "./components/Capsula.jsx";
import LeMieCaps from "./components/LeMieCaps.jsx";
import Profilo from "./components/Profilo.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Usa la ProtectedRoute per tutte le rotte protette */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MyHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-capsula"
          element={
            <ProtectedRoute>
              <CapsulaCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/le-mie-caps/:id`}
          element={
            <ProtectedRoute>
              <LeMieCaps />
            </ProtectedRoute>
          }
        />
        <Route
          path={`/profilo/:id`}
          element={
            <ProtectedRoute>
              <Profilo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/capsula/:id"
          element={
            <ProtectedRoute>
              <Capsula />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
