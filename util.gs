// GET時にURLパラメータを設定
function urlOf(url, params) {
  return `${url}?${Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;
}
