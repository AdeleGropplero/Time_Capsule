import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import MyHome from "./components/MyHome";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CapsulaPersonaleCreate from "./components/CapsulaPersonaleCreate";
import Registration from "./components/Registration";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setUser } from "./redux/reducers/authSlice.js";
import api from "./api/api"; // Importa Axios configuratoimport api from
import Capsula from "./components/c_CapPersonale/Capsula.jsx";
import LeMieCaps from "./components/LeMieCaps.jsx";

function App() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  //Dentro l'app verifico la validità del token con una get apposita.
  //La protected route mi garantisce che in ogni rotta protetta ci sia una un controllo sul token.
  useEffect(() => {
    const checkTokenValidity = () => {
      if (!token || !user) {
        console.warn("Token o user mancante, eseguo logout");
        dispatch(logout());
        return;
      }

      api
        .get("/token-validation")
        .then((res) => {
          /* In Axios, la proprietà response.status è utilizzata per ottenere il codice di stato HTTP della risposta, mentre res.ok è una proprietà di Response in Fetch API, un'altra libreria per fare richieste HTTP */
          console.log("Validazione riuscita:", res.status);
          if (res.status === 200) {
            dispatch(setUser(user));
            // Il token è già gestito dall'interceptor, quindi non è necessario dispatchare setToken qui
          }
        })
        .catch((error) => {
          console.error("Errore nella validazione del token:", error);
          localStorage.removeItem(token);
          localStorage.removeItem(user);
          dispatch(logout());
        });
    };

    checkTokenValidity();
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MyHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-personal"
          element={
            <ProtectedRoute>
              <CapsulaPersonaleCreate />
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
