const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const expenseSchema = require('../db/expenseSchema');

// GET /api/expenses?category=...&month=...
router.get('/', async (req, res) => {
  try {
    const { category, month } = req.query;
    let query = supabase.from('expenses').select('*');
    if (category) query = query.eq('categoria', category);
    if (month) query = query.ilike('fecha', `${month}-%`); // month: YYYY-MM
    const { data, error } = await query.order('fecha', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('expenses').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Gasto no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const { error: validationError } = expenseSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.details[0].message });
    const { data, error } = await supabase.from('expenses').insert([{ ...req.body }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const { error: validationError } = expenseSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.details[0].message });
    const { id } = req.params;
    const { data, error } = await supabase.from('expenses').update({ ...req.body }).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
