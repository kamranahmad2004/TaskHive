import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../services/categories/api.js";
import {
  useCreateTodo,
  useDeleteTodo,
  useTodosByCategory,
  useToggleTodo,
  useUpdateTodo,
} from "../services/todos/api.js";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiFileText,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function DashboardLayout() {
  const [showMore, setShowMore] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskPriority, setEditingTaskPriority] = useState("medium");

  const [renamingCatId, setRenamingCatId] = useState(null);
  const [renamingCatName, setRenamingCatName] = useState("");

  // Category hooks
  const { data: categories, isLoading: catLoading } = useCategories();
  const { mutate: createCategory, isPending: creatingCat } =
    useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: deletingCat } =
    useDeleteCategory();

  // Todo hooks
  const { data: todos, isLoading: todoLoading } =
    useTodosByCategory(selectedCategory);
  const { mutate: createTodo, isPending: creatingTodo } = useCreateTodo();
  const { mutate: updateTodo, isPending: updatingTodo } = useUpdateTodo();
  const { mutate: removeTodo, isPending: deletingTodo } = useDeleteTodo();
  const { mutate: toggleTodo } = useToggleTodo();

  const MAX_TASKS_SHOWN = 5;
  const showToggleButton = todos?.length > MAX_TASKS_SHOWN;

  const isTaskExpanded = (taskId) => expandedTasks[taskId];
  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Category logic
  const handleAddCategory = () => {
    if (!newCatName.trim()) {
      toast.error("Please add category first!");
      return;
    }
    createCategory(
      { name: newCatName.trim() },
      {
        onSuccess: () => {
          toast.success("Category added!");
          setNewCatName("");
        },
        onError: () => toast.error("Failed to add category"),
      }
    );
  };

  const handleRenameCategory = (catId) => {
    if (!renamingCatName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    updateCategory(
      { categoryId: catId, updates: { name: renamingCatName } },
      {
        onSuccess: () => {
          toast.success("Category renamed!");
          setRenamingCatId(null);
          setRenamingCatName("");
        },
        onError: () => toast.error("Failed to rename category"),
      }
    );
  };

  const handleDeleteCategory = (categoryId) => {
    if (!window.confirm("Delete this category and its tasks?")) return;
    deleteCategory(
      { categoryId },
      {
        onSuccess: () => {
          toast.success("Category deleted");
          if (selectedCategory === categoryId) setSelectedCategory(null);
        },
        onError: () => toast.error("Failed to delete category"),
      }
    );
  };

  // Task logic
  const handleAddTask = () => {
    if (!selectedCategory || !newTaskTitle.trim()) {
      toast.error("Add a task title first!");
      return;
    }
    createTodo(
      {
        categoryId: selectedCategory,
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
      },
      {
        onSuccess: () => {
          toast.success("Task added!");
          setNewTaskTitle("");
          setNewTaskPriority("medium");
        },
        onError: () => toast.error("Failed to add task"),
      }
    );
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditingTaskTitle(task.title);
    setEditingTaskPriority(task.priority || "medium");
  };

  const handleSaveTask = (taskId) => {
    if (!editingTaskTitle.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    updateTodo(
      {
        categoryId: selectedCategory,
        taskId,
        updates: {
          title: editingTaskTitle,
          priority: editingTaskPriority,
        },
      },
      {
        onSuccess: () => {
          toast.success("Task updated!");
          setEditingTaskId(null);
          setEditingTaskTitle("");
          setEditingTaskPriority("medium");
        },
        onError: () => toast.error("Failed to update task"),
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle("");
    setEditingTaskPriority("medium");
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    removeTodo(
      { categoryId: selectedCategory, taskId },
      {
        onSuccess: () => toast.success("Task deleted"),
        onError: () => toast.error("Failed to delete task"),
      }
    );
  };

  const handleToggleTask = (task) => {
    toggleTodo(
      {
        categoryId: selectedCategory,
        taskId: task._id,
        completed: !task.completed,
      },
      {
        onSuccess: () =>
          toast.success(
            `Marked as ${task.completed ? "incomplete" : "completed"}`
          ),
        onError: () => toast.error("Failed to toggle task"),
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="sm:text-3xl text-2xl font-bold mb-8 flex items-center gap-3">
          <FiFileText className="text-blue-500" />{" "}
          <span>TaskHive Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
          {/* Categories */}
          <div>
            <aside className="lg:col-span-1 bg-gray-800 p-5 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="flex mb-4">
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="New category"
                  className="w-full px-3 py-2 rounded-l bg-gray-700 text-white"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={creatingCat}
                  className="bg-blue-600 px-3 py-2 rounded-r hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiPlus />
                </button>
              </div>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {catLoading ? (
                  <p className="text-gray-400">Loading…</p>
                ) : (
                  categories?.map((cat) => (
                    <li
                      key={cat._id}
                      className={`flex items-center gap-2 px-3 py-2 rounded ${
                        selectedCategory === cat._id
                          ? "bg-blue-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {renamingCatId === cat._id ? (
                        <>
                          <input
                            value={renamingCatName}
                            onChange={(e) => setRenamingCatName(e.target.value)}
                            className="flex-1 bg-gray-800 text-white px-2 py-1 rounded outline-none"
                          />
                          <button
                            onClick={() => handleRenameCategory(cat._id)}
                            className="text-green-400"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => setRenamingCatId(null)}
                            className="text-red-400"
                          >
                            <FiX />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedCategory(cat._id)}
                            className="flex-1 text-left"
                          >
                            {cat.name}
                          </button>
                          <button
                            onClick={() => {
                              setRenamingCatId(cat._id);
                              setRenamingCatName(cat.name);
                            }}
                            className="text-blue-300"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-red-400"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </aside>
          </div>

          {/* Tasks */}
          <section className="lg:col-span-3 bg-gray-800 p-5 rounded-lg shadow">
            {!selectedCategory ? (
              <div className="text-center text-gray-400 py-20">
                Select a category
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Tasks in{" "}
                    {categories.find((c) => c._id === selectedCategory)?.name}
                  </h2>
                  <span className="text-sm text-gray-400">
                    {todos?.filter((t) => !t.completed).length || 0} pending,{" "}
                    {todos?.filter((t) => t.completed).length || 0} done
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New task"
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="px-3 py-2 pr-7 rounded bg-gray-700 text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button
                    onClick={handleAddTask}
                    disabled={creatingTodo}
                    className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-3">
                    {todoLoading ? (
                      <p className="text-gray-400">Loading tasks…</p>
                    ) : (
                      <>
                        {(showMore
                          ? todos
                          : todos?.slice(0, MAX_TASKS_SHOWN)
                        )?.map((task) => (
                          <div className="bg-gray-700 px-4 py-3 rounded flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                            {/* LEFT: checkbox, title or input, badge (in view mode) */}
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleToggleTask(task)}
                                  className="mt-1"
                                />

                                {editingTaskId === task._id ? (
                                  <input
                                    value={editingTaskTitle}
                                    onChange={(e) =>
                                      setEditingTaskTitle(e.target.value)
                                    }
                                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white w-full"
                                  />
                                ) : (
                                  <div className="flex flex-col">
                                    <span
                                      className={`break-words ${
                                        task.completed
                                          ? "line-through text-gray-400"
                                          : ""
                                      }`}
                                    >
                                      {isTaskExpanded(task._id) ||
                                      task.title.length <= 200
                                        ? task.title
                                        : task.title.slice(0, 200) + "..."}
                                    </span>
                                    {task.title.length > 200 && (
                                      <button
                                        onClick={() =>
                                          toggleTaskExpansion(task._id)
                                        }
                                        className="text-xs text-blue-400 hover:underline self-start"
                                      >
                                        {isTaskExpanded(task._id)
                                          ? "Show Less"
                                          : "Show More"}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Badge below title on small screens */}
                              {editingTaskId !== task._id && (
                                <div className="sm:hidden mt-1">
                                  <PriorityBadge priority={task.priority} />
                                </div>
                              )}
                            </div>

                            {/* RIGHT: Action Buttons + Badge/Select */}
                            <div className="flex items-center flex-wrap gap-2 mt-2 sm:mt-0 sm:flex-nowrap sm:justify-end">
                              {editingTaskId === task._id ? (
                                <>
                                  <select
                                    value={editingTaskPriority}
                                    onChange={(e) =>
                                      setEditingTaskPriority(e.target.value)
                                    }
                                    className="px-2 py-1 pr-6 bg-gray-800 border border-gray-600 rounded text-sm text-white"
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  <button
                                    onClick={() => handleSaveTask(task._id)}
                                    className="text-green-400"
                                  >
                                    <FiCheck />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-red-400"
                                  >
                                    <FiX />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <div className="hidden sm:block">
                                    <PriorityBadge priority={task.priority} />
                                  </div>
                                  <button
                                    onClick={() => handleEditTask(task)}
                                    className="text-blue-400"
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="text-red-400"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}

                        {showToggleButton && (
                          <div className="text-center mt-4">
                            <button
                              onClick={() => setShowMore((prev) => !prev)}
                              className="text-sm text-blue-400 hover:underline"
                            >
                              {showMore ? "Show Less" : "Show More"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// Priority badge
function PriorityBadge({ priority }) {
  const styles = {
    low: "bg-green-600/20 text-green-300 border-green-500/40",
    medium: "bg-blue-600/20 text-blue-300 border-blue-500/40",
    high: "bg-rose-600/20 text-rose-300 border-rose-500/40",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border ${
        styles[priority] || styles.medium
      }`}
    >
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
}
