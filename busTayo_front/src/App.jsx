// src/App.jsx

import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import Join from './auth/join';
import { AuthProvider } from "./auth/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;