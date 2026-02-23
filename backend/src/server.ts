import "dotenv/config";
import cors from "cors";
import express from "express";
import { contactRouter } from "./routes/contact.js";
import { ordersRouter } from "./routes/orders.js";
import { productsRouter } from "./routes/products.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/contact", contactRouter);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
