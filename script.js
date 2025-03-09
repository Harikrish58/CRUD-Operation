//Getting all the HTML elements
const form = document.getElementById("form");
const textInput = document.getElementById("textInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const textarea = document.getElementById("textarea");
const msg = document.getElementById("msg");
const tasks = document.getElementById("tasks");
const add = document.getElementById("add");

//setting min date
const today = new Date().toISOString().split("T")[0];
document.getElementById("dateInput").min = today;

// Function to update the minimum time based on the selected date
const updateMinTime = () => {
  const selectedDate = new Date(dateInput.value);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

  // If selected date is today, set min time to current time
  if (selectedDate.toDateString() === todayDate.toDateString()) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    timeInput.min = currentTime;
  } else if (selectedDate > todayDate) {
    // If selected date is in the future, allow any time
    timeInput.min = "00:00";
  }
};

// Set initial min time when page loads (assuming dateInput starts as today)
updateMinTime();

// Add event listener to update min time when date changes
dateInput.addEventListener("change", updateMinTime);


//Form validation part/function
const formValidation = () => {
  if (textInput.value === "") {
    msg.innerHTML = "Input fields cannot be empty";
    // console.log("Data not found");
  } else {
    msg.innerHTML = "";
    // console.log("Data available");
    getData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();
    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

//Submit logic
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

//getting elements from the form input and storing in data
let data = [{}];

const getData = () => {
  data.push({
    text: textInput.value,
    date: dateInput.value,
    time: timeInput.value,
    task: textarea.value,
  });
  localStorage.setItem("data", JSON.stringify(data));
  console.log("get", data);
  createTask();
};

//create function
const createTask = () => {
  tasks.innerHTML = "";
  data.map((ele, index) => {
    return (tasks.innerHTML += `<div id=${index}>
      <span class="fw-bolder">Task Title: ${ele.text}</span>
      <span class="small text-secondary">Due date: ${ele.date}</span>
      <span class="small text-secondary">Due time: ${ele.time}</span>
      <p>Task Details: ${ele.task}</p>
      <span class="options">
      <i onclick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fa-solid fa-pen-to-square" style="color: #07f236;"></i>
      <i onclick="deleteTask(this);createTask()" class="fa-solid fa-trash" style="color: #ff0000;"></i>
      </span>
      </div>
      `);
  });
  resetForm();
};

//resettig the form logic
const resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  textarea.value = "";
};
(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  console.log("reset", data);
  createTask();
})();

//edit function for todo
const editTask = (e) => {
  let task = e.parentElement.parentElement;
  textInput.value = task.children[0].innerHTML;
  dateInput.value = task.children[1].innerHTML;
  timeInput.value = task.children[2].innerHTML;
  textarea.value = task.children[3].innerHTML;
  //remove tasrk
deleteTask(e);
};



//delete function for todo
const deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  data.splice(e.parentElement.parentElement.id, 1);
  localStorage.setItem("data", JSON.stringify(data));
  // console.log(data);
};
