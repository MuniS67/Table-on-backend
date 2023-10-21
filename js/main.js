// ссыкла сервера
let urlBase = "http://localhost:8080";

// доставать элементы с верстки
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

let tableBottom = document.querySelector(".bottom");
let cont = document.querySelector(".cont");
cont.classList.add("hide");

// функция для массива users
function updateDataCard() {
  fetch(urlBase + "/users")
    .then((res) => res.json())
    .then((res) => reloadCard(res, cont));
}
updateDataCard();

// перевед на table и card
let clickedITem = 0;
midA.forEach((a, idx) => {
  a.onclick = () => {
    midA[clickedITem].classList.remove("active_a");
    midA[idx].classList.add("active_a");
    if (a.hasAttribute("data-table")) {
      tableBottom.classList.remove("hide");
      cont.classList.add("hide");
      updateData();
    } else {
      tableBottom.classList.add("hide");
      cont.classList.remove("hide");
      updateDataCard();
    }
    clickedITem = idx;
  };
});
// функция для массива users
function updateData() {
  fetch(urlBase + "/users")
    .then((res) => res.json())
    .then((res) => reloadTable(res, tBody));
}
updateData();

// Форма добавления
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
      updateDataCard();
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
  modalContent.classList.remove("modalClose");
  modalContent.classList.add("modalAnim");
};
// функция для card
function reloadCard(arr, place) {
  place.innerHTML = "";
  for (let item of arr) {
    let cardDiv = document.createElement("div");
    let cardTitle = document.createElement("h2");
    let cardDescr = document.createElement("p");
    let cardInf = document.createElement("div");
    let cardInfDate = document.createElement("p");
    let cardInfTime = document.createElement("p");
    let cardDone = document.createElement("p");

    cardDiv.classList.add("card_div");
    cardTitle.classList.add("card_title");
    cardDescr.classList.add("card_p");
    cardInf.classList.add("card_inf");
    cardDone.classList.add("card_p");

    cardTitle.innerHTML = item.taskTitle;
    cardDescr.innerHTML = item.description;
    cardInfDate.innerHTML = item.date;
    cardInfTime.innerHTML = item.time;
    cardDone.innerHTML = item.done;

    cont.append(cardDiv);
    cardDiv.append(cardTitle, cardDescr, cardInf, cardDone);
    cardInf.append(cardInfDate, cardInfTime);

    cardDiv.ondblclick = () => {
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
            updateDataCard();
            modalWindowChange.classList.add("hide");
            forma.reset();
          }
        });
      };
      deleteBtn.onclick = () => {
        fetch(urlBase + "/users/" + item.id, {
          method: "delete",
        }).then((res) => {
          if (res.status === 200 || res.status === 201) {
            cardDiv.remove();
            modalWindowChange.classList.add("hide");
          }
        });
      };
    };
  }
}
// функция для table
function reloadTable(arr, place) {
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
          method: "delete",
        }).then((res) => {
          if (res.status === 200 || res.status === 201) {
            tr.remove();
            modalWindowChange.classList.add("hide");
          }
        });
      };
    };
  }
}
