const form = document.getElementById('task-form')
const taskList = document.getElementById('task-list')
const taskText = document.getElementById('task-text')
// Siempre que se capture un template se tiene que acceder a su contenido
const template = document.getElementById('template-alert').content
// Fragment es
const fragment = document.createDocumentFragment()

let tasks = {

    // 1605987141804 : {
    //     id : 1605987141804,
    //     text : 'Tarea #1',
    //     status : false
    // },
    // 1605987194696 : {
    //     id : 1605987194696,
    //     text : 'Tarea #2',
    //     status : false,
    // }

}

// Agregamos el evento DOMContentLoaded que se activa una vez que se ha cargado todo el documento HTML
document.addEventListener('DOMContentLoaded', () => {

    // Verificamos si existen las tareas en el local storage, si es así las asignamos a nuestra
    // colección de tareas
    if(localStorage.getItem('tasks')){
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    
    printTasks()
})

// Detecateremos el evento click en el div task-list
taskList.addEventListener('click', event => {
    btnAction(event)
})

form.addEventListener('submit', event => {
    event.preventDefault()
    // 3 ways to get form  data from DOM
    // console.log(event.target[0].value)
    // console.log(event.target.querySelector('input').value)
    // console.log(taskText.value)
    addTask()
})

/**
 * 
 * @param {*} e 
 */
const addTask = e => {

    // Validamos que no venga vacío el contenido
    if(taskText.value.trim() === ''){
        console.log('Vacío')
        return
    }

    const task = {
        id : Date.now(),
        text : taskText.value,
        status : false
    }
    
    // Also I can deconstruct the object
    // tasks[task.id] = { ...task}
    tasks[task.id] = task

    // reset() reestablece todo el formulario
    form.reset()
    // focus() mantiene siempre el focus en el input, aún cuando ya se ha enviado algo antes
    taskText.focus()

    printTasks()
    
}

const printTasks = () => {

    // Guardando las tareas en el local storage
    localStorage.setItem('tasks', JSON.stringify(tasks))

    // Si la colección de objetos está vacía mandamos una alerta
    if(Object.values(tasks).length === 0){
        taskList.innerHTML = `
        <div class="alert alert-dark text-center">
            No pending tasks
        </div>
        `
        return
    }

    // Limpiamos el contenido del div task-list en el DOM
    taskList.innerHTML = ''
    // Con Objet.values() podemos usar las funciones de los array en los objetos
    Object.values(tasks).forEach( task => {

        // Debemos de clonar el template para empezar a modificarlo
        const clone = template.cloneNode(true)

        // Modificamos el contenido
        clone.querySelector('p').textContent = task.text

        if(task.status){
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-success')
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            clone.querySelectorAll('.fas')[0].classList.replace('text-success', 'text-primary')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        // Con esto agregamos id dentro del html
        clone.querySelectorAll('.fas')[0].dataset.id = task.id
        clone.querySelectorAll('.fas')[1].dataset.id = task.id
        // Anexamos el template clonado
        fragment.appendChild(clone)

    })
    taskList.appendChild(fragment)
}

// Delegaremos la acción según el botón seleccionado
const btnAction = event => {

    if(event.target.classList.contains('fa-check-circle')){

        tasks[event.target.dataset.id].status = true

    }

    if(event.target.classList.contains('fa-minus-circle')){

        // La función delete borraa un objeto de una lista de objetos pasandole el id
        delete tasks[event.target.dataset.id]
        
    }

    if(event.target.classList.contains('fa-undo-alt')){

        tasks[event.target.dataset.id].status = false   

    }

    printTasks()

    // stopPropagation detiene todos los demás event listeners que haya a continuación
    event.stopPropagation();
}