const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// GET /api/reports/monthly?month=YYYY-MM
router.get('/monthly', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'El parámetro month es requerido (YYYY-MM)' });
    const { data, error } = await supabase
      .from('expenses')
      .select('categoria, monto, fecha')
      .ilike('fecha', `${month}-%`);
    if (error) throw error;
    // Agrupar por categoría y sumar montos
    const report = {};
    data.forEach(({ categoria, monto }) => {
      report[categoria] = (report[categoria] || 0) + Number(monto);
    });
    res.json({ month, report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
