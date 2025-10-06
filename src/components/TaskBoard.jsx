// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { Plus, Edit2, Trash2, Calendar, Flag, FileText } from "lucide-react";
// import { format } from "date-fns";
// import { useApp } from "../context/AppContext";

// const priorityColors = {
//   low: "bg-gray-400",
//   medium: "bg-blue-500",
//   high: "bg-orange-500",
//   urgent: "bg-red-600",
// };

// function TaskCard({ task, index, onEdit, onDelete }) {
//   return (
//     <Draggable draggableId={task.id} index={index}>
//       {(provided, snapshot) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 transition-shadow hover:shadow-md ${
//             snapshot.isDragging ? "shadow-lg rotate-2" : ""
//           }`}
//         >
//           <div className="flex items-start justify-between mb-2">
//             <h4 className="font-semibold text-gray-900 flex-1">{task.title}</h4>
//             <div className="flex gap-1 ml-2">
//               <button
//                 onClick={onEdit}
//                 className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
//               >
//                 <Edit2 size={14} />
//               </button>
//               <button
//                 onClick={onDelete}
//                 className="p-1 text-gray-500 hover:text-red-600 transition-colors"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//           </div>

//           {task.description && (
//             <p className="text-sm text-gray-600 mb-2">{task.description}</p>
//           )}

//           <div className="flex items-center gap-2 flex-wrap">
//             <span
//               className={`${priorityColors[task.priority]} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}
//             >
//               <Flag size={10} />
//               {task.priority}
//             </span>
//             {task.dueDate && (
//               <span className="text-xs text-gray-500 flex items-center gap-1">
//                 <Calendar size={12} />
//                 {format(new Date(task.dueDate), "MMM dd")}
//               </span>
//             )}
//             {task.notes && (
//               <span className="text-xs text-gray-400 flex items-center gap-1">
//                 <FileText size={12} />
//                 Notes
//               </span>
//             )}
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// }

// function TaskColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }) {
//   const statusConfig = {
//     pending: { title: "Pending", color: "bg-gray-50 border-gray-300" },
//     ongoing: { title: "Ongoing", color: "bg-blue-50 border-blue-300" },
//     completed: { title: "Completed", color: "bg-green-50 border-green-300" },
//   };

//   const config = statusConfig[status];

//   return (
//     <div className="flex-1 min-w-[300px]">
//       <div className={`${config.color} p-3 rounded-lg border-2`}>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="font-bold text-gray-800 text-lg">{config.title}</h3>
//           <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-700">
//             {tasks.length}
//           </span>
//         </div>

//         <Droppable droppableId={status}>
//           {(provided, snapshot) => (
//             <div
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//               className={`min-h-[400px] transition-colors ${
//                 snapshot.isDraggingOver ? "bg-white/50 rounded-lg" : ""
//               }`}
//             >
//               {tasks.map((task, index) => (
//                 <TaskCard
//                   key={task.id}
//                   task={task}
//                   index={index}
//                   onEdit={() => onEditTask(task)}
//                   onDelete={() => onDeleteTask(task.id)}
//                 />
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>

//         <button
//           onClick={onAddTask}
//           className="w-full mt-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
//         >
//           <Plus size={18} />
//           Add Task
//         </button>
//       </div>
//     </div>
//   );
// }

