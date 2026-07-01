import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ needLogin: true }}
      />
    );
  }

  return children;
};

export default PrivateRoute;