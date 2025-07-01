// server.js
const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = 3000;
const CARD_DIR = path.join(__dirname, 'gespeicherte_Karten');

// JSON-Parsen und statische Dateien ausliefern
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Ordner für gespeicherte Karten anlegen, falls er fehlt
if (!fs.existsSync(CARD_DIR)) fs.mkdirSync(CARD_DIR);

// 1) Karte speichern
app.post('/save-image', (req, res) => {
  const { filename, dataURL } = req.body;
  const base64 = dataURL.split(',')[1];
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFile(path.join(CARD_DIR, filename), buffer, err => {
    if (err) return res.status(500).json({ success:false, error: err.message });
    res.json({ success:true });
  });
});

// 2) Liste gespeicherter Karten
app.get('/list-cards', (_req, res) => {
  fs.readdir(CARD_DIR, (err, files) => {
    if (err) return res.status(500).json({ success:false, error: err.message });
    const pngs = files.filter(f=>f.toLowerCase().endsWith('.png'));
    res.json({ success:true, cards: pngs });
  });
});

// 3) Karten löschen
app.post('/delete-cards', (req, res) => {
  const { filenames } = req.body;
  const errors = [];
  filenames.forEach(fn => {
    try { fs.unlinkSync(path.join(CARD_DIR, fn)); }
    catch { errors.push(fn); }
  });
  if (errors.length) {
    return res.status(500).json({ success:false, error:`Konnte nicht löschen: ${errors.join(', ')}` });
  }
  res.json({ success:true });
});

// 4) Gespeicherte Karten statisch bedienen
app.use('/gespeicherte_Karten', express.static(CARD_DIR));

// Server starten
app.listen(PORT, () => {
  console.log(`🃏 Server läuft unter http://localhost:${PORT}`);
});
