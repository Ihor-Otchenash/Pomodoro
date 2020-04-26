const pomodorosContainer = document.querySelector('.pomodoros-container');
const lessonLengthMins = 25;
const timeSpent = document.querySelector('.time-spent-value');
const lessonLengthField = document.querySelector('.lesson-length');
const loader = document.querySelector('.loader');
lessonLengthField.innerHTML = `&nbsp;${lessonLengthMins}&nbsp;`;

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyABsg1z2HxQPQ7FgRLMCg0CA33dgA09enU",
  authDomain: 'pomodoro-learn.firebaseio.com/',
  databaseURL: 'https://pomodoro-learn.firebaseio.com/',
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
  loader.parentNode.removeChild(loader);
}

const logError = (error) => console.error(error);

const askPermissionNotification = () => {
  const handlePermission = (permission) => {
    if(!('permission' in Notification)) {
      Notification.permission = permission;
    }

    if (Notification.permission === 'granted') {
      document.querySelector('.notifications').innerHTML = "You've allowed the notifications";
    } else {
      document.querySelector('.notifications').innerHTML = "You've restricted the notifications. The app won't work as expected";
    }
    document.querySelector('.notifications').style.display = "block";
  }

  const chechNotificationType = () => {
    try {
      Notification.requestPermission().then();
    } catch(error) {
      return false;
    }
    return true;
  }
  
  document.querySelector('.notifications').style.display = "none"

  if (!('Notification' in window)) {
    document.querySelector('.notifications').innerHTML = "Your browser doesn't support notifications. The app won't work as expected";
    document.querySelector('.notifications').style.display = "block";
  } else {
    if(chechNotificationType()) {
      Notification.requestPermission()
      .then((permission) => {
        handlePermission(permission);
      })
    } else {
      Notification.requestPermission((permission) => {
        handlePermission(permission);
      });
    }
  }
}

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

const startTimer = () => {
  timer.innerHTML = new Date(timeLeft * 1000).toISOString().substr(11, 8);
  if (!timerBlocked) {
    timerBlocked = true;
    const startTimer = window.setInterval(() => {
    if (timerStart === timerStop - 1) {
      clearInterval(startTimer);
      timerStart = 0;
      timeLeft = timerStop - timerStart;
      'Notification' in window
        ? Notification.permission === "granted" ? sendNotification() : callNotificationPopup()
        : callNotificationPopup();
      addPomodor();
      document.querySelector(".header__add-pomodoro").innerHTML = "Start Tracking";
      return timerBlocked = false;
    }
    timeLeft -= 1;
    timerStart += 1;
    timer.innerHTML = new Date(timeLeft * 1000).toISOString().substr(11, 8);
  }, 1000);
  } else {
    return;
  }
}

const callNotificationPopup = () => {
  const notificationPopup = document.querySelector(".notification-container");
  notificationPopup.style.display = "block";
  timer.innerHTML = new Date(timeLeft * 1000).toISOString().substr(11, 8);
}

const closeNotificationPopup = () => {
  const notificationPopup = document.querySelector(".notification-container");
  notificationPopup.style.display = "none";
}

const sendNotification = () => {
  const img = '/img/tomato.png';
  const text = 'Take a break! You did your 25 minutes!';
  const notification = new Notification('Pomodoro App', { body: text, icon: img});
  timer.innerHTML = new Date(timeLeft * 1000).toISOString().substr(11, 8);
}

document.querySelector('.notification-popup__close').addEventListener('click', () => {
  closeNotificationPopup();
});

const timer = document.querySelector('.timer');
let timerBlocked = false;
let timerStart = 0;
const timerStop = 25 * 60;
let timeLeft = timerStop - timerStart;

askPermissionNotification();
const database = firebase.database();
const timeSpentValue = database.ref('timeSpent');
timeSpentValue.once('value', writeTimeSpent, logError);
const pomodorsValue = database.ref('pomodors');
pomodorsValue.once('value', writePomodors, logError);
document.querySelector('.header__add-pomodoro').onclick = startTimer;