(function () {
  'use strict';

  const { styles, convert, toPlainText } = window.MathematicalStr;
  const input = document.getElementById('input-text');
  const fullwidth = document.getElementById('convert-fullwidth');
  const plainButton = document.getElementById('plain-button');
  const clearButton = document.getElementById('clear-button');
  const exampleButton = document.getElementById('example-button');
  const status = document.getElementById('status');
  const results = document.getElementById('result');
  const cards = [];
  let copyRequest = 0;

  for (const style of styles) {
    const card = document.createElement('section');
    card.className = 'result-card';
    const heading = document.createElement('h3');
    heading.id = `heading-${style.id}`;
    heading.textContent = style.label;
    card.setAttribute('aria-labelledby', heading.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.textContent = 'コピー';
    button.setAttribute('aria-label', `${style.label}をコピー`);
    const output = document.createElement('p');
    output.id = `result-${style.id}`;
    output.className = 'result-text';
    output.dir = 'auto';
    output.tabIndex = 0;
    output.setAttribute('aria-labelledby', heading.id);
    button.setAttribute('aria-controls', output.id);
    const header = document.createElement('div');
    header.className = 'result-header';
    header.append(heading, button);
    card.append(header, output);
    results.append(card);
    const item = { style, output, button, text: '' };
    button.addEventListener('click', () => copyResult(item));
    cards.push(item);
  }

  function updateResults() {
    // Ignore a pending clipboard notification after the input has changed.
    copyRequest += 1;
    status.textContent = '';
    const text = input.value;
    for (const item of cards) {
      item.text = convert(text, item.style.id, fullwidth.checked);
      item.output.textContent = item.text;
      item.button.disabled = text.length === 0;
    }
    plainButton.disabled = toPlainText(text) === text;
    clearButton.disabled = text.length === 0;
    document.getElementById('empty-message').hidden = text.length !== 0;
  }

  function legacyCopy(text) {
    const active = document.activeElement;
    const selection = window.getSelection();
    const ranges = [];
    for (let i = 0; i < selection.rangeCount; i += 1) {
      ranges.push(selection.getRangeAt(i).cloneRange());
    }
    const field = document.createElement('textarea');
    field.className = 'clipboard-field';
    field.value = text;
    field.readOnly = true;
    field.setAttribute('aria-label', 'コピーする文字列');
    document.body.append(field);
    try {
      field.focus({ preventScroll: true });
      field.select();
      field.setSelectionRange(0, field.value.length);
      if (!document.execCommand('copy')) throw new Error('Copy unavailable');
    } finally {
      field.remove();
      active?.focus({ preventScroll: true });
      selection.removeAllRanges();
      for (const range of ranges) selection.addRange(range);
    }
  }

  async function copyResult(item) {
    const request = ++copyRequest;
    const text = item.text;
    status.textContent = '';
    try {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(text);
      } catch {
        legacyCopy(text);
      }
      if (request === copyRequest) status.textContent = `${item.style.label}をコピーしました。`;
    } catch {
      if (request !== copyRequest) return;
      const range = document.createRange();
      range.selectNodeContents(item.output);
      const selection = window.getSelection();
      item.output.focus({ preventScroll: true });
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'コピーできませんでした。選択された変換結果を手動でコピーしてください。';
    }
  }

  input.addEventListener('input', updateResults);
  fullwidth.addEventListener('change', updateResults);
  plainButton.addEventListener('click', () => {
    input.value = toPlainText(input.value);
    updateResults();
    input.focus({ preventScroll: true });
    status.textContent = '標準の英数字に戻しました。';
  });
  clearButton.addEventListener('click', () => {
    input.value = '';
    updateResults();
    input.focus({ preventScroll: true });
    status.textContent = '入力をクリアしました。';
  });
  exampleButton.addEventListener('click', () => {
    input.value = 'Hello 123\nABC xyz';
    updateResults();
    input.focus({ preventScroll: true });
  });
  // Browsers may restore form values when returning to the page.
  window.addEventListener('pageshow', updateResults);
  updateResults();
})();
