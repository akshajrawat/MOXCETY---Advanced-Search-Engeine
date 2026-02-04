import * as cheerio from "cheerio";
import axios from "axios";

export type CrawlDataType = {
  title: string;
  links: string[];
};

const invalidSchemes: string[] = [
  "#",
  "javascript:",
  "mailto:",
  "tel:",
  "sms:",
  "whatsapp:",
  "data:",
];

const checkInvalidUrl = (href: string) => {
  return invalidSchemes.some((scheme) => {
    return href.toLowerCase().startsWith(scheme);
  });
};

export const pageCrawler = async (url: string): Promise<CrawlDataType> => {
  const scrapedData: CrawlDataType = {
    title: "",
    links: [],
  };

  try {
    // get the html of the url
    const { data: HTML } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    //  get the title, anchor tag and the href attr using cheerio
    const $ = cheerio.load(HTML);
    const title: string = $("title").text().trim();
    scrapedData.title = title;
    $("a").each((_, anchorTag) => {
      const href = $(anchorTag).attr("href");

      if (href && !checkInvalidUrl(href)) {
        try {
          const validUrl = new URL(href, url).href;
          if (validUrl.startsWith("http")) {
            scrapedData.links.push(validUrl);
          }
        } catch (err) {}
      }
    });
  } catch (error) {
    console.error(
      `Error crawling ${url}: ${error instanceof Error ? error.message : error}`,
    );
  }

  return scrapedData;
};
