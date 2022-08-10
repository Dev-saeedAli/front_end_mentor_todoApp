    // selectors
    let themes = document.querySelectorAll(".fa-solid");
    const container = document.querySelector(".container");
    const searchInputContainer = document.querySelector(".search");
    const todoContent = document.querySelectorAll(".todo-content");
    const filterBtn = document.querySelectorAll(".filter__btn");
    const filtersContainer = document.querySelector(".todoFilters");
    const todoInfos = document.querySelector(".todo__items__todo-info");
    const searchForm = document.querySelector(".search__form");
    const searchInput= searchForm.querySelector(".search__input-search");
    const todoLength = document.querySelector(".todo__left");
    const todoClear = document.querySelector(".todo__right");
    let currentDeviceTheme; //this is the device current theme
    
    // event listeners
    window.addEventListener("DOMContentLoaded", ()=>{
        getTodosFromLocal(null, "All") //getting todos from local storage and displaying in dom
        changeTheme() // changing theme everytime the window loads
    })
    themes.forEach(theme => {
        theme.addEventListener("click", ()=>{
         changeTheme()
        })
    })
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        addTodos()
        getTodosFromLocal(currentDeviceTheme, "All")
    })

    filterBtn.forEach(btn => {
        btn.addEventListener("click", (e)=>{
            filterBtn.forEach(item => item.classList.remove("active"))
            btn.classList.add("active")
            getTodosFromLocal(currentDeviceTheme, e.target.innerHTML)
        })
    })

    // functions

    // changing themes
    function changeTheme() {
       themes.forEach(theme => {
           if(theme.classList.value === "fa-solid fa-moon"){
               theme.classList.value = "fa-solid fa-sun"
               container.classList.remove("dark"),
               searchInputContainer.classList.remove("dark");
               todoInfos.classList.remove("dark");
               filtersContainer.classList.remove("dark");
               getTodosFromLocal("fa-solid fa-sun", "All")
               currentDeviceTheme = "fa-solid fa-sun"
            }else if(theme.classList.value === "fa-solid fa-sun"){
                theme.classList.value = "fa-solid fa-moon"
                container.classList.add("dark"),
                searchInputContainer.classList.add("dark");
                todoInfos.classList.add("dark");
                filtersContainer.classList.add("dark");
               getTodosFromLocal("fa-solid fa-moon", "All")
               currentDeviceTheme = "fa-solid fa-moon"
              }
       })
    }
    // addtodos to local storage
    const addTodos = () =>{
      let todoList;
      let todo = searchInput.value
      let localTodos = localStorage.getItem("todos"); 
      let todoObj = {
        todo : todo,
        status : "pending"
      }
      if(localTodos === "" || localTodos === null){
        todoList = []
      }else{
        todoList = JSON.parse(localTodos)
      }
      todoList.push(todoObj)
      localStorage.setItem("todos", JSON.stringify(todoList))

      searchInput.value = ""
    }
    // getting the todos from localstorage
    const getTodosFromLocal = (theme, option) => {
        let todoList = JSON.parse(localStorage.getItem("todos"))
        const todoContainer = document.querySelector(".todo__items-todo-list");
        let liTag = "";
        if(option === "All"){
                todoList?.map((todo, id) => {
                liTag += `
                <div class="todo-content ${theme === "fa-solid fa-sun" ? "" : "dark"}">
                   <i class="fa-solid ${todo.status === "completed" ? "fa-check" : "fa-circle"}"></i>
                   <span id=${id} onClick="saveTodos(${id}, '${theme}')" class="todo__items-todo__text ${todo.status === "completed" ? "active" : ""}">${todo.todo}</span>
                   <i class="fa-solid fa-close" onclick="deleteTodos(this)"></i>
                 </div>
                `
            })
            todoContainer.innerHTML = liTag
            }else if(option === "Completed"){
                todoList?.map((todo, id) => {
                    todo.status === "completed" ?
                    liTag += `
                    <div class="todo-content ${theme === "fa-solid fa-sun" ? "" : "dark"}">
                       <i class="fa-solid ${todo.status === "completed" ? "fa-check" : "fa-circle"}"></i>
                       <span id=${id} onClick="saveTodos(${id}, '${theme}')" class="todo__items-todo__text ${todo.status === "completed" ? "active" : ""}">${todo.todo}</span>
                       <i class="fa-solid fa-close" onclick="deleteTodos(this)"></i>
                     </div>
                     ` : ""
                    })
                    todoContainer.innerHTML = liTag
            }else if(option === "Active"){
                todoList?.map((todo, id) => {
                    todo.status === "pending" ?
                    liTag += `
                    <div class="todo-content ${theme === "fa-solid fa-sun" ? "" : "dark"}">
                       <i class="fa-solid ${todo.status === "completed" ? "fa-check" : "fa-circle"}"></i>
                       <span id=${id} onClick="saveTodos(${id}, '${theme}')" class="todo__items-todo__text ${todo.status === "completed" ? "active" : ""}">${todo.todo}</span>
                       <i class="fa-solid fa-close" onclick="deleteTodos(this)"></i>
                     </div>
                    ` : ""
                    })
                    todoContainer.innerHTML = liTag
                }
                
                const filteredPending = todoList?.filter(todo => todo.status === "pending")
                todoLength.innerHTML = `${localStorage.length !== 0 ? filteredPending?.length : 0} Items Left`
                searchInput.value = ""
    }

    // updating pending status in local storage
    const saveTodos = (id, color) => {
        let localTodos = JSON.parse(localStorage.getItem("todos")); 
        localTodos[id].status == "completed" ? localTodos[id].status = "pending" : localTodos[id].status = "completed"
        localStorage.setItem("todos", JSON.stringify(localTodos))
        getTodosFromLocal(color, "All")
    }

    // deleting the todos from localstorage and then loading the getTodosFromLocal function
    const deleteTodos = (elem) =>{
      let localTodos = JSON.parse(localStorage.getItem("todos")); 
      const element = elem.parentElement.children[1].innerHTML;
      const filteredTodo = localTodos.filter(item => item.todo !== element)
      localStorage.setItem("todos", JSON.stringify(filteredTodo))
      getTodosFromLocal(currentDeviceTheme, "All")
    }

    // clear all items in local storage and updating getTodosfromlocal func
    todoClear.addEventListener("click", ()=>{
        localStorage.clear()
        todoLength.innerHTML = `${localStorage.length} Items Left`
        getTodosFromLocal(currentDeviceTheme, "All")
    })
