(function() {
  'use strict';
  const version = 'Version: 2022.05.26-b';

  window.addEventListener('load', init, false);

  let elemText;
  const elemResults = [];
  const kNum = 4;

  function init() {
    document.getElementById('versionInfo').innerText = version;
    
    elemText = document.getElementById('inputText');
    elemText.addEventListener('input', updateResult, false);
    for (let i = 1; i <= kNum; ++i) {
      elemResults[i] = document.getElementById(`result${i}`);
    }
    updateResult();
  }

  function updateResult() {
    const text = elemText.value;
    let resultTexts = [];
    for (let i = 1; i <= kNum; ++i) {
      resultTexts[i] = '';
    }

    for (const c of text) {
      const code = c.charCodeAt(0);
      if (0x41 <= code && code <= 0x5a) {
        resultTexts[1] += String.fromCharCode(55349) + String.fromCharCode(56320 + code - 0x41);
        resultTexts[2] += String.fromCharCode(55349) + String.fromCharCode(56424 + code - 0x41);
        resultTexts[3] += String.fromCharCode(55349) + String.fromCharCode(56528 + code - 0x41);
        resultTexts[4] += String.fromCharCode(55349) + String.fromCharCode(56684 + code - 0x41);
      } else if (0x61 <= code && code <= 0x7a) {
        resultTexts[1] += String.fromCharCode(55349) + String.fromCharCode(56346 + code - 0x61);
        resultTexts[2] += String.fromCharCode(55349) + String.fromCharCode(56450 + code - 0x61);
        resultTexts[3] += String.fromCharCode(55349) + String.fromCharCode(56554 + code - 0x61);
        resultTexts[4] += String.fromCharCode(55349) + String.fromCharCode(56710 + code - 0x61);
      } else {
        for (let i = 1; i <= kNum; ++i) {
          resultTexts[i] += c;
        }
      }
    }

    for (let i = 1; i <= kNum; ++i) {
      elemResults[i].innerText = resultTexts[i] == '' ? '　' : resultTexts[i];
    }
  }
})();
