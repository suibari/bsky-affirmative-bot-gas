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
    'record': createRecordUrl(text, user)
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

function testPostGreets() {
  const user = { 
    did: 'did:plc:uixgxpiqf4i63p6rgpu7ytmx',
    handle: 'suibari-cha.bsky.social',
    displayName: 'すいばり',
    avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:uixgxpiqf4i63p6rgpu7ytmx/bafkreifj3ckabgb5ebnt3nfmd2yc3ksx5va4dzqmcwgco3624q6m2tun2q@jpeg',
    viewer: 
     { muted: false,
       blockedBy: false,
       following: 'at://did:plc:qcwhrvzx6wmi5hz775uyi6fh/app.bsky.graph.follow/3klu4dch27m26',
       followedBy: 'at://did:plc:uixgxpiqf4i63p6rgpu7ytmx/app.bsky.graph.follow/3klqu5x6e6u2q' },
    labels: [],
    description: 'エンジニア&&絵描き&&ゲーマー\n年齢はHIKAKIN世代で、三人娘育児中\n\n🖼: https://www.pixiv.net/users/251033\n🔧: https://qiita.com/Suibari_cha\n🗒: https://note.com/suibari\n\n作ったもの\nNPB選手名鑑LINEbot: https://lin.ee/CqYJbKN\n全肯定Bsky bot: https://bsky.app/profile/suibari-bot.bsky.social',
    indexedAt: '2024-02-19T15:37:12.266Z' 
  };
  postGreets(user);
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

function createRecordUrl(text, user) {
  const text_firstblock = text.split('\n')[0];
  const linkEnd = getHalfLength(text_firstblock);
  const record = {
    'text': text,
    'createdAt': (new Date()).toISOString(),
    'facets': [{
      'index': {
        'byteStart': 0,
        'byteEnd': linkEnd
      },
      'features': [{
        '$type': 'app.bsky.richtext.facet#link',
        'uri': 'https://bsky.app/profile/'+user.handle
      }]
    }]
  }

  console.log(record);
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
