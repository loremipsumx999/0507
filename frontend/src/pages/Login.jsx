import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function Login({ setisLoggedIn }){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:4000/logUsers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            if (response.ok){
                alert('Sikeresen bejelentkezél');
                localStorage.setItem("token", data.token);
                setisLoggedIn(true);
                navigate("/");
            }
            else{
                setError(data.message);
            }
        }
        catch(err){
            setError('Hiba a bejelentkezésnél');
        }
    }

    return(
        <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Felhasználónév
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Col>
        </Form.Group>
  
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Jelszó
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Col>
        </Form.Group>
  
        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">Bejelentkezés</Button>
          </Col>
        </Form.Group>
      </Form>
    );
}