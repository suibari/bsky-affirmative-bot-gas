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
    this.countFetch = 1
    this.countRecord = 0;
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
    this.countFetch = this.countFetch + 1;
    this.countRecord = this.countRecord + 3;
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
    this.countFetch = this.countFetch + 1;
    this.countRecord = this.countRecord + 3;
    const responseJSON = JSON.parse(response.getContentText());
    console.log(responseJSON);
    return responseJSON;
  }

  // あいさつを返信
  replyGreets(replypost) {
    const url = 'https://bsky.social/xrpc/com.atproto.repo.createRecord';

    const text = "こんにちは！\n"+
                 "全肯定botたんです！\n"+
                 "これから"+replypost.author.displayName+"さんのポストに時々全肯定でリプライするよ！\n"+
                 "すぐには反応できないかもだけど許してね～。\n"+
                 "これからもよろしくね！";
    
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
    this.countFetch = this.countFetch + 1;
    this.countRecord = this.countRecord + 3;
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
    this.countFetch = this.countFetch + 1;
    const responseJSON = JSON.parse(response.getContentText());
    console.log(responseJSON);
    return responseJSON;
  }

  // フォロワーの配列を取得
  getFollowers() {
    let responseJSON = '';
    let followers = [];
    const url = 'https://bsky.social/xrpc/app.bsky.graph.getFollowers'

    const data = {
      'actor': this.did,
      'limit': 100
    };

    const options = {
      'method': 'get',
      'headers': {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
    };

    const response = UrlFetchApp.fetch(urlOf(url, data), options);
    this.countFetch = this.countFetch + 1;
    responseJSON = JSON.parse(response.getContentText());
    followers = followers.concat(responseJSON.followers);
    while ('cursor' in responseJSON) {
      const datawithcursor = {
        'actor': this.did,
        'limit': 100,
        'cursor': responseJSON.cursor
      };

      const response = UrlFetchApp.fetch(urlOf(url, datawithcursor), options);
      this.countFetch = this.countFetch + 1;
      responseJSON = JSON.parse(response.getContentText());
      followers = followers.concat(responseJSON.followers);
    }
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
    this.countFetch = this.countFetch + 1;
    const responseJSON = JSON.parse(response.getContentText());
    const feed = responseJSON.feed;
    console.log(feed);
    return feed;
  }

  isMention(post) {
    if ('facets' in post.record) {
      const facets = post.record.facets;
      for (const facet of facets) {
        for (const feature of facet.features) {
          if (feature.$type == 'app.bsky.richtext.facet#mention') {
            return true;
          }
        }
      }
    }
    return false;
  }

  getLatestAuthorFeed(author, feeds) {
    for (const feed of feeds) {
      if (author.did == feed.post.creator.did) {
        return feed;
      };
    };
    // feed0件や全てリポストなどの場合
    return;
  }

  getLatestAuthorFeedWithoutMention(author, feeds) {
    for (const feed of feeds) {
      if ((author.did == feed.post.author.did) && (!this.isMention(feed.post))) {
        return feed;
      };
    };
    // feed0件や全てリポストなどの場合
    return;
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
      },
      {
        '$type': 'app.bsky.richtext.facet#mention',
        'did': user.did
      }]
    }]
  }

  console.log(record);
  return record;
}
