// 定期実行タスク
// * その時点でのフォローしていないフォロワーをフォローする
//   Blueskyはユーザを何度もフォローできてしまうのでこうする(そのたびに通知が飛んでしまうのを防ぐ)
// * DBの時刻と最新ポストの時刻を比較し、後者が新しければ、そのポストにリプライする
function main() {
  timer = new Timer();
  timer.tic();

  agent = new BskyAgent();
  const followers = agent.getFollowers();
  for (const follower of followers) {
    try {
      if (!selectDb(follower.did)) {
        Logger.log(follower.did+": follow newly!");
        // フォロー記録がなければフォロー
        agent.followSpecificUser(follower);
        // あいさつリプライ
        const feeds = agent.getAuthorFeed(follower);
        const feed = agent.getLatestAuthorFeedWithoutMention(follower, feeds)
        if (feed) {
          agent.replyGreets(feed.post);
        }
        // DB記録
        insertDb(follower.did);
      } else {
        // フォロー記録があれば時刻比較
        const feeds = agent.getAuthorFeed(follower);
        const feed = agent.getLatestAuthorFeedWithoutMention(follower, feeds);
        if (feed) {
          const row = selectDb(follower.did);
          const trigger = row[1]; // トリガー時刻
          console.log(trigger);
          const postedAt = new Date(feed.post.indexedAt); // ポスト時刻
          console.log(postedAt);
          if (trigger < postedAt) {
            Logger.log(follower.did+": detect new post!");
            // 前回トリガーを起算として新しいポストがあり、かつメンションでない
            agent.replyAffermativeWord(feed.post);
            updateDb(follower.did);  
          } else {
            Logger.log(follower.did+": not detect new post.");
          }
        }
      }
    } catch(err) {
      // エラー発生時はそのフォロワーだけスキップ
      console.error(err);
    }
  };

  const countFetch = agent.countFetch;
  const countRecord = agent.countRecord;
  const exectime = timer.toc();
  insertLog(followers.length, countFetch, countRecord, exectime);
  Logger.log("total number of fetch: "+countFetch);
  Logger.log("total exec time: "+exectime+"[s]");
}
