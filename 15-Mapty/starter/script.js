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

const run = new Running();

///////////////////////////////////////////
// APLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #markers = [];
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  #newWorkoutHandler = this._newWorkout.bind(this);

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
    this.test = [];
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

  _newWorkout(e) {
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
      <button class="workout__edit-btn workout__btn">Edit</button>
      <button class="workout__delete-btn workout__btn">Remove</button>
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
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
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
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
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

  _editWorkout(...params) {
    // params[0].preventDefault();

    const workoutEl = params[1];
    console.log(this);
  }

  _createEditForm(workout, element) {
    let html = `
    <form class="form form--edit">
    <div class="form__row">
      <label class="form__label">Type</label>
      <select class="form__input form__input--type" disabled="true">
        <option value="running" ${
          workout.type === 'running' ? 'selected' : ''
        }>Running</option>
        <option value="cycling" ${
          workout.type === 'cycling' ? 'selected' : ''
        }>Cycling</option>
      </select>
    </div>
    <div class="form__row">
      <label class="form__label">Distance</label>
      <input class="form__input form__input--distance" placeholder="km" value="${
        workout.distance
      }"/>
    </div>
    <div class="form__row">
      <label class="form__label">Duration</label>
      <input
        class="form__input form__input--duration"
        placeholder="min" value="${workout.duration}"
      />
    </div>
    <button class="form__btn">OK</button>`;
    if (workout.type === 'running')
      html += `<div class="form__row cadence">
    <label class="form__label">Cadence</label>
    <input
      class="form__input form__input--cadence"
      placeholder="step/min" value="${workout.cadence}"
    />
  </div>
  </form>`;
    if (workout.type === 'cycling')
      html += `<div class="form__row elevation">
    <label class="form__label">Elev Gain</label>
    <input
      class="form__input form__input--elevation"
      placeholder="meters" value="${workout.elevationGain}"
    />
  </div>
  </form>`;

    element.insertAdjacentHTML('afterend', html);
    element.style.marginBottom = '0';
  }

  _handleWorkoutClick(e) {
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    if (!workout) return;

    // Move workout into view
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });

    // Edit workout
    if (e.target.classList.contains('workout__edit-btn')) {
      containerWorkouts.querySelector('.form--edit').remove();
      this._createEditForm(workout, workoutEl);
      workoutEl.style.marginTop = '1.75rem';

      const editForm = containerWorkouts.querySelector('.form--edit');

      const updateWorkout = function (e) {
        e.preventDefault();
        const distance = workoutEl.querySelector('.workout__distance');
        const duration = workoutEl.querySelector('.workout__duration');
        const cadence = workoutEl.querySelector('.workout__cadence');
        const elevation = workoutEl.querySelector('.workout__elevation');

        distance.textContent = editForm.querySelector(
          '.form__input--distance'
        ).value;
        duration.textContent = editForm.querySelector(
          '.form__input--duration'
        ).value;
        workout.distance = +distance.textContent;
        workout.duration = +duration.textContent;

        if (workout.type === 'running') {
          cadence.textContent = editForm.querySelector(
            '.form__input--cadence'
          ).value;
          workout.cadence = +cadence.textContent;
        }
        if (workout.type === 'cycling') {
          elevation.textContent = editForm.querySelector(
            '.form__input--elevation'
          ).value;
          workout.elevationGain = +elevation.textContent;
        }

        this._setLocalStorage();

        editForm.classList.add('hidden');
      };

      editForm.addEventListener('submit', updateWorkout.bind(this));
    }

    // Delete workout
    if (e.target.classList.contains('workout__delete-btn')) {
      const index = this.#workouts.findIndex(el => el.id === workout.id);
      workoutEl.remove();
      this.#workouts.splice(index, 1);
      // Remove marker
      const marker = this.#markers.find(
        e => e._leaflet_id === workout.markerId
      );
      marker.remove();
      this._setLocalStorage();
    }

    // Using public interface
    // workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

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

// const formCadence = form.querySelector('.cadence');
// const formElevation = form.querySelector('.elevation');

// const distanceDOM = workoutEl.querySelector('.workout__distance');
// const durationDOM = workoutEl.querySelector('.workout__duration');
// const cadenceDOM = workoutEl.querySelector('.workout__cadence');
// const elevationDOM = workoutEl.querySelector('.workout__elevation');

// const editWorkout = function (event) {
//   event.preventDefault();

//   // Update workout data and UI
//   distanceDOM.textContent = inputDistance.value;
//   durationDOM.textContent = inputDuration.value;

//   workout.distance = inputDistance.value;
//   workout.duration = inputDuration.value;

//   if (workout.type === 'running') {
//     cadenceDOM.textContent = inputCadence.value;
//     workout.cadence = inputCadence.value;
//   }
//   if (workout.type === 'cycling') {
//     elevationDOM.textContent = inputElevation.value;
//     workout.elevationGain = inputElevation.value;
//   }

//   // Update local storage
//   // this._setLocalStorage();

//   // Clear inputs, hide form
//   inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value =
//     '';
//   form.classList.add('hidden');
//   // Switch back event listeners
//   form.removeEventListener('submit', editWorkout);
//   form.addEventListener('submit', this.#newWorkoutHandler);
//   form.classList.remove('editing');

//   console.log(`Updated ${workout.id}`);
// };

// // Show form, switch event listeners
// form.classList.remove('hidden');
// form.removeEventListener('submit', this.#newWorkoutHandler);

// if (!form.classList.contains('editing')) {
//   form.addEventListener('submit', editWorkout.bind(this), {
//     once: true,
//   });
//   form.classList.add('editing');
// }

// // Display workout data in the form
// inputType.disabled = true;
// if (workout.type === 'running') {
//   formCadence.classList.remove('form__row--hidden');
//   formElevation.classList.add('form__row--hidden');
//   inputCadence.value = workout.cadence;
// }
// if (workout.type === 'cycling') {
//   formElevation.classList.remove('form__row--hidden');
//   formCadence.classList.add('form__row--hidden');
//   inputElevation.value = workout.elevationGain;
// }

// inputType.value = workout.type;
// inputDistance.value = workout.distance;
// inputDuration.value = workout.duration;
