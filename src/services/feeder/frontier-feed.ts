import { createQueue, QUEUE_NAMES } from "../../lib/queue";
import crypto from "crypto";

const frontierQueue = createQueue(QUEUE_NAMES.FRONTIER);

export const addUrlToFrontier = async (url: string) => {
  console.log(` Adding to Queue >> ${url}`);
  const safeId = crypto.createHash("md5").update(url).digest("hex");
  await frontierQueue.add(
    "crawl-job",
    {
      url: url,
      depth: 0,
    },
    {
      jobId: safeId,
      removeOnComplete: true,
    },
  );
};

