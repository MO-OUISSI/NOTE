let tasks = [];

window.onload = function () {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
};

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isLocalStorageFull() {
    const data = JSON.stringify(localStorage);
    const sizeInBytes = new Blob([data]).size;
    const maxSizeInBytes = 5 * 1024 * 1024;

    return sizeInBytes >= maxSizeInBytes;
}

function previewImage(input) {
    const previewImage = document.getElementById('previewImage');
    const imageFile = input.files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };

        reader.readAsDataURL(imageFile);
    }
}

function addTask() {
    const taskInput = document.getElementById('task');
    const imageInput = document.getElementById('image');
    const previewImage = document.getElementById('previewImage');

    const taskText = taskInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!taskText && !imageFile) {
        alert('يرجى إدخال مهمة أو ملاحظة أو اختيار صورة');
        return;
    }

    const task = {
        text: taskText,
        image: '',
        entryDate: new Date().toLocaleString() // تاريخ الإدخال
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            task.image = e.target.result;

            tasks.unshift(task);
            saveTasks();
            displayTasks();
            taskInput.value = '';
            imageInput.value = '';
            previewImage.style.display = 'none';
        };

        reader.readAsDataURL(imageFile);
    } else {
        tasks.unshift(task);
        saveTasks();
        displayTasks();
        taskInput.value = '';
    }
}


function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const card = document.createElement('li');
        card.className = 'card';

        let imageHTML = '';

        if (task.image) {
            imageHTML = `<img src="${task.image}" alt="Task Image" class="img">`;
        }

        card.innerHTML = `
            <div class="entry-date">${task.entryDate}</div>
            <span>${task.text}</span>
            ${imageHTML}
            <div class="button-container">
                <button onclick="editTask(${index})" class="edit">edit</button>
                <button onclick="deleteTask(${index})" class="delete">delete</button>
            </div>
        `;
        taskList.appendChild(card);
    });
}

function editTask(index) {
    const newText = prompt('يرجى تعديل المهمة:', tasks[index].text);

    if (newText !== null) {
        const newImage = prompt('يرجى تعديل الصورة (ضع الرابط أو اتركه فارغاً للحفاظ على الصورة الحالية):', tasks[index].image);
        tasks[index].text = newText.trim();

        if (newImage.trim() !== '') {
            tasks[index].image = newImage;
        }

        saveTasks();
        displayTasks();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}
