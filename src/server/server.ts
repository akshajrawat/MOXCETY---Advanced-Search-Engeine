import express from "express";
import cors from "cors";
import searchRoutes from "./routes/search-routes";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Routes
app.use("/api", searchRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
