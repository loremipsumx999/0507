import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function LogoutButton({ setisLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setisLoggedIn(false);
    navigate("/");
  };

  return (
    <Button variant="outline-light" onClick={handleLogout}>
      Kijelentkezés
    </Button>
  );
}
