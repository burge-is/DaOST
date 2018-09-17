var BPM = 120;

// DRUM LOOP
var steps = document.querySelectorAll('.step');
var levelWrapper = document.querySelector('.levelWrapper');
var levels = document.querySelectorAll('.level');
var audioElements = document.querySelectorAll('audio');

var time = 0;
var id = void 0;
function start() {
  id = setInterval(function () {
    handleTick();
    time < 15 ? time++ : time = 0;
  }, 60000 / BPM / 4);
}

function pause() {
  clearInterval(id);
}

function handleTick() {
  var last = time > 0 ? time - 1 : 15;
  steps[last].classList.remove('active');
  steps[time].classList.add('active');

  Array.from(steps[time].children).
  filter(function (e) {return e.classList.contains('on');}).
  map(function (e) {return e.dataset.instrument;}).
  forEach(play);
}

function play(instrument) {
  var media = document.querySelector('audio[data-instrument="' +
  instrument + '"]');

  media.currentTime = 0;
  media.play();

  var level = levelWrapper.querySelector('.' + instrument);
  level.classList.remove('active');
  setTimeout(function () {
    level.classList.add('active');
  }, 20);
}

levels.forEach(function (level) {
  level.addEventListener('transitionend', function () {
    this.classList.remove('active');
  });
});

function loadPattern(state) {
  if (!state) {
    return;
  }
  steps.forEach(function (step, i) {
    Array.from(step.children).forEach(function (pad, j) {
      state[i][j] === 1 ?
      pad.classList.add('on') :
      pad.classList.remove('on');
    });
  });
}

// CONTROLS
var drumPads = document.querySelectorAll('.drum-pads .pad');
var muteBtn = document.getElementById('mute');
var playPauseBtn = document.getElementById('playpause');
var saveBtn = document.getElementById('save');
var loadBtn = document.getElementById('load');
var resetBtn = document.getElementById('reset');

drumPads.forEach(function (pad) {return pad.addEventListener('click', function () {
    this.classList.toggle('on');
  });});


muteBtn.addEventListener('click', function () {
  if (this.firstChild.classList.contains('fa-volume-up')) {
    this.classList.remove('pulse');
    this.firstChild.classList.replace('fa-volume-up', 'fa-volume-off');
    audioElements.forEach(function (audio) {return audio.muted = false;});
  } else {
    this.classList.add('pulse');
    this.firstChild.classList.replace('fa-volume-off', 'fa-volume-up');
    audioElements.forEach(function (audio) {return audio.muted = true;});
  }
});

playPauseBtn.addEventListener('click', function () {
  if (this.firstChild.classList.contains('fa-play')) {
    this.firstChild.classList.replace('fa-play', 'fa-pause');
    start();
  } else {
    this.firstChild.classList.replace('fa-pause', 'fa-play');
    pause();
  }
});

saveBtn.addEventListener('click', function () {
  var state = Array.from(steps).map(function (step) {return (
      Array.from(step.children).map(function (pad) {return (
          pad.classList.contains('on') ? 1 : 0);}));});


  localStorage.setItem('thepeted-drums', JSON.stringify(state));
});

loadBtn.addEventListener('click', function () {
  loadPattern(JSON.parse(localStorage.getItem('thepeted-drums')));
});

reset.addEventListener('click', function () {
  steps.forEach(function (step) {
    Array.from(step.children).forEach(function (pad) {return pad.classList.remove('on');});
  });
});

var demo = [[0, 0, 1, 0, 0, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 1], [0, 0, 0, 0, 1, 0, 0, 1], [0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 1], [0, 0, 1, 0, 0, 1, 1, 0], [0, 0, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 1, 0, 1], [0, 1, 0, 0, 0, 0, 0, 0]];

loadPattern(JSON.parse(localStorage.getItem('thepeted-drums')) || demo);
start();
