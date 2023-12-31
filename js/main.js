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

function updateData(plite) {
  fetch(urlBase + "/users")
    .then((res) => res.json())
    .then((res) => {
      if (plite) {
        reload(res, cont, true);
      } else {
        reload(res, tBody, false);
      }
    });
}
updateData(false);

let clickedITem = 0;
midA.forEach((a, idx) => {
  a.onclick = () => {
    midA[clickedITem].classList.remove("active_a");
    midA[idx].classList.add("active_a");
    if (a.hasAttribute("data-table")) {
      tableBottom.classList.remove("hide");
      cont.classList.add("hide");
      updateData(false);
    } else {
      tableBottom.classList.add("hide");
      cont.classList.remove("hide");
      updateData(true);
    }
    clickedITem = idx;
  };
});

forma.onsubmit = (e) => {
  e.preventDefault();

  let user = {};

  let fm = new FormData(forma);

  fm.forEach((value, key) => {
    user[key] = value;
  });

  fetch(urlBase + "/users", {
    method: "post",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200 || res.status === 201) {
      updateData(Boolean(clickedITem));
    }
  });

  setTimeout(() => {
    modalWindow.classList.add("hide");
  }, 1000);
  modalContent.classList.remove("modalAnim");
  modalContent.classList.add("modalClose");
  forma.reset();
};

btnAdd.onclick = () => {
  modalWindow.classList.remove("hide");
  modalContent.classList.remove("modalClose");
  modalContent.classList.add("modalAnim");
};

function changeData(item, block, plite) {
  modalWindowChange.classList.remove("hide");
  changeTitle.value = item.title;
  changeDescr.value = item.description;
  changeDate.value = item.date;
  changeTime.value = item.time;
  changeDone.value = item.done;

  changeForma.onsubmit = (e) => {
    e.preventDefault();

    item.title = changeTitle.value;
    item.description = changeDescr.value;
    item.date = changeDate.value;
    item.time = changeTime.value;
    item.done = changeDone.value;

    fetch(urlBase + "/users/" + item.id, {
      method: "put",
      body: JSON.stringify({
        title: changeTitle.value,
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
        updateData(plite);
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
        block.remove();
        modalWindowChange.classList.add("hide");
      }
    });
  };
}

function reload(arr, place, plite) {
  place.innerHTML = "";
  for (let item of arr) {
    if (plite) {
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

      cardTitle.innerHTML = item.title;
      cardDescr.innerHTML = item.description;
      cardInfDate.innerHTML = item.date;
      cardInfTime.innerHTML = item.time;
      cardDone.innerHTML = item.done;

      cont.append(cardDiv);
      cardDiv.append(cardTitle, cardDescr, cardInf, cardDone);
      cardInf.append(cardInfDate, cardInfTime);

      cardDiv.ondblclick = () => {
        changeData(item, cardDiv, true);
      };
    } else {
      let tr = document.createElement("tr");
      let tdTitle = document.createElement("td");
      let tdDescr = document.createElement("td");
      let tdDate = document.createElement("td");
      let tdTime = document.createElement("td");
      let tdTaskAch = document.createElement("td");

      tdTitle.innerHTML = item.title;
      tdDescr.innerHTML = item.description;
      tdDate.innerHTML = item.date;
      tdTime.innerHTML = item.time;
      tdTaskAch.innerHTML = item.done;

      tBody.append(tr);
      tr.append(tdTitle, tdDescr, tdDate, tdTime, tdTaskAch);

      tdTitle.ondblclick = () => {
        changeData(item, tr, false);
      };
    }
  }
}

// function reloadTable(arr, place) {
//   place.innerHTML = "";
//   for (let item of arr) {

//   }
// }
