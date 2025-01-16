document.addEventListener("DOMContentLoaded", () => {
    // Load tasks from localStorage on page load
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = storedTasks;
    updateTaskList();
    updateStats();
});

let tasks = [];

// Save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
// Initially hide the button
const deleteAllButton = document.getElementById('deleteAll');
deleteAllButton.style.display = 'none'; 

// Add a new task
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        updateTaskList();
        updateStats();
        saveTasks();
        deleteAllButton.style.display = 'block'; // Show the button
    }
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks();
};

// Edit an existing task
const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;

    // Remove the task from the list temporarily
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

// Delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

// Update progress and stats
const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById("progress");

    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completedTasks} / ${totalTasks}`;

    if (totalTasks === 0 || completedTasks === totalTasks) {
        deleteAllButton.style.display = 'none'; // Hide when no tasks or all completed
    } else {
        deleteAllButton.style.display = 'block'; // Show when tasks are pending
    }

    if (totalTasks > 0 && completedTasks === totalTasks) {
        blastConfetti();
        showCongratulations();
    }
};


// Function to show the congratulatory message
const showCongratulations = () => {
    const container = document.querySelector('.container');
    const congratsMessage = document.createElement('div');
    congratsMessage.className = 'congrats-message';
    congratsMessage.innerHTML = `
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You have successfully completed all your tasks!</p>
    `;

    container.appendChild(congratsMessage);

    // Remove the message after 5 seconds
    setTimeout(() => {
        congratsMessage.remove();
    }, 6000);
};

// Render the task list
const updateTaskList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="./image/edit.png" onclick="editTask(${index})" />
                    <img src="./image/bin.png" onclick="deleteTask(${index})" />
                </div>
            </div>
        `;

        // Bind event listener for checkbox
        listItem.querySelector(".checkbox").addEventListener('change', () => toggleTaskComplete(index));

        taskList.append(listItem);
    });
};

// Handle the "Add Task" button
document.getElementById('newTask').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent form submission
    addTask();
});

// Confetti celebration
const blastConfetti = () => {
    tsParticles.load("confetti-container", {
        particles: {
            number: { value: 100 },
            color: { value: ["#ff0000", "#00ff00", "#0000ff"] },
            shape: { type: "circle" },
        },
    });
};

// Delete all tasks
const deleteAllTasks = () => {
    tasks = []; // Clear the tasks array
    updateTaskList();
    updateStats();
    saveTasks();
    deleteAllButton.style.display = 'none'; // Hide the button
};

// Handle "Delete All" button click
document.getElementById('deleteAll').addEventListener('click', deleteAllTasks);

