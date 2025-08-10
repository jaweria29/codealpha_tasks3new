import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to backend Socket.io server
const socket = io("http://localhost:5000");

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("To-Do");

  useEffect(() => {
    socket.on("new-task", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    return () => {
      socket.off("new-task");
    };
  }, []);

  const createTask = () => {
    if (!title || !assignedTo) return alert("Please fill all fields");
    const newTask = {
      id: Date.now(),
      title,
      assignedTo,
      status,
    };
    socket.emit("create-task", newTask);
    setTitle("");
    setAssignedTo("");
    setStatus("To-Do");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        background: "linear-gradient(to right, #83a4d4, #b6fbff)",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#222" }}>📡 Real-time Task Updates</h1>

      {/* Task Form */}
      <div
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          margin: "1rem auto",
        }}
      >
        <h2>Create Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            margin: "0.5rem 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            margin: "0.5rem 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            margin: "0.5rem 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option>To-Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button
          onClick={createTask}
          style={{
            background: "#4CAF50",
            color: "white",
            padding: "0.7rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          ➕ Add Task
        </button>
      </div>

      {/* Task List */}
      <div
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "1rem auto",
        }}
      >
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center" }}>Waiting for tasks...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  background:
                    task.status === "Done"
                      ? "#d4edda"
                      : task.status === "In Progress"
                      ? "#fff3cd"
                      : "#f8d7da",
                  padding: "0.7rem",
                  borderRadius: "5px",
                  margin: "0.5rem 0",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <strong>{task.title}</strong> — {task.assignedTo} ({task.status})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
