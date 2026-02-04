import { Request, Response } from "express";
import { getPages } from "../../db/query/get-pages";

/**
 * 
 * @param req
 * @param res 
 * @returns JSON of all the 
 */
export const searchController = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;

    if (!query) {
      res.status(400).json({ error: "Missing Query field q" });
      return;
    }

    const offset = (page - 1) * 10;

    const searchResult = await getPages(query, offset);

    if (!searchResult || searchResult.length === 0) {
      res.json({
        message: `No result found for query :- ${query}`,
      });
      return;
    }

    return res.json({
      page: page,
      count: searchResult.length,
      data: searchResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
