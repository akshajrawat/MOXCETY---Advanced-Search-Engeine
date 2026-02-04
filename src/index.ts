import { CrawlDataType, pageCrawler } from "./core/crawler";
import { addToQueue, getNextUrl, markAsCrawled } from "./db/query/queue";

const START_URL: string = "https://github.com/";

const startWorker = async (workerId: number) => {
  try {
    console.log(`WORKER STARTED >> ${workerId}`);
    while (true) {
      const currentUrl = await getNextUrl();

      if (!currentUrl) {
        console.log(">>> QUEUE EMPTY, WAITING FOR NEW WORK...");
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      console.log(`${workerId} is Crawling >> ${currentUrl}`);
      const data: CrawlDataType = await pageCrawler(currentUrl);

      // mark as crawled
      await markAsCrawled(currentUrl, data.title || "No Title");

      // feed more data
      if (data.links.length > 0) {
        console.log(`FOUND ${data.links.length} NEW LINKS`);
        await Promise.all(
          data.links.map((link) => {
            addToQueue(link);
          }),
        );
      }

      // wait for 1 sec
      await new Promise((r) => setTimeout(r, 1000));
    }
  } catch (error) {
    console.error(`WORKER ${workerId} CRASHED !!! >> ${error}`);
    await new Promise((r) => {
      setTimeout(r, 5000);
    });
  }
};

// STARTS 5 WORKER
const main = async () => {
  console.log("FEEDING INITIAL DATA...");
  await addToQueue(START_URL);

  const concurrency = 5;

  /**
   * Creating a thread of workers to keep them alive side by side
   */
  let workers = [];

  for (let i = 1; i <= concurrency; i++) {
    workers.push(startWorker(i));
  }

  await Promise.all(workers);
};

main();
