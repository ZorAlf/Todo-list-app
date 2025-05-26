class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskListElement = document.getElementById('taskList');
        this.taskInputElement = document.getElementById('taskInput');
        this.taskDateElement = document.getElementById('taskDate');
        this.renderTasks();

        // Bind event listener for Enter key
        this.taskInputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const taskText = this.taskInputElement.value.trim();
        const taskDate = this.taskDateElement.value;
        if (taskText === '' || taskDate === '') {
            alert('Harap masukkan tugas dan tanggal!');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            date: taskDate,
            completed: false,
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.clearInputs();
    }

    toggleTaskCompletion(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    updateTask(id) {
        const task = this.getTaskById(id);
        const newText = prompt('Masukkan teks tugas baru:', task.text);
        if (newText !== null && newText.trim() !== '') {
            this.tasks = this.tasks.map(task =>
                task.id === id ? { ...task, text: newText.trim() } : task
            );
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            const li = this.taskListElement.querySelector(`li[data-id="${id}"]`);
            li.style.animation = 'slideOut 0.3s ease-out';
            li.addEventListener('animationend', () => {
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.saveTasks();
                this.renderTasks();
            }, { once: true });
        }
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    clearInputs() {
        this.taskInputElement.value = '';
        this.taskDateElement.value = '';
    }

    renderTasks() {
        this.taskListElement.innerHTML = '';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onclick="taskManager.toggleTaskCompletion(${task.id})">
                <span>${task.text} (Due: ${task.date})</span>
                <div>
                    <button class="edit" onclick="taskManager.updateTask(${task.id})">Edit</button>
                    <button onclick="taskManager.deleteTask(${task.id})">Hapus</button>
                </div>
            `;
            this.taskListElement.appendChild(li);
        });
    }
}

const taskManager = new TaskManager();