import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    status: false,
    token: null,
    username: null,
    id: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get(`http://localhost:3001/auth/auth`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            token: token,
          });
        });
      // Eğer localStorage'da bir token varsa, kullanıcının oturum açtığını varsay
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
