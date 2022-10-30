(function() {
  'use strict';
  const version = 'Version: 2022.10.30';

  window.addEventListener('load', init, false);

  let elemText;
  const elemResults = [];
  const codes = [
    // [1バイト目, 英, 数]
    [55349, 56320, 57294],
    [55349, 56424, 57294],
    [55349, 56528, 57294],
    [55349, 56684, 57294],
    [55349, 56736, 57314],
    [55349, 56788, 57324],
    [55349, 56840, 57314],
    [55349, 56892, 57324],
    [55349, 56944, 57334],
    [55349, 0, 57304],
    [0, 9398, 9450, 9311],
  ];
  const typeNum = codes.length;

  function init() {
    document.getElementById('version-info').innerText = version;

    elemText = document.getElementById('input-text');
    elemText.addEventListener('input', updateResult, false);
    for (let i = 0; i < typeNum; ++i) {
      elemResults[i] = document.getElementById(`result${i}`);
    }
    updateResult();
  }

  function updateResult() {
    const text = elemText.value;
    const resultTexts = [];
    for (let i = 0; i < typeNum; ++i) {
      resultTexts[i] = '';
    }

    for (const c of text) {
      const code = c.charCodeAt(0);
      if (0x30 <= code && code <= 0x39) {
        for (let i = 0; i < typeNum; ++i) {
          if (codes[i][0] == 0) {
            if (code == 0x30) {
              resultTexts[i] += String.fromCharCode(codes[i][2] + code - 0x30);
            } else {
              resultTexts[i] += String.fromCharCode(codes[i][3] + code - 0x30);
            }
          } else {
            resultTexts[i] += String.fromCharCode(codes[i][0]) + String.fromCharCode(codes[i][2] + code - 0x30);
          }
        }
      } else if (0x41 <= code && code <= 0x5a) {
        for (let i = 0; i < typeNum; ++i) {
          if (codes[i][0] == 0) {
            resultTexts[i] += String.fromCharCode(codes[i][1] + code - 0x41);
          } else if (codes[i][1] != 0) {
            resultTexts[i] += String.fromCharCode(codes[i][0]) + String.fromCharCode(codes[i][1] + code - 0x41);
          } else {
            resultTexts[i] += c;
          }
        }
      } else if (0x61 <= code && code <= 0x7a) {
        for (let i = 0; i < typeNum; ++i) {
          if (codes[i][0] == 0) {
            resultTexts[i] += String.fromCharCode(codes[i][1] + 26 + code - 0x61);
          } else if (codes[i][1] != 0) {
            resultTexts[i] += String.fromCharCode(codes[i][0]) + String.fromCharCode(codes[i][1] + 26 + code - 0x61);
          } else {
            resultTexts[i] += c;
          }
        }
      } else {
        for (let i = 0; i < typeNum; ++i) {
          resultTexts[i] += c;
        }
      }
    }

    for (let i = 0; i < typeNum; ++i) {
      elemResults[i].innerText = resultTexts[i] == '' ? '　' : resultTexts[i];
    }
  }
})();
