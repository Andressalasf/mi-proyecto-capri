import express from "express";
import cors from "cors";
import pool from "./config/database.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req: Request, res: Response) => {
  const {
    code,
    first_name,
    middle_name,
    last_name,
    surname,
    phone,
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO USUARIOS 
        (code, first_name, middle_name, last_name, surname, phone, email, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        code,
        first_name,
        middle_name || null,
        last_name,
        surname,
        phone,
        email,
        hashedPassword,
      ]
    );

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: result.rows[0],
    });
  } catch (error: unknown) {
    console.error("❌ Error al registrar:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

app.listen(4000, () => {
  console.log("✅ Backend corriendo en http://localhost:4000");
});
