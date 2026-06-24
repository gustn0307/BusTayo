// src/App.jsx

import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import Join from './auth/join';

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;