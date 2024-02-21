// GET時にURLパラメータを設定
function urlOf(url, params) {
  return `${url}?${Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;
}

// 文字列のバイト取得
function getHalfLength(str) {
  let len = 0;
  let escapeStr = encodeURI(str);
  for (let i = 0; i < escapeStr.length; i++, len++) {
    if (escapeStr.charAt(i) == "%") {
      if (escapeStr.charAt(++i) == "u") {
        i += 3;
        len++;
      }
      i++;
    }
  }
  return len;
}

function test() {
  const text = "@suibari\nこんにちは！";
  const text_arr = text.split('\n');
  const result = getHalfLength(text_arr[0]);
  console.log(result);
}