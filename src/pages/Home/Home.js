import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sesión expirada, Vuelve a iniciar sesión");
        navigate("/");
        return;
      }

      try {
        const decodedToken = jwt_decode(token);
        const expiryTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (currentTime >= expiryTime) {
          localStorage.removeItem("token");
          alert("Tu sesión ha expirado vuelve a iniciar sesión");
          navigate("/");
        } else {
          setTimeout(checkTokenExpiration, expiryTime - currentTime);
        }
      } catch (error) {
        localStorage.removeItem("token");
        alert("Sesión  no valida,  Inicia sesión nuevamente.");
        navigate("/");
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-3xl font-bold text-gray-700">Pantalla de Home</h2>
        <p className="text-gray-600 mt-4">Estás autenticado correctamente.</p>
      </div>
    </div>
  );
};

export default Home;