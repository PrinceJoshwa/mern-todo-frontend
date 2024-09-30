"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 

const backendURL = "https://mern-todo-backend-pink.vercel.app/tasks"; // Ensure this is the correct backend URL

const HomePage = () => {
  const [task, setTask] = useState(""); 
  const [tasks, setTasks] = useState([]); 
  const [isEditing, setIsEditing] = useState(false); 
  const [currentIndex, setCurrentIndex] = useState(null); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${backendURL}/tasks`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddOrUpdateTask = async () => {
    if (task.trim()) {
      if (isEditing) {
        const updatedTask = { description: task };
        try {
          await fetch(`${backendURL}/tasks/${tasks[currentIndex]._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
          });
          const updatedTasks = [...tasks];
          updatedTasks[currentIndex] = updatedTask;
          setTasks(updatedTasks);
          setIsEditing(false); 
          setTask("");
        } catch (error) {
          console.error("Error updating task:", error);
        }
      } else {
        const newTask = { description: task };
        try {
          const response = await fetch(`${backendURL}/tasks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const addedTask = await response.json();
          setTasks([...tasks, addedTask]);
          setTask(""); 
        } catch (error) {
          console.error("Error adding task:", error);
        }
      }
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].description); 
    setIsEditing(true); 
    setCurrentIndex(index); 
  };

  const handleDeleteTask = async (index) => {
    try {
      await fetch(`${backendURL}/tasks/${tasks[index]._id}`, {
        method: "DELETE",
      });
      const newTasks = tasks.filter((_, i) => i !== index); 
      setTasks(newTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">MERN ToDo App</h1>

      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center space-x-2">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1"
          />
          <Button onClick={handleAddOrUpdateTask} className="bg-blue-500 text-white">
            {isEditing ? "Update" : "Add"} 
          </Button>
        </div>

        <ul className="mt-6 space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
            >
              <span>{task.description}</span>
              <div className="space-x-2">
                <Button onClick={() => handleEditTask(index)} className="bg-green-500 text-white">
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteTask(index)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default HomePage;
