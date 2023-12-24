import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    status: false,
    token: null,
    username:null
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Eğer localStorage'da bir token varsa, kullanıcının oturum açtığını varsay
      setAuthState({ status: true, token: token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
