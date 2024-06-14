const SAME_HR_MIN = "Same hours as minutes";
const SAME_ALL = "All numbers same";
const DESCENDING = "Descending";
const ASCENDING = "Ascending";

let hrMode = 24;

function isFunnyTime(hr, min) {
  hr = "" + hr;
  min = "" + min;
  const time = hr + min;

  function allNumsSame(str) {
    return str.split("").every(v => v === str[0]);
  }
  if (allNumsSame(time)) return SAME_ALL;

  function isDescending(str) {
    let nums = str.split("").map((n) => parseInt(n));
    return nums.every((n, i) => i === 0 || n - 1 === nums[i - 1]);
  }
  if (isDescending(time)) return DESCENDING;

  function isAscending(str) {
    let nums = str.split("").map((n) => parseInt(n));
    return nums.every((n, i) => i === 0 || n + 1 === nums[i - 1]);
  }
  if (isAscending(time)) return ASCENDING;

  if (hr === min) return SAME_HR_MIN;
  return false;
}

let funnyTimes = [];
function listFunnyTimes() {
  funnyTimes = [];
  let start = hrMode === 24 ? 0 : 1;
  for (let hr = start; hr < hrMode; hr++) {
    for (let min = 0; min < 60; min++) {
      let padMin = ("" + min).padStart(2, "0");
      if (isFunnyTime(hr, padMin)) {
        let padHr = ("" + hr).padStart(2, "0");
        funnyTimes.push({
          _time: (hr * 60) + min,
          time: padHr + ":" + padMin,
          type: isFunnyTime(hr, padMin)
        });
      }
    }
  }
}

const timeEl = document.getElementById("time");
const typeEl = document.getElementById("type");
const inEl = document.getElementById("in");

function nextFunnyTime() {
  const _date = new Date();
  let hr = _date.getHours();
  if (hrMode !== 24 && hr > hrMode) hr -= hrMode;
  const min = _date.getMinutes();
  const _currTime = (hr * 60) + min;
  let next = funnyTimes.find(time => time._time >= _currTime);
  if (!next) {
    next = funnyTimes[0];
    next._time += hrMode * 60;
  }
  let diff = next._time - _currTime;
  return {
    time: next.time,
    type: next.type,
    diff
  }
}

function updateTime() {
  const { time, type, diff } = nextFunnyTime();
  timeEl.textContent = time;
  typeEl.textContent = type;
  if (diff === 0) {
    inEl.textContent = "now";
    if (inEl.classList.contains("now")) return;
    inEl.classList.add("now");
    setTimeout(() => inEl.classList.remove("now"), 60000);
  } else {
    inEl.textContent = `in ${diff} minutes`;
  }
}

function updateHrs(mode) {
  hrMode = mode;
  listFunnyTimes();
  updateTime();
}

listFunnyTimes();
updateTime();
setInterval(updateTime, 1000)
