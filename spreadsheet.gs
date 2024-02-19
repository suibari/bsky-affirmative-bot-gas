function intialzeSheet() {
  const id_sheet = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

  const file = SpreadsheetApp.openById(id_sheet);
  const sheet = file.getSheetByName('followers');
  return sheet;
}

function insertDb(id, ) {
  const sheet = intialzeSheet();

  // 今の時間を取得
  const createdAt = new Date();
  // 書き込み用データの作成
  const createData = [id, createdAt];
  // 最終行の取得
  const lastRow = sheet.getLastRow();
  // 書き込み
  sheet.getRange(lastRow+1,1,1,2).setValues([createData]);
}

function selectDb(id) {
  const sheet = intialzeSheet();

  // 最終行の取得
  const lastRow = sheet.getLastRow();
  // getRangeでは0を指定することができなのでデータが存在しないことになる
  if(lastRow == 0) return;
  // データの取得
  const datas = sheet.getRange(1,1,lastRow, 2).getValues();
  // データの検索
  const data = datas.filter(value => {
    return value[0] == id;
  });
  if (data.length == 0) return;
  return data[0];
}

function updateDb(id) {
  const sheet = intialzeSheet();
  
  // 最終行の取得
  const lastRow = sheet.getLastRow();
  // getRangeでは0を指定することができなのでデータが存在しないことになる
  if(lastRow == 0) return false;
  // データの取得
  const datas = sheet.getRange(1,1,lastRow,2).getValues();
  // データの検索
  const dataIndex = datas.findIndex(value => {
    return (value[0] == id);
  })
  console.log(dataIndex);
  // データがマッチしない場合は除外
  if (dataIndex < 0) return false;
  // データアップデート
  const updatedAt = new Date();
  sheet.getRange(dataIndex+1,1,1,2).setValues([[id, updatedAt]]);
  return true;
}

function getRandomWord() {
  const id_sheet = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

  const file = SpreadsheetApp.openById(id_sheet);
  const sheet = file.getSheetByName('affirmative_word');
  
  // スプレッドシートA1~A100からランダムにテキストを持ってくる
  let rand = Math.random();
  rand = Math.floor(rand*100)+1; // 1~100のランダムな整数
  const text = sheet.getRange(rand, 1).getValue();
  return text;
}
