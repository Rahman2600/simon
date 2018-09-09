var KEYS = ["c", "d", "e", "f"];
var NOTE_DURATION = 1000;
var TIME_BETWEEN_ROUNDS = 1500;

// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function NoteBox(key, onClick) {
  // Create references to box element and audio element.
  var boxEl = document.getElementById(key);
  var audioEl = document.getElementById(key + "-audio");
  if (!boxEl) throw new Error("No NoteBox element with id" + key);
  if (!audioEl) throw new Error("No audio element with id" + key + "-audio");

  // When enabled, will call this.play() and this.onClick() when clicked.
  // Otherwise, clicking has no effect.
  var enabled = true;
  // Counter of how many play calls have been made without completing.
  // Ensures that consequent plays won't prematurely remove the active class.
  var playing = 0;

  this.key = key;
  this.onClick = onClick || function() {};

  // Plays the audio associated with this NoteBox
  // calls passed in function done when its done playing if it exists
  this.play = function(done) {
    playing++;
    // Always play from the beginning of the file.
    audioEl.currentTime = 0;
    audioEl.play();

    // Set active class for NOTE_DURATION time
    boxEl.classList.add("active");
    setTimeout(function() {
      playing--;
      if (!playing) {
        boxEl.classList.remove("active");
      }
      if (done) {
        done();
      }
    }, NOTE_DURATION);
  };

  // Enable this NoteBox
  this.enable = function() {
    enabled = true;
  };

  // Disable this NoteBox
  this.disable = function() {
    enabled = false;
  };

  // Call this NoteBox's clickHandler and play the note.
  this.clickHandler = function() {
    if (!enabled) return;

    this.onClick(this.key);
    this.play();
  }.bind(this);

  boxEl.addEventListener("mousedown", () => {
    this.onClick(this.key);
  });
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.
function example() {
  var notes = {};

  KEYS.forEach(function(key) {
    notes[key] = new NoteBox(key);
  });

  KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
    setTimeout(notes[key].play.bind(null, key), i * NOTE_DURATION);
  });
}

function simon() {
  var notes = {};
  KEYS.forEach(function(key) {
    notes[key] = new NoteBox(key, onClick);
  });
  var sequence; //the stack of notes that was played and should be played by user
  var nextIndex; //index of correct next note
  var score;
  var isAwaitingReplay; //true when game is waiting for user to play notes

  function getRandomKey() {
    return KEYS[getRandomInt(KEYS.length)];
  }

  //from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function playNote(key, done) {
    notes[key].play.bind(null, done)(); //is bind needed?
  }

  function playSequence(sequence, done) {
    sequence.forEach(function(key, i) {
      let waitTime = i * NOTE_DURATION;
      if (i < sequence.length - 1) {
        setTimeout(() => {
          playNote(key);
        }, waitTime);
      } else {
        setTimeout(() => {
          playNote(key, done);
        }, waitTime);
      }
    });
  }

  //called when sequence is done playing
  function done() {
    isAwaitingReplay = true;
  }

  function onClick(key) {
    if (isAwaitingReplay) {
      if (key === sequence[nextIndex]) {
        playNote(key);
        if (nextIndex < sequence.length - 1) {
          nextIndex += 1;
        } else {
          isAwaitingReplay = false;
          score += 1;
          updateScore();
          nextIndex = 0;
          setTimeout(nextRound, TIME_BETWEEN_ROUNDS);
        }
      } else {
        isAwaitingReplay = false;
        gameOver();
      }
    }
  }

  function gameOver() {
    score = 0;
    updateScore();
    document.getElementById("gameOver").style.display = "inline";
    setTimeout(clearGameOver, TIME_BETWEEN_ROUNDS / 4);
    setTimeout(startGame, TIME_BETWEEN_ROUNDS);
    function clearGameOver() {
      document.getElementById("gameOver").style.display = "none";
    }
  }

  function updateScore() {
    document.getElementById("score").innerHTML = score;
  }

  function nextRound() {
    sequence.push(getRandomKey());
    playSequence(sequence, done);
  }

  function startGame() {
    sequence = [];
    nextIndex = 0;
    score = 0;
    isAwaitingReplay = false;
    updateScore();
    nextRound();
  }

  startGame();
}

simon();
