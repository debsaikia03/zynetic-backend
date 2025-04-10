import Book from "../models/book.model.js";

export const createBook = async (req, res) => {
    try {
        const { title, author, category, price, rating, publishedDate } = req.body;

        if (!title || !author || !category || !price || !rating || !publishedDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const book = await Book.create({ title, author, category, price, rating, publishedDate });
        res.status(201).json({
            success: true,
            message: "Book created successfully.",
            book
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }
};

export const getAllBooks = async (req, res) => {
    try {
        const { author, category, rating, title, page = 1, limit = 10, sortBy = "price", order = "asc" } = req.query;

        let query = {};

        if (author) query.author = author;
        if (category) query.category = category;
        if (rating) query.rating = { $gte: parseFloat(rating) };
        if (title) query.title = { $regex: title, $options: "i" };

        const sortOptions = {};
        if (["price", "rating"].includes(sortBy)) {
            sortOptions[sortBy] = order === "desc" ? -1 : 1;
        }

        const books = await Book.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Book.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            books
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};


export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book)
            return res.status(404).json({
                success: false,
                message: "Book not found!"
            });

        res.status(200).json({ success: true, book });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};

export const updateBookById = async (req, res) => {
    try {

        const updated = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({
                success: false,
                message: "Book not found!"
            });

        res.status(200).json({
            success: true,
            message: "Book updated.",
            book: updated
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};

export const deleteBookById = async (req, res) => {
    try {
        const deleted = await Book.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({
            success: false,
            message: "Book not found!"
        });

        res.status(200).json({
            success: true,
            message: "Book deleted."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error!"
        });
    }
};


