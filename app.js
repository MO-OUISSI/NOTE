let tasks = [];

// تحميل المهام المحفوظة عند بدء التطبيق
window.onload = function () {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
};

function saveTasks() {
    // حفظ المهام في ذاكرة التخزين المحلية
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isLocalStorageFull() {
    const data = JSON.stringify(localStorage);
    const sizeInBytes = new Blob([data]).size;
    const maxSizeInBytes = 5 * 1024 * 1024; // حدود تخزين المتصفح الافتراضية (5 MB)

    return sizeInBytes >= maxSizeInBytes;
}

function previewImage(input) {
    const previewImage = document.getElementById('previewImage');

    const imageFile = input.files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // عرض الصورة المحددة مباشرة
            previewImage.src = e.target.result;
            previewImage.style.display = 'block'; // إظهار الصورة
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
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            task.image = e.target.result;

            tasks.push(task);
            saveTasks(); // حفظ المهام في ذاكرة التخزين المحلية
            displayTasks();
            taskInput.value = '';
            imageInput.value = '';

            // إخفاء الصورة بعد الإضافة
            previewImage.style.display = 'none';
        };

        reader.readAsDataURL(imageFile);
    } else {
        tasks.push(task);
        saveTasks(); // حفظ المهام في ذاكرة التخزين المحلية
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

        let imageHTML = '';  // يبدأ العنصر الفارغ

        if (task.image) {
            // إذا كان هناك صورة، يتم عرض العنصر
            imageHTML = `<img src="${task.image}" alt="Task Image" class="img">`;
        }

        card.innerHTML = `
            <span>${task.text}</span>
            ${imageHTML}
            <div class="button-container">
                <button onclick="editTask(${index})" class="edit">تعديل</button>
                <button onclick="deleteTask(${index})">حذف</button>
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

        saveTasks(); // حفظ المهام بعد التعديل
        displayTasks();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks(); // حفظ المهام بعد الحذف
    displayTasks();
}
