import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "common_user"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/register", formData);
      alert(res.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
          <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;