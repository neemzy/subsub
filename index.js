const fs = require("fs");
const cp = require("child_process");
const request = require("request");
const qs = require("qs");
const notifier = require("node-notifier");
const config = require("./config");
const filePath = "./latest.json";
let latest = {};

try {
  latest = JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }));
} catch (error) {}

Promise.all(config.subs.map(sub => {
  const q = sub.q.toLowerCase();

  const params = {
    key: config.key,
    channelId: sub.channelId,
    part: "snippet",
    order: "date",
    maxResults: 5,
    q
  };

  return new Promise(resolve => {
    request(
      `https://www.googleapis.com/youtube/v3/search?${qs.stringify(params)}`,
      { json: true },
      (err, res, body) => {
        if (err) {
          notifier.notify({
            title: "An error occurred",
            message: err.toString()
          });
        } else {
          const currentLatest = body.items.filter(item => item.snippet.title.toLowerCase().includes(q)).shift();

          if (currentLatest && latest[sub.channelId] !== currentLatest.id.videoId) {
            latest[sub.channelId] = currentLatest.id.videoId;

            notifier.on("click", () => {
              cp.spawn("open", [`https://www.youtube.com/watch?v=${currentLatest.id.videoId}`]);
            });

            notifier.notify({
              title: `NEW "${q}" VIDEO!`,
              message: currentLatest.snippet.title
            });
          }
        }

        resolve();
      }
    );
  });
})).then(() => {
  fs.writeFileSync(filePath, JSON.stringify(latest), { encoding: "utf8" });
});
