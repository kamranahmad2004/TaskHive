import Category from "../models/Category.js";
import Tasks from "../models/Todo.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({
      name,
      user: req.user._id,
    });
    res.status(201).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create category", error: err.message });
  }
};

export const getUserCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort(
      "-createdAt"
    );
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findOne({
      _id: categoryId,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch category", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;
    const updated = await Category.findOneAndUpdate(
      { _id: categoryId, user: req.user._id },
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update category", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findOneAndDelete({
      _id: categoryId,
      user: req.user._id,
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Tasks.deleteMany({ category: categoryId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: err.message });
  }
};
