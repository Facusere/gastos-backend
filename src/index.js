require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expensesRouter = require('./routes/expenses');
const reportsRouter = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expensesRouter);
app.use('/api/reports', reportsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
