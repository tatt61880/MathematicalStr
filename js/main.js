(function() {
  'use strict';
  const version = 'Version: 2022.05.28';

  window.addEventListener('load', init, false);

  let elemText;
  const elemResults = [];
  const codes = [
    [56320, 57294],
    [56424, 57294],
    [56528, 57294],
    [56684, 57294],
    [56736, 57314],
    [56788, 57324],
    [56840, 57314],
    [56892, 57324],
    [56944, 57334],
    [0, 57304],
  ];
  let typeNum = codes.length;

  function init() {
    document.getElementById('versionInfo').innerText = version;
    
    elemText = document.getElementById('inputText');
    elemText.addEventListener('input', updateResult, false);
    for (let i = 0; i < typeNum; ++i) {
      elemResults[i] = document.getElementById(`result${i}`);
    }
    updateResult();
  }

  function updateResult() {
    const text = elemText.value;
    let resultTexts = [];
    for (let i = 0; i < typeNum; ++i) {
      resultTexts[i] = '';
    }

    for (const c of text) {
      const code = c.charCodeAt(0);
      if (0x30 <= code && code <= 0x39) {
        for (let i = 0; i < typeNum; ++i) {
          resultTexts[i] += String.fromCharCode(55349) + String.fromCharCode(codes[i][1] + code - 0x30);
        }
      } else if (0x41 <= code && code <= 0x5a) {
        for (let i = 0; i < typeNum; ++i) {
          if (codes[i][0] != 0) {
            resultTexts[i] += String.fromCharCode(55349) + String.fromCharCode(codes[i][0] + code - 0x41);
          } else {
            resultTexts[i] += c;
          }
        }
      } else if (0x61 <= code && code <= 0x7a) {
        for (let i = 0; i < typeNum; ++i) {
          if (codes[i][0] != 0) {
            resultTexts[i] += String.fromCharCode(55349) + String.fromCharCode(codes[i][0] + 26 + code - 0x61);
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
