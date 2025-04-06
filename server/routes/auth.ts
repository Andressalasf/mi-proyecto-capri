// src/routes/auth.ts
import { Router } from "express";
import pool from "../config/database";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req, res) => {
  const {
    code,
    firstName,
    lastName,
    surname,
    phone,
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO USUARIOS (code, first_name, last_name, surname, phone, email, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [code, firstName, lastName || null, surname, phone, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado con éxito", user: result.rows[0] });
  } catch (error: unknown) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

export default router;
