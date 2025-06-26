// Auto-Grow für Formular-Textareas
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// Auto-Grow für Vorschau-Boxen (.ability)
function autoGrowPreview(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

// Sync-Funktion: Formular → Vorschau + Auto-Grow der Vorschau
function sync(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  output.setAttribute('data-placeholder', output.textContent);

  input.addEventListener('input', () => {
    const val = input.value.trim();
    output.textContent = val || output.getAttribute('data-placeholder');
    autoGrowPreview(output);
  });

  autoGrowPreview(output);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) Auto-Grow für alle Textareas im Formular
  document.querySelectorAll('textarea').forEach(el => {
    autoGrow(el);
    el.addEventListener('input', () => autoGrow(el));
  });

  // 2) Name und Attacken synchronisieren
  sync('pName',    'outPName');
  sync('pAttack1', 'outAttack1');
  sync('pAttack2', 'outAttack2');

  // 3) HP-Eingabe: min=0 sicherstellen, Minus blockieren, clampen
  const hpInput  = document.getElementById('pHP');
  const hpOutput = document.getElementById('outPHP');

  // In HTML schon min="0", hier nochmal programmatisch
  hpInput.setAttribute('min', '0');
  hpInput.setAttribute('step', '1');

  // Verhindere Minus-, Plus- oder e-Eingabe
  const hpInput  = document.getElementById('pHP');
  const hpOutput = document.getElementById('outPHP');

hpInput.addEventListener('input', e => {
  // Entfernt alle Nicht-Ziffern, begrenzt auf 3 Stellen
  let cleaned = e.target.value.replace(/\D/g, '').slice(0, 3);
  // Leer → 0
  if (cleaned === '') cleaned = '0';
  e.target.value = cleaned;
  // Vorschau updaten
  hpOutput.textContent = 'HP ' + cleaned;
});

// Trigger direkt nach Laden, damit „HP 0“ angezeigt wird
hpInput.dispatchEvent(new Event('input'));


  // Bei Paste ebenfalls negatives abschneiden
  hpInput.addEventListener('paste', e => {
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    if (/^-/.test(paste)) e.preventDefault();
  });

  // Auf input clampen und Vorschau updaten
  hpInput.addEventListener('input', e => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) val = 0;
    e.target.value = val;
    hpOutput.textContent = 'HP ' + val;
  });

  // 4) Initial-Trigger für alle Inputs, damit Vorschau sofort stimmt
  ['pName','pAttack1','pAttack2','pHP'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
  });
});
