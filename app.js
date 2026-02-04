// TypeFast — Feature-complete static typing test
// Features: timed/word mode, WPM, accuracy, caret, per-char highlight, local leaderboard, share/copy result, theme, settings

// --- WORD SOURCES ---
const COMMON_WORDS = ("the quick brown fox jumps over the lazy dog time keyboard typing practice javascript code " +
  "performance accuracy test speed focus power creative agile fast simple hard soft").split(/\s+/);

const QUOTES = [
  "Do or do not there is no try",
  "Simplicity is the soul of efficiency",
  "Less is more",
  "Stay hungry stay foolish",
  "Talk is cheap show me the code"
];

// --- DOM refs ---
const wordsEl = document.getElementById('words');
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('accuracy');
const timeEl = document.getElementById('time');
const timeLabel = document.getElementById('timeLabel');
const hiddenInput = document.getElementById('hiddenInput');
const testArea = document.getElementById('testArea');
const restartBtn = document.getElementById('restartBtn');
const modeTimeBtn = document.getElementById('modeTime');
const modeWordsBtn = document.getElementById('modeWords');
const amountSelect = document.getElementById('amountSelect');
const themeToggle = document.getElementById('themeToggle');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const wordSourceSelect = document.getElementById('wordSourceSelect');
const clearLeaderboardBtn = document.getElementById('clearLeaderboard');
const resultsPanel = document.getElementById('resultsPanel');
const leaderboardPanel = document.getElementById('leaderboardPanel');
const toggleResultsBtn = document.getElementById('toggleResults');
const copyResultBtn = document.getElementById('copyResult');
const progressFill = document.getElementById('progressFill');

// --- STATE ---
let mode = 'time'; // 'time' or 'words'
let amount = parseInt(amountSelect.value, 10);
let duration = amount;
let timeLeft = duration;
let timer = null;
let started = false;
let wordList = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let typedChars = 0;
let correctChars = 0;
let incorrectChars = 0;
let caretEl = document.getElementById('caret');

// --- HELPERS ---
function randFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function genWords(count=100){
  const source = wordSourceSelect ? wordSourceSelect.value : 'common';
  const arr = [];
  if(source === 'quotes'){
    // split quotes into words and fill
    while(arr.length < count){
      const q = randFrom(QUOTES).split(/\s+/);
      q.forEach(w => arr.push(w));
    }
    return arr.slice(0,count);
  }
  for(let i=0;i<count;i++) arr.push(COMMON_WORDS[Math.floor(Math.random()*COMMON_WORDS.length)]);
  return arr;
}

// --- RENDERING ---
function renderWords(){
  wordsEl.innerHTML = '';
  wordList.forEach((w, wi) => {
    const wspan = document.createElement('span');
    wspan.className = 'word';
    for(let i=0;i<w.length;i++){
      const cspan = document.createElement('span');
      cspan.className = 'char';
      cspan.textContent = w[i];
      wspan.appendChild(cspan);
    }
    // trailing space char
    const spacer = document.createElement('span');
    spacer.className = 'char';
    spacer.textContent = ' ';
    wspan.appendChild(spacer);
    wordsEl.appendChild(wspan);
  });
  setCurrentPosition(0,0);
  placeCaret();
}

function setCurrentPosition(wi, ci){
  wordsEl.querySelectorAll('.char').forEach(n => n.classList.remove('current'));
  const wordNodes = wordsEl.children;
  if(wordNodes[wi]){
    const chars = wordNodes[wi].querySelectorAll('.char');
    const idx = Math.min(ci, chars.length-1);
    if(chars[idx]) chars[idx].classList.add('current');
  }
 
