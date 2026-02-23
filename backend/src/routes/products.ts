import { Router } from "express";
import { products } from "../data/store.js";

export const productsRouter = Router();

productsRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    data: products,
  });
});
