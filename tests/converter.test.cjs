const test = require('node:test');
const assert = require('node:assert/strict');
const { styles, convert, toPlainText } = require('../src/converter.js');
const original = require('./fixtures/original.json');

for (const [id, expected] of Object.entries(original.outputs)) {
  test(`original output is preserved: ${id}`, () => {
    assert.equal(convert(original.input, id), expected);
  });
}

test('style IDs are unique', () => {
  assert.equal(new Set(styles.map(({ id }) => id)).size, styles.length);
});

test('Unicode exceptions use the assigned Letterlike Symbols', () => {
  assert.equal(convert('h', 'italic'), 'ℎ');
  assert.equal(convert('BEFHILMRego', 'script'), 'ℬℰℱℋℐℒℳℛℯℊℴ');
  assert.equal(convert('CHIRZ', 'fraktur'), 'ℭℌℑℜℨ');
  assert.equal(convert('CHNPQRZ', 'double-struck'), 'ℂℍℕℙℚℝℤ');
  assert.equal(convert('Az09', 'double-struck'), '𝔸𝕫𝟘𝟡');
});

test('every supported letter and digit round-trips without collisions', () => {
  for (const { id } of styles) {
    const output = convert(original.input, id);
    assert.equal(Array.from(output).length, 62, id);
    assert.equal(new Set(output).size, 62, id);
    assert.equal(toPlainText(output), original.input, id);
  }
});

test('new styles without dedicated digits leave digits unchanged', () => {
  for (const id of ['italic', 'script', 'fraktur']) {
    assert.equal(convert('0123456789', id), '0123456789');
  }
});

test('fullwidth conversion is optional and only affects letters and digits', () => {
  for (const { id } of styles) {
    const fullwidth = Array.from(original.input, (c) => String.fromCodePoint(c.codePointAt(0) + 0xfee0)).join('');
    assert.equal(convert(fullwidth, id), fullwidth, id);
    assert.equal(convert(fullwidth, id, true), convert(original.input, id), id);
  }
  assert.equal(convert('Ａｚ０９＋　ｶﾞ', 'bold', true), '𝐀𝐳𝟎𝟗＋　ｶﾞ');
  assert.equal(toPlainText('Ａｚ０９＋　ｶﾞ'), 'Az09＋　ｶﾞ');
});

test('line breaks, whitespace, emoji, combining marks and non-Latin characters survive', () => {
  const text = '\n \t日本語 が か\u3099 😀 👨‍👩‍👧‍👦 🇯🇵 𝛼 ∑ ≤ ㍑ Ⅳ \r\n';
  for (const { id } of styles) {
    assert.equal(convert(text, id, true), text, id);
  }
  assert.equal(toPlainText(text), text);
  assert.equal(convert('A\nB\n', 'bold'), '𝐀\n𝐁\n');
});

test('decorated characters and exponents are only restored explicitly', () => {
  const text = '𝐀ℂℎ x² H₂O ⓩ 𝟡';
  assert.equal(convert(text, 'bold'), '𝐀ℂℎ 𝐱² 𝐇₂𝐎 ⓩ 𝟡');
  assert.equal(toPlainText(text), 'ACh x2 H2O z 9');
  assert.equal(toPlainText(toPlainText(text)), toPlainText(text));
});

test('empty strings and unknown styles are handled explicitly', () => {
  for (const { id } of styles) assert.equal(convert('', id), '');
  assert.equal(toPlainText(''), '');
  assert.throws(() => convert('abc', 'missing'), RangeError);
});
