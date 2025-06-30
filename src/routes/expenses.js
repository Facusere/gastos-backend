const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const expenseSchema = require('../db/expenseSchema');

// ✅ Categorías válidas
const CATEGORIAS_VALIDAS = ['Alimentación', 'Transporte', 'Compras', 'Salud', 'Otra'];

// GET /api/expenses/reports/monthly?month=YYYY-MM
router.get('/reports/monthly', async (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ error: 'Falta el parámetro "month"' });

  const { data, error } = await supabase
    .from('expenses')
    .select('categoria, monto')
    .like('fecha', `${month}%`);

  if (error) return res.status(500).json({ error: error.message });

  const resumen = data.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + parseFloat(gasto.monto);
    return acc;
  }, {});

  res.json(resumen);
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

    // ✅ Validar categoría
    const { categoria } = req.body;
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }

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

    // ✅ Validar categoría
    const { categoria } = req.body;
    if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }

    const { id } = req.params;
    const { data, error } = await supabase
      .from('expenses')
      .update({ ...req.body })
      .eq('id', id)
      .select()
      .single();

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

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const { month, category } = req.query;
    let query = supabase.from('expenses').select('*');

    if (month) {
      query = query.like('fecha', `${month}%`);
    }
    if (category && category !== 'Todas') {
      query = query.eq('categoria', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
