const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { email, password } = req.body;
  // Verificar si ya existe
  const { data: existing } = await supabase.from('users').select('*').eq('email', email).single();
  if (existing) return res.status(409).json({ error: 'El usuario ya existe' });
  // Hash de contraseña
  const hash = await bcrypt.hash(password, 10);
  const { data, error: dbError } = await supabase.from('users').insert([{ email, password: hash }]).select().single();
  if (dbError) return res.status(500).json({ error: dbError.message });
  res.status(201).json({ id: data.id, email: data.email });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { email, password } = req.body;
  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) return res.status(401).json({ error: 'Usuario no registrado' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No autorizado' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const { email, password } = req.body;
    const update = { email };
    if (password) update.password = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('users').update(update).eq('id', payload.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    // Nuevo token si cambió el email
    const newToken = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
