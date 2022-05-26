(function() {
  'use strict';
  const version = 'Version: 2022.05.26-c';

  window.addEventListener('load', init, false);

  let elemText;
  const elemResults = [];
  const codes = [
    56320,
    56424,
    56528,
    56684,
    56736,
    56788,
    56840,
    56892,
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
      if (0x41 <= code && code <= 0x5a) {
        for (let i = 0; i < typeNum; ++i) {
          resultTexts[i] += String.fromCharCode(55349) + String.fromCharCode(codes[i] + code - 0x41);
        }
      } else if (0x61 <= code && code <= 0x7a) {
        for (let i = 0; i < typeNum; ++i) {
          resultTexts[i] += String.fromCharCode(55349) + String.fromCharCode(codes[i] + 26 + code - 0x61);
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
