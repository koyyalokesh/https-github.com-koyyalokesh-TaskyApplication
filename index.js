const state = {
    taskList: [],
  };
  
  // dom manipulations
  const taskModal = document.querySelector(".task__modal__body");
  const taskContents = document.querySelector(".task__contents");
  
  
  // template for the card on UI
  const htmlTaskContent = ({ id, title, description, type, url }) => `
            
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
      <div class='card shadow-sm task__card' style:"background-color:black">
        <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
          <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
            <i class='fas fa-pencil-alt' name=${id}></i>
          </button>
          <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
            <i class='fas fa-trash-alt' name=${id}></i>
          </button>
        </div>
        <div class='card-body'>
          ${
            url
              ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
              : `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
          }
          <h4 class='task__card__title'>${title}</h4>
          <div class='tags text-white d-flex flex-wrap'>
            <span class='badge bg-primary m-1'>${type}</span>
          </div>
          <p class='description trim-3-lines text-muted' data-gram_editor='false'>
           ${description}
          </p>
          
        </div>
        <div class='card-footer'>
          <button 
          type='button' 
          class='btn btn-outline-primary float-right' 
          data-bs-toggle='modal'
          data-bs-target='#showTask'
          id=${id}
          onclick='openTask.apply(this, arguments)'>
            Open Task
          </button>
        </div>
      </div>
    </div>
  `;
  
  // card body displays when we click the open task
  const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
  <div id = ${id}>
  ${
    url
      ? `<img width='100%' src=${url} alt='card image here  class='img-fluid place__holder__image mb-3'/>`
      : `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
  }
  <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${title}</h2>
  <p class='lead'>${description}</p>
  
  </div>`;
  };
  
  // here we will be updating our local storage (cards which we see on our ui)
  //and converting the json data to string 
  
  const updateLocalStorage = () => {
    localStorage.setItem(
      "task",
      JSON.stringify({
        tasks: state.taskList,
      })
    );
  };
  
  // to get data or card or modals on ur ui from local storage (Browsers storage)
  // and converting the string to json 
  const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);
  
    if (localStorageCopy) state.taskList = localStorageCopy.tasks;
  
    state.taskList.map((cardDate) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
  };
  
  const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
      url: document.getElementById("imageUrl").value,
      title: document.getElementById("taskTitle").value,
      type: document.getElementById("tags").value,
      description: document.getElementById("taskDescription").value,
    };
    if (input.title === "" || input.type === "" || input.description === "") {
      return alert("Please Fill All The Fields");
    }
    taskContents.insertAdjacentHTML(
      "beforeend",
      htmlTaskContent({
        ...input,
        id,
      })
    );
  
    // updated task list
    state.taskList.push({ ...input, id });
  
    // update the same on localStorage too
    updateLocalStorage();

    document.getElementById("imageUrl").value="";
    document.getElementById("taskTitle").value="";
    document.getElementById("tags").value="";
    document.getElementById("taskDescription").value="";
  };

  //click of open task
  const openTask = (e)=>{
    //if(!e) e = window.event;
    const getTask = state.taskList.find(({id}) => id === e.target.id);
    taskModal.innerHTML =htmlModalContent(getTask);

  };

  const deleteTask = (e) =>{
   // if(!e) e = window.event;
    const targetID = e.target.getAttribute('name');
    //console.log(targetID);
    const type = e.target.tagName;
    //console.log(type);
    const removeTask = state.taskList.filter(({id}) => id !== targetID);
   // console.log(removeTask);
   // console.log(e.target.parentNode.parentNode.parentNode.parentNode);
    updateLocalStorage();

    if(type === "BUTTON"){
      return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode
      );
    }
    else if(type === "I"){
      return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode
      );
    }
    

  };

  //edit task
  const editTask = (e)=>{
    if(!e) e = window.event;
    const targetID = e.target.id;
    //console.log(targetID);
    const type = e.target.tagName;
    //console.log(type);
    let parent_Node;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;
    
    if (type === "BUTTON"){
      parent_Node = e.target.parentNode.parentNode;
    }
    else if (type === "I"){
      parent_Node = e.target.parentNode.parentNode.parentNode;
    }
    taskTitle =  parent_Node.childNodes[3].childNodes[3];
    //console.log(taskTitle);
    taskType = parent_Node.childNodes[3].childNodes[5];
    taskDescription = parent_Node.childNodes[3].childNodes[7];
    console.log(taskDescription);
    submitButton = parent_Node.childNodes[5].childNodes[1];
    taskTitle.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Task";
    
  }
  // save edit 
  const saveEdit =(e)=>{
    if(!e) e =window.event;
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskType = parentNode.childNodes[3].childNodes[5];
    const taskDescription = parentNode.childNodes[3].childNodes[7];
    
    const submitButton = parentNode.childNodes[5].childNodes[1];
  
   
  
    const updatedData = {
      taskTitle: taskTitle.innerHTML,
      taskDescription: taskDescription.innerHTML,
      taskType: taskType.innerHTML,
    };
  
    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) =>
      task.id === targetID
        ? {
            id: task.id,
            title: updatedData.taskTitle,
            description: updatedData.taskDescription,
            type: updatedData.taskType,
            url: task.url,
          }
        : task
    );
  
    state.taskList = stateCopy;
    updateLocalStorage();
  
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
  
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
  };
  // search task
  const searchTask = (e) =>{
   if(!e) e = window.event;
    while(taskContents.firstChild){
      taskContents.removeChild(taskContents.firstChild);
    }
    const resultData = state.taskList.filter(({title}) =>
      title.toLowerCase().includes(e.target.value.toLowerCase()));
    resultData.map((cardData)=>
      taskContents.insertAdjacentHTML("beforeend",htmlTaskContent(cardData))
    );
  };