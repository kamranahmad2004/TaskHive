import Tasks from "../models/Todo.js";

export const createTodo = async (req, res) => {
  try {
    const { title, priority, category } = req.body;
    const { categoryId } = req.params;
    const todo = await Tasks.create({
      title,
      priority,
      category: categoryId,
      user: req.user._id,
    });

    res.status(201).json(todo);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create todo", error: err.message });
  }
};

export const getTodosByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const todos = await Tasks.find({
      user: req.user._id,
      category: categoryId,
    }).sort("-createdAt");

    res.status(200).json(todos);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch todos", error: err.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { categoryId, taskId } = req.params;

    const todo = await Tasks.findOne({
      _id: taskId,
      category: categoryId,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch todo", error: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { categoryId, taskId } = req.params;
    const updates = req.body;
    const todo = await Tasks.findOneAndUpdate(
      { _id: taskId, category: categoryId, user: req.user._id },
      updates,
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update todo", error: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { categoryId, taskId } = req.params;

    const todo = await Tasks.findOneAndDelete({
      _id: taskId,
      category: categoryId,
      user: req.user._id,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete todo", error: err.message });
  }
};
