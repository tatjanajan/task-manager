// Definiranje UI varijabli
const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');

// učitaj sve event listanere (pozivanje funkcije)
loadEventListeners();

// funkcija za učitavanje svih event listenera
function loadEventListeners() {

  // DOM load event - prikazivanje zadataka iz localStoragea nakon učitavanja stranice
  document.addEventListener('DOMContentLoaded', getTasks);

  // event "dodaj zadatak"
  form.addEventListener('submit', addTask);

  // event "ukloni zadatak iz liste"
  taskList.addEventListener('click', removeTask); // budući da iksić za brisanje stavki iz liste kreiramo dinamički, moramo koristiti 'event delegation' - event stavljamo na samu listu (ul element)

  // event "očisti sve zadatke iz liste"
  // clearBtn.addEventListener('click', clearTasks);
  clearBtn.addEventListener('click', clearTasks);

  // event "filtriranje zadataka"
  filter.addEventListener('keyup', filterTasks);
}

// funkcija koja prikazuje zadatke pohranjene u localStorageu
function getTasks() {
  let tasksArr;
  if(localStorage.getItem('tasks') === null) { 
    tasksArr = [];
  }
  else {
    tasksArr = JSON.parse(localStorage.getItem('tasks')); 
  }

  tasksArr.forEach(function(task){

    // kreiranje li elementa
    const li = document.createElement('li');
    // dodavanje klase
    li.className = 'collection-item';
    // kreairamo text node i appendamo ga u li
    li.appendChild(document.createTextNode(task));
    // kreiramo novi link element
    const link = document.createElement('a');
    // dodajemo klasu
    link.className = 'delete-item secondary-content'; 
    // dodajemo ikonicu
    link.innerHTML = '<i class="fa fa-remove"></i>';
    link.style.cursor = 'pointer'; // ovo nije u tutorijalu, to sam ja dodala
    // appendamo link u li
    li.appendChild(link);

    //appendamo li u ul
    taskList.appendChild(li);
  })
}

// funkcija addTask za dodavanje novog zadatka (poziva se unutar event listenera - form > submit)
function addTask(e) {

  // ako je input polje "novi zadatak prazno"
  if(taskInput.value === '') {
    alert('Upišite zadatak u polje "novi zadatak"!');
  }

  // kreiranje li elementa - stavke u popisu zadataka (u html fajlu ul je prazan)
  const li = document.createElement('li');
  li.className = 'collection-item'; // klasa iz materialize css-a potrebna da bi lista dobro izgledala

  // kreairamo text node (tekst koji će biti unutar li elementa) i appendamo ga (dodajemo) u li
  li.appendChild(document.createTextNode(taskInput.value));// ono što je unesno u input polje "novi zadatak" (value) dodajemo u li

  // kreiramo novi link element
  const link = document.createElement('a');
  // dodajemo klasu
  link.className = 'delete-item secondary-content'; // klasa secondary-content u materialize css-u smjestit će element na desnu stranu stavke u listi
  // dodajemo ikonicu
  link.innerHTML = '<i class="fa fa-remove"></i>';
  link.style.cursor = 'pointer'; // ovo nije u tutorijalu, to sam ja dodala
  // appendamo link (ikonicu s iksićem za brisanje stavke) u li
  li.appendChild(link);

  //appendamo li u ul
  taskList.appendChild(li);

  // spremanje zadataka u Local Storage
  storeTaskInLocalStorage(taskInput.value); // sve što se unese (value) u input polje "novi zadatak"

  // očisti input polje nakon submita
  taskInput.value = '';

  e.preventDefault();
}

// spremi zadatak
function storeTaskInLocalStorage(task) {
  let tasksArr;
  if(localStorage.getItem('tasks') === null) { // ako u localStorageu nema ništa, varijabla tasksArr je prazan array
    tasksArr = [];
  }
  else {
    tasksArr = JSON.parse(localStorage.getItem('tasks')); // u localStorageu može biti samo string, pa ga zato pretvaramo pomoću JSON.parse u objekt
  }

  tasksArr.push(task); // push metodom dodajemo task (novi zadatak, tj. taskInput.value) na kraj postojećeg arraya ili u prazan array)

  localStorage.setItem('tasks', JSON.stringify(tasksArr)); // budući da u localStorage može samo string, mi array pretvaramo u string i dodajemo u localStorage
}

// Izbriši zadatak
function removeTask(e) {
  // kad kliknemo na iksić target nam je i element, a mi želimo a element (ima klasu delete-item) koji mu je parent
  if(e.target.parentElement.classList.contains('delete-item')) { // ako kliknemo na iksić čiji je parent a...
    if(confirm('Jeste li sigurni da želite izbrisati zadatak?')) {
      e.target.parentElement.parentElement.remove(); // uklanjamo li koji je parent od a koji je parent od i (zato dvostruki parentElement) 
      
      // pozivanje funkcije za uklanjanje iz localStoragea
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
    }    
  }
}

// uklanjenje iz localStoragea
function removeTaskFromLocalStorage(taskItem) {
  let tasksArr;
  if(localStorage.getItem('tasks') === null) { 
    tasksArr = [];
  }
  else {
    tasksArr = JSON.parse(localStorage.getItem('tasks')); 
  }

  tasksArr.forEach(function(task, index){
    if(taskItem.textContent === task) {
      tasksArr.splice(index, 1); // splice je metoda kojom uklanjamo/dodajemo iteme iz arraya/u array. U ovom slučaju uklanjamo jedan item (to određuje brojka 1 u zagradi) koji ima određeni indeks (to određuje index u zagradi)
    }
  });

  localStorage.setItem('tasks', JSON.stringify(tasksArr));
}


// Očisti sve zadatke iz liste
function clearTasks() {
  // taskList.innerHTML = ''; // ovo je jedan način, jednostavniji, ali nešto sporiji
  // brži način
  while(taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  // https://jsperf.com/innerhtml-vs-removechild

  // pozivanje funkcije koja čisti sve zadatke iz localStoragea
  clearTasksFromLocalStorage();
}

// Očisti zadatke iz localStoragea
function clearTasksFromLocalStorage() {
  localStorage.clear();
}

// Filtriranje zadataka
function filterTasks(e) {
  // varijabla koja sprema sve što se upiše (value) u polje Filtriraj zadatke
  const text = e.target.value.toLowerCase();
  //foreach petljom prolazimo kroz sve stavke popisa (li elementi, svi imaju klasu colection-item)
  document.querySelectorAll('.collection-item').forEach(function(task){
    const item = task.firstChild.textContent; // ovo se odnosi na firstChild od li elementa, a to je tekst koji je u njemu, ali budući da je njegov tip podatka objekt, moramo tražiti njegov textContent koji je string
    
    //indexOf metoda vraća poziciju (od 0 pa nadalje) prvog pojavljivanja neke vrijednosti u stringu, a ako je nema u stringu vraća -1, ovdje konkretno gledamo pojavljuje li se ono što smo utipkali u polje za filtriranje (slovo, riječ) bilo gdje u tekstu stavki liste
    if(item.toLowerCase().indexOf(text) != -1){
      task.style.display = 'block';
    }
    else {
      task.style.display = 'none';
    }   
  });
}

