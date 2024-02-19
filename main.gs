// 定期実行タスク
// * その時点でのフォローしていないフォロワーをフォローする
//   Blueskyはユーザを何度もフォローできてしまうのでこうする(そのたびに通知が飛んでしまうのを防ぐ)
// * DBの時刻と最新ポストの時刻を比較し、後者が新しければ、そのポストにリプライする
function main() {
  const followers = getFollowers();
  for (follower of followers) {
    if (!selectDb(follower.did)) {
      // フォロー記録がなければフォロー
      followSpecificUser(follower);
      // DB記録
      insertDb(follower.did);
      // あいさつポスト
      postGreets(follower);
    } else {
      // フォロー記録があれば時刻比較
      const feed = getAuthorFeed(follower);
      const row = selectDb(follower.did);
      const trigger = row[1]; // トリガー時刻
      console.log(trigger);
      const postedAt = new Date(feed[0].post.indexedAt); // ポスト時刻
      console.log(postedAt);
      if (trigger < postedAt) {
        console.log("detect new post!");
        // 前回トリガーを起算として新しいポストがあるので、反応してDB更新
        replyAffermativeWord(feed[0].post);
        updateDb(follower.did);
      } else {
        console.log("not detect new post.");
      }
    }
  };
}
