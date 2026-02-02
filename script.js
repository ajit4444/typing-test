const wordsEl = document.getElementById("words");
const input = document.getElementById("hiddenInput");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("acc");
const timeEl = document.getElementById("time");

const words = "typing speed improves with consistent daily practice".split(" ");
let wordIndex = 0;
let charIndex = 0;
let correct = 0;
let total = 0;
let time = 60;
let started = false;

words.forEach((w, i) => {
  const span = document.createElement("span");
  span.className = "word";
  span.innerHTML = w.split("").map(c => `<span>${c}</span>`).join("");
  wordsEl.appendChild(span);
});

function startTimer() {
  setInterval(() => {
    if (time > 0) {
      time--;
      timeEl.textContent = time + "s";
    }
  }, 1000);
}

input.addEventListener("input", e => {
  if (!started) {
    startTimer();
    started = true;
  }

  const currentWord = wordsEl.children[wordIndex];
  const chars = currentWord.children;
  const value = e.target.value;

  [...chars].forEach(c => c.className = "");

  for (let i = 0; i < value.length; i++) {
    total++;
    if (value[i] === chars[i].textContent) {
      chars[i].classList.add("correct");
      correct++;
    } else {
      chars[i]?.classList.add("wrong");
    }
  }

  currentWord.classList.add("active");

  if (value.endsWith(" ")) {
    input.value = "";
    currentWord.classList.remove("active");
    wordIndex++;
  }

  const wpm = Math.round((correct / 5) / ((60 - time) / 60 || 1));
  wpmEl.textContent = wpm + " wpm";
  accEl.textContent = Math.round((correct / total) * 100 || 100) + "%";
});
