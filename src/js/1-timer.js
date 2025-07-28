import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

// Функція форматування з провідним нулем
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція конвертації мс в дні, години, хвилини, секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Ініціалізація flatpickr
flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (!selectedDate) return;

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
});

// Обробник кнопки Start
startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  updateTimer(); // Оновлення відразу при запуску

  timerId = setInterval(() => {
    updateTimer();
  }, 1000);
});

// Функція оновлення таймера
function updateTimer() {
  const now = new Date();
  const delta = userSelectedDate - now;

  if (delta <= 0) {
    clearInterval(timerId);
    renderTimer(0, 0, 0, 0);
    input.disabled = false;
    startBtn.disabled = true;
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(delta);
  renderTimer(days, hours, minutes, seconds);
}

// Функція виводу часу в інтерфейс
function renderTimer(days, hours, minutes, seconds) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

// При першому завантаженні сторінки кнопка Start неактивна, таймер показує 00:00:00:00
renderTimer(0, 0, 0, 0);