// function TaskModal({ task, status, onClose, onSave }) {
//   const [formData, setFormData] = useState({
//     title: task?.title || "",
//     description: task?.description || "",
//     notes: task?.notes || "",
//     priority: task?.priority || "medium",
//     dueDate: task?.dueDate
//       ? format(new Date(task.dueDate), "yyyy-MM-dd")
//       : "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({
//       ...formData,
//       status: task?.status || status,
//       dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
//       orderIndex: task?.orderIndex || 0,
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {task ? "Edit Task" : "New Task"}
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Title
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               rows={3}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Priority
//               </label>
//               <select
//                 value={formData.priority}
//                 onChange={(e) =>
//                   setFormData({ ...formData, priority: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="urgent">Urgent</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Due Date
//               </label>
//               <input
//                 type="date"
//                 value={formData.dueDate}
//                 onChange={(e) =>
//                   setFormData({ ...formData, dueDate: e.target.value })
//                 }
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Notes
//             </label>
//             <textarea
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData({ ...formData, notes: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               rows={5}
//               placeholder="Add markdown notes here..."
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               {task ? "Update Task" : "Create Task"}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export function TaskBoard() {
//   const { tasks, moveTask, addTask, updateTask, deleteTask } = useApp();
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     task: null,
//     status: "pending",
//   });

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const { draggableId, destination } = result;
//     moveTask(draggableId, destination.droppableId, destination.index);
//   };

//   const getTasksByStatus = (status) =>
//     tasks
//       .filter((task) => task.status === status)
//       .sort((a, b) => a.orderIndex - b.orderIndex);

//   const handleSaveTask = (taskData) => {
//     if (modalState.task) {
//       updateTask(modalState.task.id, taskData);
//     } else {
//       addTask(taskData);
//     }
//   };

//   return (
//     <div className="h-full overflow-x-auto">
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="flex gap-6 p-6 min-w-max">
//           {["pending", "ongoing", "completed"].map((status) => (
//             <TaskColumn
//               key={status}
//               status={status}
//               tasks={getTasksByStatus(status)}
//               onAddTask={() =>
//                 setModalState({ isOpen: true, task: null, status })
//               }
//               onEditTask={(task) =>
//                 setModalState({ isOpen: true, task, status: task.status })
//               }
//               onDeleteTask={deleteTask}
//             />
//           ))}
//         </div>
//       </DragDropContext>

//       {modalState.isOpen && (
//         <TaskModal
//           task={modalState.task}
//           status={modalState.status}
//           onClose={() =>
//             setModalState({ isOpen: false, task: null, status: "pending" })
//           }
//           onSave={handleSaveTask}
//         />
//       )}
//     </div>
//   );
// }




// TaskBoard.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Edit2, Trash2, Calendar, Flag, FileText } from "lucide-react";
import { format } from "date-fns";
import { useApp } from "../context/AppContext";
import { notify } from "../utils/notify";

const priorityColors = {
  low: "bg-gray-400",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-600",
};

// ---------------- Task Card ----------------
function TaskCard({ task, index, onEdit, onDelete, toggleSubtask }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 transition-shadow hover:shadow-md ${snapshot.isDragging ? "shadow-lg rotate-1" : ""
            }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 flex-1">{task.title}</h4>
            <div className="flex gap-1 ml-2">
              <button onClick={onEdit} className="p-1 text-gray-500 hover:text-blue-600">
                <Edit2 size={14} />
              </button>
              <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}

          {/* Subtasks */}
          {task.subtasks?.length > 0 && (
            <ul className="ml-4 mb-2 list-disc text-sm text-gray-700 dark:text-gray-300">
              {task.subtasks.map((sub) => (
                <li
                  key={sub.id}
                  className={`flex items-center gap-2 ${sub.completed ? "line-through text-gray-400" : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => toggleSubtask(task.id, sub.id)}
                  />
                  {sub.title}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`${priorityColors[task.priority]} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}
            >
              <Flag size={10} /> {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                {format(new Date(task.dueDate), "MMM dd")}
              </span>
            )}
            {task.notes && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FileText size={12} /> Notes
              </span>
            )}
            {task.reminder && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                ⏰ {task.reminder}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ---------------- Task Column ----------------
function TaskColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask, toggleSubtask }) {
  const statusConfig = {
    pending: { title: "Pending", color: "bg-gray-50 border-gray-300" },
    ongoing: { title: "Ongoing", color: "bg-blue-50 border-blue-300" },
    completed: { title: "Completed", color: "bg-green-50 border-green-300" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`${config.color} p-3 rounded-lg border-2`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg">{config.title}</h3>
          <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-700">
            {tasks.length}
          </span>
        </div>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[400px] transition-colors ${snapshot.isDraggingOver ? "bg-white/50 rounded-lg" : ""
                }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task.id)}
                  toggleSubtask={toggleSubtask}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button
          onClick={onAddTask}
          className="w-full mt-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>
    </div>
  );
}

// ---------------- Task Modal ----------------
function TaskModal({ task, status, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    notes: task?.notes || "",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    subtasks: task?.subtasks || [],
    reminder: task?.reminder || "",
  });





  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      status: task?.status || status,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      orderIndex: task?.orderIndex || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{task ? "Edit Task" : "New Task"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subtasks</label>
            {formData.subtasks.map((s, idx) => (
              <div key={s.id} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => {
                    const newSubs = [...formData.subtasks];
                    newSubs[idx].title = e.target.value;
                    setFormData({ ...formData, subtasks: newSubs });
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="Subtask title"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, subtasks: formData.subtasks.filter((_, i) => i !== idx) })
                  }
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  subtasks: [...formData.subtasks, { id: crypto.randomUUID(), title: "", completed: false }],
                })
              }
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              + Add Subtask
            </button>
          </div>

          {/* Reminder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reminder (HH:MM)</label>
            <input
              type="time"
              value={formData.reminder}
              onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Add notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              {task ? "Update Task" : "Create Task"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------- TaskBoard ----------------
export function TaskBoard() {
  const { tasks, moveTask, addTask, updateTask, deleteTask } = useApp();
  const [modalState, setModalState] = useState({ isOpen: false, task: null, status: "pending" });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    moveTask(draggableId, destination.droppableId, destination.index);
  };




  useEffect(() => {
    // Request permission once when component mounts
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.reminder) {
          const { hours, minutes } = convertTo24Hour(task.reminder);
          if (now.getHours() === hours && now.getMinutes() === minutes) {
            notify("Task Reminder ⏰", task.title);
            dueNow.push(task.id);
          }
        }
      });
    }, 60000); // check every 1 minute

    return () => clearInterval(interval);
  }, [tasks]);


  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.orderIndex - b.orderIndex);

  const handleSaveTask = (taskData) => {
    if (modalState.task) updateTask(modalState.task.id, taskData);
    else addTask(taskData);
  };

  const toggleSubtask = (taskId, subId) => {
    const task = tasks.find((t) => t.id === taskId);
    const newSubs = task.subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s));
    updateTask(taskId, { subtasks: newSubs });
  };

  return (
    <div className="h-full overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 p-6 min-w-max">
          {["pending", "ongoing", "completed"].map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onAddTask={() => setModalState({ isOpen: true, task: null, status })}
              onEditTask={(task) => setModalState({ isOpen: true, task, status: task.status })}
              onDeleteTask={deleteTask}
              toggleSubtask={toggleSubtask}
            />
          ))}
        </div>
      </DragDropContext>

      {modalState.isOpen && (
        <TaskModal
          task={modalState.task}
          status={modalState.status}
          onClose={() => setModalState({ isOpen: false, task: null, status: "pending" })}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

