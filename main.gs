// 定期実行タスク
// * その時点でのフォローしていないフォロワーをフォローする
//   Blueskyはユーザを何度もフォローできてしまうのでこうする(そのたびに通知が飛んでしまうのを防ぐ)
// * DBの時刻と最新ポストの時刻を比較し、後者が新しければ、そのポストにリプライする
function main() {
  agent = new BskyAgent();
  const followers = agent.getFollowers();
  for (follower of followers) {
    if (!selectDb(follower.did)) {
      // フォロー記録がなければフォロー
      agent.followSpecificUser(follower);
      // あいさつポスト
      agent.postGreets(follower);
      // DB記録
      insertDb(follower.did);
    } else {
      // フォロー記録があれば時刻比較
      const feed = agent.getAuthorFeed(follower);
      const row = selectDb(follower.did);
      const trigger = row[1]; // トリガー時刻
      console.log(trigger);
      const postedAt = new Date(feed[0].post.indexedAt); // ポスト時刻
      console.log(postedAt);
      if (trigger < postedAt) {
        Logger.log(follower.did+": detect new post!");
        // 前回トリガーを起算として新しいポストがあるので、反応してDB更新
        agent.replyAffermativeWord(feed[0].post);
        updateDb(follower.did);
      } else {
        Logger.log(follower.did+": not detect new post.");
      }
    }
  };
}
