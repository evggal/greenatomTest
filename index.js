//функция преобразования цвета из RGB в HSL взята с сайта https://www.30secondsofcode.org/js/s/rgb-to-hsl/
const RGBToHSL = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    return [
        60 * h < 0 ? 60 * h + 360 : 60 * h,
        100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        (100 * (2 * l - s)) / 2,
    ];
};


//window.localStorage.clear()
//проверяем есть ли список дел в localStorange, если нет, то создаём его
if (window.localStorage.getItem('todolist') == null) {
    window.localStorage.setItem('todolist', JSON.stringify([]));
}
//вытаскиваем из localStoragne список дел
const todolist = JSON.parse(window.localStorage.getItem('todolist'));

console.log(todolist)
//узнаём сегодняшнюю дату
let today = new Date;

//создаём заголовок страницы
let headline = document.createElement("h1");
headline.innerHTML = `Список дел на ${("0" + today.getDate()).slice(-2)}.${("0" + (today.getMonth() + 1)).slice(-2)}.${today.getFullYear()}`;

//создаём кнопку показа/скрытия формы добавления дела
let showFormButton = document.createElement("img");
showFormButton.id = "showFormButton";
showFormButton.src = './images/x.svg';
showFormButton.alt = 'Добавить дело';

//по клику поворачиваем плюсик в крестик и обратно
showFormButton.onclick = function () {
    if ("rotate(45deg)" == showFormButton.style.transform || "" == showFormButton.style.transform ) {
        showFormButton.style.transform = "rotate(90deg)";
        newTask.style.position = 'initial';
        newTask.style.opacity = "1";
    } else {
        showFormButton.style.transform = "rotate(45deg)";
        newTask.style.opacity = "0";
        setTimeout(() => { newTask.style.position = 'absolute'; }, 1000);
    }
}
//добавляем заголовок и картинку в header
header.appendChild(headline);
header.appendChild(showFormButton);

//по кнопке отправляем дело в массив дел и перезаписываем массив дел в localStorange
newTaskButton.onclick = function () {
    let task = document.forms.newTask;
    if (task.title.value != "") {
        let index = new Date().getTime();
        todolist.push({ id: index, color: task.color.value, title: task.title.value, description: task.description.value, time: task.time.value, group: task.group.value, status: true });
        window.localStorage.setItem('todolist', JSON.stringify(todolist))
    }

}

//достаём main из DOM
const main = document.getElementsByClassName('main')[0];

//массив соответствия group русской группе
const rus_group = {
    "": "",
    "work": " #работа",
    "study": " #учёба",
    "sport": " #спорт",
    "homework": " #домашние дела",
    "relax": " #отдых"
}

//сoртируем элементы сделано/не сделано
todolist.sort((a, b) => a.status > b.status ? -1 : 1)

//перебираем элемены в массиве дел и создаём карточки для каждого
todolist.forEach(elem => {
    //создаём теги
    let header = document.createElement('h2');
    let description = document.createElement('p');
    let time = document.createElement('div');
    let task_completed = document.createElement('button');
    let task_delete = document.createElement('button');
    let button_conteiner = document.createElement('div');
    let task = document.createElement('div');

    //наполняем текстовым содержимым
    header.innerHTML = elem.title + "<span class='main__span'>" + rus_group[elem.group] + "</span>";
    description.innerHTML = elem.description;
    time.innerHTML = elem.time;
    task_completed.innerHTML = "Выполнено";
    task_delete.innerHTML = "Удалить";

    //назначаем классы стилей
    header.classList = ['main__h2'];
    description.classList = ['main__p'];
    time.classList = ['main__time'];
    task_completed.classList = ['main__taskCompleted'];
    task_delete.classList = ['main__taskDelete'];
    button_conteiner.classList = 'main__buttonConteiner';
    task.classList = (elem.status == true) ? 'main__div' : 'main__div complete';

    //назначаем цвета
    let task_color = RGBToHSL(
        parseInt(String(elem.color[1]) + String(elem.color[2]), 16),
        parseInt(String(elem.color[3]) + String(elem.color[4]), 16),
        parseInt(String(elem.color[5]) + String(elem.color[6]), 16)
    );
    let border_color = `hsl(${task_color[0]}, ${task_color[1]}%, ${task_color[2]}%)`;
    let background_color = `hsl(${task_color[0]}, ${task_color[1]}%, 95%)`;
    task.style.setProperty('--color-border', border_color);
    task.style.setProperty('--color-background', background_color);

    //назначаем кнопкам функции
    //удаление дела
    task_delete.onclick = () => {
        let index = todolist.findIndex(el => el.id == elem.id);
        if (index != -1) {
            todolist.splice(index, 1);
            window.localStorage.setItem('todolist', JSON.stringify(todolist));
            document.getElementsByClassName('main__div')[index].remove()
        }
    }

    //выполнение задания
    task_completed.onclick = () => {
        let index = todolist.findIndex(el => el.id == elem.id);
        todolist[index].status = false;
        task.classList += ' complete';
        main.appendChild(task);
        window.localStorage.setItem('todolist', JSON.stringify(todolist));
    }

    //добавляем элементы в контейнер кнопок
    button_conteiner.appendChild(task_completed);
    button_conteiner.appendChild(task_delete);

    //формируем карточку дела
    task.appendChild(header)
    task.appendChild(description)
    task.appendChild(time)
    task.appendChild(button_conteiner)

    //добавляем карточку дела на экран, в список дел в конец списка
    main.appendChild(task);
});

//действия с элеентами
let honest_el = document.getElementsByClassName('nav__honest-el')[0]
let add_el = document.getElementsByClassName('nav__add-el')[0]
let first_el = document.getElementsByClassName('nav__first-el')[0]
let last_el = document.getElementsByClassName('nav__last-el')[0]

honest_el.onclick = () => {
    for (i = 1; i < todolist.length; i += 2) {
        let elem = document.getElementsByClassName('main__div')[i];
        if (elem.style.marginLeft == '20%' || elem.style.marginLeft == '') {
            elem.style.transition = '1s';
            elem.style.marginLeft = '40%';
        } else {
            elem.style.marginLeft = '20%';
        }
    }
}

add_el.onclick = () => {
    for (i = 0; i < todolist.length; i += 2) {
        let elem = document.getElementsByClassName('main__div')[i];
        if (elem.style.marginRight == '20%' || elem.style.marginRight == '') {
            elem.style.transition = '1s';
            elem.style.marginRight = '40%';
        } else {
            elem.style.marginRight = '20%';
        }
    }
}

first_el.onclick = () => {
    document.getElementsByClassName('main__div')[0].remove();
    todolist.splice(0,1);
    window.localStorage.setItem('todolist', JSON.stringify(todolist));
}

last_el.onclick = () => {
    document.getElementsByClassName('main__div')[todolist.length-1].remove();
    todolist.pop();
    window.localStorage.setItem('todolist', JSON.stringify(todolist));
}