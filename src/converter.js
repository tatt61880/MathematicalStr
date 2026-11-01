(function () {
  'use strict';

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const ascii = alphabet + digits;
  const range = (start, length) => Array.from(
    { length }, (_, index) => String.fromCodePoint(start + index)
  ).join('');

  // Gaps in Mathematical Alphanumeric Symbols use Letterlike Symbols instead.
  // https://www.unicode.org/charts/PDF/U1D400.pdf
  const definitions = [
    ['bold', 'Mathematical Bold', 0x1d400, 0x1d7ce],
    ['italic', 'Mathematical Italic', 0x1d434, null, { h: 'ℎ' }],
    ['bold-italic', 'Mathematical Bold Italic', 0x1d468, 0x1d7ce],
    ['script', 'Mathematical Script', 0x1d49c, null, {
      B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
      e: 'ℯ', g: 'ℊ', o: 'ℴ',
    }],
    ['bold-script', 'Mathematical Bold Script', 0x1d4d0, 0x1d7ce],
    ['fraktur', 'Mathematical Fraktur', 0x1d504, null, {
      C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ',
    }],
    ['bold-fraktur', 'Mathematical Bold Fraktur', 0x1d56c, 0x1d7ce],
    ['double-struck', 'Mathematical Double-Struck', 0x1d538, 0x1d7d8, {
      C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ',
    }],
    ['sans-serif', 'Mathematical Sans-Serif', 0x1d5a0, 0x1d7e2],
    ['sans-serif-bold', 'Mathematical Sans-Serif Bold', 0x1d5d4, 0x1d7ec],
    ['sans-serif-italic', 'Mathematical Sans-Serif Italic', 0x1d608, 0x1d7e2],
    ['sans-serif-bold-italic', 'Mathematical Sans-Serif Bold Italic', 0x1d63c, 0x1d7ec],
    ['monospace', 'Mathematical Monospace', 0x1d670, 0x1d7f6],
    ['double-struck-digit', 'Double-Struck（数字のみ）', null, 0x1d7d8],
    ['circled', 'Circled（丸囲み）', 0x24b6, null],
    ['superscript', '上付き数字', null, null],
    ['subscript', '下付き数字', null, null],
  ];

  const maps = new Map();
  const reverse = new Map();
  const styles = definitions.map(([id, label, letterStart, digitStart, exceptions = {}]) => {
    const letters = letterStart === null ? alphabet : range(letterStart, 52);
    let numbers = digitStart === null ? digits : range(digitStart, 10);
    if (id === 'circled') numbers = '⓪' + range(0x2460, 9);
    if (id === 'superscript') numbers = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    if (id === 'subscript') numbers = '₀₁₂₃₄₅₆₇₈₉';

    const map = new Map();
    Array.from(letters + numbers).forEach((character, index) => {
      const source = ascii[index];
      const target = exceptions[source] ?? character;
      map.set(source, target);
      if (source !== target) reverse.set(target, source);
    });
    maps.set(id, map);
    return Object.freeze({ id, label });
  });

  function halfwidth(character) {
    const code = character.codePointAt(0);
    if ((code >= 0xff10 && code <= 0xff19) ||
        (code >= 0xff21 && code <= 0xff3a) ||
        (code >= 0xff41 && code <= 0xff5a)) {
      return String.fromCodePoint(code - 0xfee0);
    }
    return character;
  }

  function convert(text, styleId, includeFullwidth = false) {
    const map = maps.get(styleId);
    if (!map) throw new RangeError(`Unknown style: ${styleId}`);
    return Array.from(text, (character) => {
      const source = includeFullwidth ? halfwidth(character) : character;
      return map.get(source) ?? character;
    }).join('');
  }

  function toPlainText(text) {
    // Deliberately avoid NFKC: unrelated symbols, kana, and units must survive.
    return Array.from(text, (character) => reverse.get(character) ?? halfwidth(character)).join('');
  }

  const api = Object.freeze({ styles: Object.freeze(styles), convert, toPlainText });
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.MathematicalStr = api;
  }
})();
