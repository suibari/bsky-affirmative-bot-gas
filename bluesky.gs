class BskyAgent {
  // Bearer取得
  constructor() {
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
    this.countRecord = 1;
    const session = JSON.parse(response.getContentText());
    this.jwt = session.accessJwt;
    this.did = session.did;
  }

  // 全肯定を投稿
  replyAffermativeWord(replypost) {
    const url = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

    let text = getRandomWord();
    text = text.replace("${name}", replypost.author.displayName);
    
    const data = {
      'repo': this.did,
      'collection': 'app.bsky.feed.post',
      'record': createRecordReply(text, replypost)
    };

    const options = {
      'method': 'post',
      'headers': {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      'payload': JSON.stringify(data),
    };

    const response = UrlFetchApp.fetch(url, options);
    this.countRecord++;
    const responseJSON = JSON.parse(response.getContentText());
    console.log(responseJSON);
    return responseJSON;
  }

  // あいさつを投稿
  postGreets(user) {
    const url = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

    const text = "@"+user.handle+"\n"+
                "こんにちは！\n"+
                "全肯定botたんです！\n"+
                "あなたのポストに全肯定でリプライするよ！\n"+
                "すぐには反応できないかもだけど許してね～。\n"+
                "これからもよろしくね！";
    
    const data = {
      'repo': this.did,
      'collection': 'app.bsky.feed.post',
      'record': createRecordUrl(text, user)
    };

    const options = {
      'method': 'post',
      'headers': {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      'payload': JSON.stringify(data),
    };

    const response = UrlFetchApp.fetch(url, options);
    this.countRecord++;
    const responseJSON = JSON.parse(response.getContentText());
    console.log(responseJSON);
    return responseJSON;
  }

  // 指定ユーザをフォロー
  followSpecificUser(user) {
    const url = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

    const data = {
      'repo': this.did,
      'collection': 'app.bsky.graph.follow',
      'record': {
        'subject': user.did,
        'createdAt': new Date()
      },
    };

    const options = {
      'method': 'post',
      'headers': {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      'payload': JSON.stringify(data),
    };

    const response = UrlFetchApp.fetch(url, options);
    this.countRecord++;
    const responseJSON = JSON.parse(response.getContentText());
    console.log(responseJSON);
    return responseJSON;
  }

  // フォロワーの配列を取得
  getFollowers() {
    const url = 'https://bsky.social/xrpc/app.bsky.graph.getFollowers'

    const data = {
      'actor': this.did
    };

    const options = {
      'method': 'get',
      'headers': {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
    };

    const response = UrlFetchApp.fetch(urlOf(url, data), options);
    this.countRecord++;
    const responseJSON = JSON.parse(response.getContentText());
    const followers = responseJSON.followers;
    console.log(followers);
    return followers;
  }

  // 指定ユーザのタイムライン取得
  getAuthorFeed(user) {
    const url = 'https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed';

    const data = {
      'actor': user.did,
      'filter': "posts_no_replies"
    };

    const options = {
      'method': 'get',
      'headers': {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
    };

    const response = UrlFetchApp.fetch(urlOf(url, data), options);
    this.countRecord++;
    const responseJSON = JSON.parse(response.getContentText());
    const feed = responseJSON.feed;
    console.log(feed);
    return feed;
  }
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
