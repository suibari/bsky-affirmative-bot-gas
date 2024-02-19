// Bearer取得
function createSession() {
  const url = 'https://bsky.social/xrpc/com.atproto.server.createSession';
  const prop = PropertiesService.getScriptProperties().getProperties();

  const data = {
    'identifier': prop.BSKY_USERNAME,
    'password': prop.BSKY_APP_PASSWORD,
  };

  const options = {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    'payload': JSON.stringify(data),
  };

  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

// 全肯定を投稿
function replyAffermativeWord(replypost) {
  const session = createSession();
  const jwt = session.accessJwt;
  const did = session.did;

  const url = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

  const text = getRandomWord();
  
  const data = {
    'repo': did,
    'collection': 'app.bsky.feed.post',
    'record': createRecordReply(text, replypost)
  };

  const options = {
    'method': 'post',
    'headers': {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'payload': JSON.stringify(data),
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseJSON = JSON.parse(response.getContentText());
  console.log(responseJSON);
  return responseJSON;
}

// あいさつを投稿
function postGreets(user) {
  const session = createSession();
  const jwt = session.accessJwt;
  const did = session.did;

  const url = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

  const text = "@"+user.handle+"\n"+
               "こんにちは！\n"+
               "全肯定botたんです！\n"+
               "あなたのポストに全肯定でリプライするよ！\n"+
               "すぐには反応できないかもだけど許してね～。\n"+
               "これからもよろしくね！";
  
  const data = {
    'repo': did,
    'collection': 'app.bsky.feed.post',
    'record': createRecord(text)
  };

  const options = {
    'method': 'post',
    'headers': {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'payload': JSON.stringify(data),
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseJSON = JSON.parse(response.getContentText());
  console.log(responseJSON);
  return responseJSON;
}

function createRecord(text) {
  const record = {
    'text': text,
    'createdAt': (new Date()).toISOString(),
  }

  return record;
}

function createRecordReply(text, replypost) {
  const record = {
    'text': text,
    'createdAt': (new Date()).toISOString(),
    'reply': {
      'root': {
        'uri': replypost.uri,
        'cid': replypost.cid
      },
      'parent':{
        'uri': replypost.uri,
        'cid': replypost.cid
      }
    }
  }

  return record;
}

// 指定ユーザをフォロー
function followSpecificUser(user) {
  const session = createSession();
  const jwt = session.accessJwt;
  const did = session.did;

  const url = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

  const data = {
    'repo': did,
    'collection': 'app.bsky.graph.follow',
    'record': {
      'subject': user.did,
      'createdAt': new Date()
    },
  };

  const options = {
    'method': 'post',
    'headers': {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'payload': JSON.stringify(data),
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseJSON = JSON.parse(response.getContentText());
  console.log(responseJSON);
  return responseJSON;
}

// フォロワーの配列を取得
function getFollowers() {
  const session = createSession();
  const jwt = session.accessJwt;
  const did = session.did;
  
  const url = 'https://bsky.social/xrpc/app.bsky.graph.getFollowers'

  const data = {
    'actor': did
  };

  const options = {
    'method': 'get',
    'headers': {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
  };

  const response = UrlFetchApp.fetch(urlOf(url, data), options);
  const responseJSON = JSON.parse(response.getContentText());
  const followers = responseJSON.followers;
  console.log(followers);
  return followers;
}

// 指定ユーザのタイムライン取得
function getAuthorFeed(user) {
  const session = createSession();
  const jwt = session.accessJwt;
  const did = session.did;

  const url = 'https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed';

  const data = {
    'actor': user.did,
    'filter': "posts_no_replies"
  };

  const options = {
    'method': 'get',
    'headers': {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
  };

  const response = UrlFetchApp.fetch(urlOf(url, data), options);
  const responseJSON = JSON.parse(response.getContentText());
  const feed = responseJSON.feed;
  console.log(feed);
  return feed;
}
