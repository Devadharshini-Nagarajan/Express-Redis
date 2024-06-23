const redis = require("redis");

async function nodeRedisDemo() {
  try {
    const client = redis.createClient();
    await client.connect();

    await client.set("aaa", "Hello from node redis");
    const myKeyValue = await client.get("aaa");
    console.log(myKeyValue);
    const myKeyValueold = await client.get("mykey");
    console.log(myKeyValueold);

    const numAdded = await client.zAdd("vehicles", [
      {
        score: 4,
        value: "car",
      },
      {
        score: 2,
        value: "bike",
      },
    ]);
    console.log(`Added ${numAdded} items.`);

    for await (const { score, value } of client.zScanIterator("vehicles")) {
      console.log(`${value} -> ${score}`);
    }

    await client.quit();
  } catch (e) {
    console.error(e);
  }
}

module.exports = nodeRedisDemo;
