(function() {
  'use strict';
  const version = 'Version: 2022.05.26';

  window.addEventListener('load', init, false);

  let elemText;
  let elemResultInfo;

  function init() {
    document.getElementById('versionInfo').innerText = version;
    
    elemText = document.getElementById('inputText');
    elemText.addEventListener('input', updateResult, false);
    elemResultInfo = document.getElementById('resultInfo');

    updateResult();
  }

  function updateResult() {
    const text = elemText.value;
    let resultText = '';

    // 𝓐𝓑𝓒
    // 𝓪
    for (const c of text) {
      const code = c.charCodeAt(0);
      if (0x41 <= code && code <= 0x5a) {
        resultText += String.fromCharCode(55349) + String.fromCharCode(56528 + code - 0x41);
      } else if (0x61 <= code && code <= 0x7a) {
        resultText += String.fromCharCode(55349) + String.fromCharCode(56554 + code - 0x61);
      } else {
        resultText += c;
      }
    }

    if (resultText == '') {
      elemResultInfo.innerText = '　';
    } else {
      elemResultInfo.innerText = resultText;
    }
  }
})();
