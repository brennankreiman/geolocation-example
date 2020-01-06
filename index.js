const units = {
  mph: 2.237,
  kph: 3.6
}
const options = {
  watchId: null,
  activeUnit: units.mph,
}

const ui = {
  readout: document.getElementById('readout'),
  units: document.getElementById('units'),
  mph: document.getElementById('mph'),
  kph: document.getElementById('kph'),
  compass: document.getElementById('compass'),
  needle: document.getElementById('needle'),
  start: document.getElementById('start'),
}

ui.mph.addEventListener('click', function(){ toggleUnits('mph'); }, false);
ui.kph.addEventListener('click', function(){ toggleUnits('kph'); }, false);
ui.start.addEventListener('click', function(){ toggleGeo(); }, false);

const watchPosition = (position) => {
  if(position.coords.speed) {
      ui.readout.textContent = Math.round(position.coords.speed * options.activeUnit);
  }
  if(position.coords.heading) {
      let heading = -Math.abs(position.coords.heading);
      // clockwise vs. counter-clockwise movement
      if (heading > 180) {
        heading += 360;
      }
      ui.compass.classList.toggle('searching');
      ui.needle.style.transform = "rotate(" + heading + " deg)";
  }
};

const error = (err) => {
    ui.readout.textContent = err.message;
}

const toggleUnits = (unit) => {
  if (options.speedUnit !== units[unit]) {
    options.speedUnit = units[unit];
    ui.units.textContent = unit;
    ui.kph.classList.toggle('active');
    ui.mph.classList.toggle('active');
  }
}

const toggleGeo = () => {
  ui.readout.classList.toggle('loading');
  if (options.watchId) {
    navigator.geolocation.clearWatch(options.watchId);
    options.watchId = null;
    ui.readout.html = '<span>.</span><span>.</span><span>.</span>'
    ui.start.textContent = 'Start';
    ui.start.classList.toggle('button');
    ui.start.classList.toggle('active');
    ui.compass.classList.toggle('hidden');
  } else {
     const settings = {
          enableHighAccuracy: true
        };
        options.watchId = navigator.geolocation.watchPosition(watchPosition,
          error, settings);
          ui.start.classList.toggle('button');
          ui.start.classList.toggle('active');
          ui.start.textContent = "×";
          ui.compass.classList.toggle('searching');
          ui.compass.classList.toggle('hidden');
  }
}

const startServiceWorker = () => {
  navigator.serviceWorker.register('serviceWorker.js', {
    scope: './'
  });
}
navigator.serviceWorker.getRegistrations().then(registrations => {
    if (Object.keys(registrations).length <  1) {
        startServiceWorker();
    }
});
