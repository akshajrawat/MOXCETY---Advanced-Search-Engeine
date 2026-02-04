import express from "express";
import { searchController } from "../controller/search-controller";

const router = express.Router();

// define the home page route
router.get("/search", searchController);

export default router;
