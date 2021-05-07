'use strict';

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

///////////////////////////////////////////
// APLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const confDialog = document.querySelector('.conf-dialog');
const overlay = document.querySelector('.overlay');
const dialogYesBtn = document.querySelector('.conf-btn--yes');
const dialogNoBtn = document.querySelector('.conf-btn--no');

class App {
  #map;
  #markers = [];
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  #newWorkoutHandler = this.#newWorkout.bind(this);
  #editWorkoutHandler = this.#editWorkout.bind(this);
  #currentWorkout;

  constructor() {
    // Get user's position
    this._getPosition();
    // Get data from local storage
    this._getLocalStorage();
    // Attach event handlers
    form.addEventListener('submit', this.#newWorkoutHandler);
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener(
      'click',
      this._handleWorkoutClick.bind(this)
    );
    dialogNoBtn.addEventListener('click', this._closeDialog);
    overlay.addEventListener('click', this._closeDialog);
  }

  _openDialog() {
    confDialog.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  _closeDialog() {
    confDialog.classList.add('hidden');
    overlay.classList.add('hidden');
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Clear inputs
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value =
      '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  #newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on the map as a marker
    this._renderWorkoutMarker(workout);

    // Render workout on the list
    this._renderWorkout(workout);

    // Hide the form + clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'} ${workout.description}`
      )
      .openPopup();
    workout.markerId = marker._leaflet_id;
    this.#markers.push(marker);
  }

  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__btns">
      <i class="far fa-edit workout__btn workout__edit-btn"></i>
      <i class="far fa-trash-alt workout__btn workout__delete-btn"></i>
      </div>
      <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'
      }</span>
      <span class="workout__value workout__distance">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value workout__duration">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    `;

    if (workout.type === 'running')
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value workout__pace">${workout.pace.toFixed(
          1
        )}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value workout__cadence">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>
    `;

    if (workout.type === 'cycling')
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value workout__speed">${workout.speed.toFixed(
          1
        )}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value workout__elevation">${
          workout.elevationGain
        }</span>
        <span class="workout__unit">m</span>
      </div>
    </li>
    `;

    form.insertAdjacentHTML('afterend', html);
  }

  #fillFormData(workout) {
    inputType.disabled = true;
    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;

    inputCadence.value = '';
    workout.cadence ? (inputCadence.value = workout.cadence) : '';

    inputElevation.value = '';
    workout.elevationGain ? (inputElevation.value = workout.elevationGain) : '';

    if (workout.type === 'cycling') {
      form.querySelector('.cadence').classList.add('form__row--hidden');
      form.querySelector('.elevation').classList.remove('form__row--hidden');
    }

    if (workout.type === 'running') {
      form.querySelector('.elevation').classList.add('form__row--hidden');
      form.querySelector('.cadence').classList.remove('form__row--hidden');
    }
  }

  #updateWorkoutUI(element, workout) {
    const distance = element.querySelector('.workout__distance');
    const duration = element.querySelector('.workout__duration');
    const pace = element.querySelector('.workout__pace');
    const speed = element.querySelector('.workout__speed');
    const cadence = element.querySelector('.workout__cadence');
    const elevation = element.querySelector('.workout__elevation');

    distance.textContent = inputDistance.value;
    duration.textContent = inputDuration.value;
    if (workout.type === 'running') {
      pace.textContent = workout.calcPace().toFixed(1);
      cadence.textContent = inputCadence.value;
    }
    if (workout.type === 'cycling') {
      speed.textContent = workout.calcSpeed().toFixed(1);
      elevation.textContent = inputElevation.value;
    }
  }

  #editWorkout(e) {
    e.preventDefault();
    const [workoutEl, workout] = this.#currentWorkout;

    // Update workout data
    workout.distance = inputDistance.value;
    workout.duration = inputDuration.value;
    if (workout.type === 'running') workout.cadence = inputCadence.value;
    if (workout.type === 'cycling')
      workout.elevationGain = inputElevation.value;
    this._setLocalStorage();

    // Update workout UI
    this.#updateWorkoutUI(workoutEl, workout);

    this._hideForm();
    workoutEl.classList.remove('editing');

    containerWorkouts.insertAdjacentElement('afterbegin', form);
    form.removeEventListener('submit', this.#editWorkoutHandler);
    form.addEventListener('submit', this.#newWorkoutHandler);
  }

  #deleteWorkout() {
    const [workoutEl, workout] = this.#currentWorkout;

    // Remove workout
    const index = this.#workouts.findIndex(el => el.id === workout.id);
    this.#workouts.splice(index, 1);
    workoutEl.remove();

    // Remove marker
    const marker = this.#markers.find(e => e._leaflet_id === workout.markerId);
    marker.remove();
    this._closeDialog();

    this._setLocalStorage();
  }

  _handleWorkoutClick(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    if (!workout) return;

    this.#currentWorkout = [workoutEl, workout];

    // Move workout into view
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });

    // Edit workout
    if (e.target.classList.contains('workout__edit-btn')) {
      // Show form
      form.removeEventListener('submit', this.#newWorkoutHandler);
      this._showForm();

      // Attach form to the element being edited
      workoutEl.insertAdjacentElement('afterend', form);
      form.classList.add('editing');
      const workouts = containerWorkouts.querySelectorAll('.workout');
      workouts.forEach(w => w.classList.remove('editing'));
      workoutEl.classList.add('editing');

      // Show current workout data in the form
      this.#fillFormData(workout);

      form.removeEventListener('submit', this.#editWorkoutHandler);
      form.addEventListener('submit', this.#editWorkoutHandler);
    }

    // Delete workout
    if (e.target.classList.contains('workout__delete-btn')) {
      this._openDialog();

      dialogYesBtn.removeEventListener('click', this.#deleteWorkout);
      dialogYesBtn.addEventListener('click', this.#deleteWorkout.bind(this), {
        once: true,
      });
    }

    // Using public interface
    workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    const newData = data.map((workout, i, arr) => {
      if (workout.type === 'running') {
        const newWorkout = new Running(
          workout.coords,
          workout.distance,
          workout.duration,
          workout.cadence
        );
        newWorkout.date = workout.date;
        newWorkout.id = workout.id;
        newWorkout.description = workout.description;
        newWorkout.clicks = workout.clicks;
        return newWorkout;
      }
      if (workout.type === 'cycling') {
        const newWorkout = new Cycling(
          workout.coords,
          workout.distance,
          workout.duration,
          workout.elevationGain
        );
        newWorkout.date = workout.date;
        newWorkout.id = workout.id;
        newWorkout.description = workout.description;
        newWorkout.clicks = workout.clicks;
        return newWorkout;
      }
    });

    // this.#workouts = data;
    this.#workouts = newData;

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
