import React, { useState, useEffect } from "react";

export default function Profile(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));

    const showUserProfile = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/loadUsers", {
            headers: {
                "Authorization": "Bearer " + token,
            }
        });
        const data = await response.json();

        if (!response.ok){
            alert("Hiba a felhasználó adatai betöltésekor")
        }
        setUsername(data.username);
        setPhone_number(data.phone_number);
    };

    const updateUserProfile = async (e) =>{
        e.preventDefault();
        const response = await fetch("http://localhost:4000/updateUsers", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, phone_number }),
        });
        if (!response.ok){
            alert("Hiba a felhasználó adatainak frissítésekor");
        }
        else{
            alert("Sikeresen frissítettük a profilodat");
        }
    }
    return(
        <>
            <h1>Profil</h1>
            <form onSubmit={updateUserProfile}>
                <label htmlFor="username">Felhasználónév</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /><br />

                <label htmlFor="phoneNumber">Telefonszám</label>
                <input type="text" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} /><br />

                <label htmlFor="password">Jelszó</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
            </form>
        </>
    )
}