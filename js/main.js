const pomodorosContainer = document.querySelector('.pomodoros-container');
const lessonLengthMins = 25;
const timeSpent = document.querySelector('.time-spent-value');
const lessonLengthField = document.querySelector('.lesson-length');
const loader = document.querySelector('.loader');
lessonLengthField.innerHTML = `&nbsp;${lessonLengthMins}&nbsp;`;

const firebaseApp = firebase.initializeApp({
  apiKey,
  authDomain,
  databaseURL,
});

const writeTimeSpent = (data) => timeSpent.innerHTML = data.val();

const writePomodors = (data) => {
  const pomodorsQnty = data.val();
  for (i = 0; i < pomodorsQnty; i++) {
    const pomodor = document.createElement('li');
    pomodor.className = 'pomodor'
    pomodor.innerHTML = `
    <img class="pomodor-image" src="./img/tomato.svg" alt="Pomodor" />
    `
    pomodorosContainer.appendChild(pomodor);
  }
  loader.style.display = "none";
}

const logError = (error) => console.error(error);

const addPomodor = () => {
  const pomodor = document.createElement('li');
  pomodor.className = 'pomodor'
  pomodor.innerHTML = `
    <img class="pomodor-image" src="./img/tomato.svg" alt="Pomodor" />
  `
  const newTimeSpent = Number(timeSpent.innerHTML) + lessonLengthMins;
  timeSpent.innerHTML = newTimeSpent;
  timeSpentValue.set(newTimeSpent);
  const pomodorsAmount = pomodorosContainer.children.length;
  pomodorosContainer.appendChild(pomodor);
  pomodorsValue.set(pomodorsAmount + 1);
}

const database = firebase.database();
const timeSpentValue = database.ref('timeSpent');
timeSpentValue.once('value', writeTimeSpent, logError);
const pomodorsValue = database.ref('pomodors');
pomodorsValue.once('value', writePomodors, logError);
document.querySelector('.header__add-pomodoro').onclick = addPomodor;