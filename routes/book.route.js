import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById
} from "../controllers/book.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, createBook);
router.get("/", isAuthenticated, getAllBooks);
router.get("/:id", isAuthenticated, getBookById);
router.put("/:id", isAuthenticated, updateBookById);
router.delete("/:id", isAuthenticated, deleteBookById);

export default router;
