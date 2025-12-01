const express = require('express');
const router = express.Router();
const db = require('../db/memory');

router.get('/', (req, res) => res.json(db.list()));
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'invalid title' });
  const item = db.create(title);
  res.status(201).json(item);
});

module.exports = router;
