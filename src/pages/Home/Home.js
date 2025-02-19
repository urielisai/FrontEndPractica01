import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Sesión expirada. Vuelve a iniciar sesión.");
        navigate("/");
        return;
      }

      try {
        console.log(localStorage.getItem("token"));
        const decodedToken = jwt_decode(token);
        const expiryTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        // Si el token ha expirado, eliminarlo y redirigir al login
        if (currentTime >= expiryTime) {
          localStorage.removeItem("token");
          alert("Tu sesión ha expirado, vuelve a iniciar sesión.");
          navigate("/");
          return;
        }

        // Consultar API protegida para obtener los datos del usuario
        const res = await axios.get("http://localhost:5001/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data.user);

        // Calcular el tiempo restante para que expire el token y programar su eliminación
        const timeUntilExpiry = expiryTime - currentTime;
        if (timeUntilExpiry > 0) {
          setTimeout(() => {
            localStorage.removeItem("token");
            alert("Tu sesión ha expirado, vuelve a iniciar sesión.");
            navigate("/");
          }, timeUntilExpiry);
        }
      } catch (error) {
        console.error("Error en la autenticación:", error);
        localStorage.removeItem("token");
        alert("Sesión no válida, inicia sesión nuevamente.");
        navigate("/");
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-3xl font-bold text-gray-700">Pantalla de Home</h2>
        {userData ? (
          <p className="text-gray-600 mt-4">Bienvenido, {userData.email}</p>
        ) : (
          <p className="text-gray-600 mt-4">A la poderosa página</p>
        )}
        <button
          className="mt-4 bg-red-500 text-white p-2 rounded"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Home;