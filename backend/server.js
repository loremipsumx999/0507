import express from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 4000;

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "reactasd"
});

app.post('/regUsers', async (req, res) => {
    const { username, password, phone_number } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [req.body.username]);
        if (users.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        else {
            const hash = await argon2.hash(password);
            await db.query("INSERT INTO users (username, password, phone_number) VALUES (?, ?, ?)", [username, hash, phone_number]);
            res.status(201).json({ message: "Jó minden!" });
        }
    }
    catch (err) {
        console.error("Valami hiba történt a regisztráció közben! ", err);
        res.status(500).json({ message: "Valami hiba történt a regisztráció közben!" });
    }
});

app.post('/logUsers', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Hibás felhasználónév" });
        }
        const isMatch = await argon2.verify(users[0].password, password);
        if (!isMatch) {
            return res.status(400).json({ message: "Nem megfelelő a jelszó!" })
        }
        const token = jwt.sign({ id: users[0].id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
        res.status(200).json({ message: "Sikeres bejelentkezés!" });
        console.log(token);
    }
    catch (err) {
        console.log("Hiba a bejelentkezés során: ", err);
        res.status(500).json({ message: "Hiba a bejelentkezésnél." });
    }
});

app.get('/user', async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const [user] = await db.query("SELECT * FROM users WHERE id = ? ", [decoded.id]);

            if (users.length === 0) {
                return res.status(404).json({ message: "Nincs ilyen felhasználó!" });
            }
            else {
                return res.status(200).json({ id: users[0].id, username: users[0].username, phone_number: users[0].phone_number });
            }
        }
        catch (err) {
            console.log("Szerveroldali hiba: ", err);
            res.status(500).json({ message: "Szerver hiba!" });
        }
    }
    else {
        return res.status(401).json({ message: "Hitelesítés sikertelen: Nincs token." });

    }
});

app.put('/updateUsers', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Hiányzó token" })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const [users] = await db.query("SELECT * FROM users WHERE id = ? ", [decoded.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: "Nincs ilyen felhasználó" });
        }
        else {
            return res.status(200).json(users[0]);
        }
        const { username, password, phone_number } = req.body;
        if (!username || !password || !phone_number) {
            res.status(400).json({ message: "Minden mező kitöltése szükséges!" });
        }
        const hash = argon2.hash(password);
        await db.query("UPDATE users SET username = ?, password = ?, phone_number = ?", {username, hash, phone_number});
        res.status(201).json({ message: "Sikeresen frissítve!" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});