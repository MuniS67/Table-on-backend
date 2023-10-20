let urlBase = "http://localhost:8080";

let tBody = document.querySelector("tbody");
let btnAdd = document.querySelector(".title button");
let modalWindow = document.querySelector(".modalMain");
modalWindow.classList.add("hide");
let modalContent = document.querySelector(".modal");
let changeBtn = document.querySelector(".modal form button");
let midA = document.querySelectorAll(".mid a");
midA[0].classList.add("active_a");
let forma = document.forms.UserData;
let addTitle = forma.querySelector("#title");
let addDescr = forma.querySelector("#descr");
let addDate = forma.querySelector("#date");
let addTime = forma.querySelector("#time");
let addDone = forma.querySelector("#done");
let deleteBtn = document.querySelector(".red");

let modalWindowChange = document.querySelector(".modalChange");
modalWindowChange.classList.add("hide");
let modalChangeContent = document.querySelector(".mChange");
let changeForma = document.forms.UserDataChange;
let changeTitle = changeForma.querySelector("#titleChange");
let changeDescr = changeForma.querySelector("#descrChange");
let changeDate = changeForma.querySelector("#dateChange");
let changeTime = changeForma.querySelector("#timeChange");
let changeDone = changeForma.querySelector("#doneChange");
  
function updateData() {
  fetch(urlBase + "/users")
    .then((res) => res.json())
    .then((res) => reload(res, tBody));
}
updateData();

forma.onsubmit = (e) => {
  e.preventDefault();

  let user = {
    taskTitle: addTitle.value,
    description: addDescr.value,
    date: addDate.value,
    time: addTime.value,
    done: addDone.value,
  };

  fetch(urlBase + "/users", {
    method: "post",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200 || res.status === 201) {
      updateData();
    }
  });

  setTimeout(() => {
    modalWindow.classList.add("hide");
  }, 1000);
  modalContent.classList.remove("modalAnim");
  modalContent.classList.add("modalClose");
  forma.reset();
};

btnAdd.onclick = (e) => {
  e.preventDefault();
  modalWindow.classList.remove("hide");
  modalContent.classList.add("modalAnim");
};

function reload(arr, place) {
  place.innerHTML = "";
  for (let item of arr) {
    let tr = document.createElement("tr");
    let tdTitle = document.createElement("td");
    let tdDescr = document.createElement("td");
    let tdDate = document.createElement("td");
    let tdTime = document.createElement("td");
    let tdTaskAch = document.createElement("td");

    tdTitle.innerHTML = item.taskTitle;
    tdDescr.innerHTML = item.description;
    tdDate.innerHTML = item.date;
    tdTime.innerHTML = item.time;
    tdTaskAch.innerHTML = item.done;

    tBody.append(tr);
    tr.append(tdTitle, tdDescr, tdDate, tdTime, tdTaskAch);

    tdTitle.ondblclick = () => {
      modalWindowChange.classList.remove("hide");
      changeTitle.value = item.taskTitle;
      changeDescr.value = item.description;
      changeDate.value = item.date;
      changeTime.value = item.time;
      changeDone.value = item.done;

      changeForma.onsubmit = (e) => {
        e.preventDefault();

        item.taskTitle = changeTitle.value;
        item.description = changeDescr.value;
        item.date = changeDate.value;
        item.time = changeTime.value;
        item.done = changeDone.value;

        fetch(urlBase + "/users/" + item.id, {
          method: "put",
          body: JSON.stringify({
            taskTitle: changeTitle.value,
            description: changeDescr.value,
            date: changeDate.value,
            time: changeTime.value,
            done: changeDone.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (res.status === 200 || res.status === 201) {
            updateData();
            modalWindowChange.classList.add("hide");
            forma.reset();
          }
        });
      };
      deleteBtn.onclick = () => {
        fetch(urlBase + "/users/" + item.id, {
          method: "delete"
        }).then((res) => {
          if(res.status === 200 || res.status === 201) {
            tr.remove()
            modalWindowChange.classList.add("hide");
          }
        })
      };
    };
  }
}
