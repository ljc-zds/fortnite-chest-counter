/* MIT License. Copyright (c) 2026 LootCounter contributors. */
'use strict';
const counter = window.ChestCounter;
const key = 'lootcounter-open-counter:v1';
const byId = (id) => document.getElementById(id);
let count = 0;
let previous = null;
let damaged = false;
let savedRaw = null;
let updatedAt = new Date().toISOString();
const status = byId('status');
try {
  savedRaw = localStorage.getItem(key);
  if (savedRaw !== null) {
    const stored = counter.readSnapshot(savedRaw);
    if (stored) {
      count = stored.count;
      updatedAt = stored.updatedAt;
    } else {
      damaged = true;
      status.textContent =
        'Saved data could not be read. Download the original before resetting. It has not been overwritten.';
    }
  }
} catch {
  status.textContent =
    'Browser storage is unavailable. Export your count before closing this page.';
}
function render() {
  byId('count').textContent = count.toLocaleString('en-US');
  byId('add').disabled = damaged || count === counter.MAX;
  byId('subtract').disabled = damaged || count === 0;
  byId('undo').disabled = damaged || previous === null;
  byId('set').disabled = damaged;
  byId('start-count').disabled = damaged;
  byId('export').disabled = damaged;
  byId('original').hidden = !damaged;
}
function persist() {
  updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(
      key,
      JSON.stringify(counter.snapshot(count, updatedAt))
    );
    status.textContent = 'Saved in this browser.';
  } catch {
    status.textContent =
      'Not saved: browser storage is unavailable or full. Export before closing.';
  }
}
function setCount(value) {
  if (damaged || !counter.validCount(value) || value === count) return;
  previous = count;
  count = value;
  persist();
  render();
}
function download(text, filename, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
byId('add').addEventListener('click', () => setCount(counter.change(count, 1)));
byId('subtract').addEventListener('click', () =>
  setCount(counter.change(count, -1))
);
byId('undo').addEventListener('click', () => {
  if (previous === null || damaged) return;
  count = previous;
  previous = null;
  persist();
  render();
});
byId('starting-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = counter.parseCount(byId('start-count').value);
  if (value === null) {
    status.textContent = 'Use a whole number from 0 to 10,000,000.';
    return;
  }
  setCount(value);
});
byId('reset').addEventListener('click', () => {
  if (
    !window.confirm(
      'Reset this counter to zero? Export a backup first. This also replaces any unreadable saved data.'
    )
  )
    return;
  previous = damaged ? null : count;
  damaged = false;
  savedRaw = null;
  count = 0;
  persist();
  render();
});
byId('export').addEventListener('click', () =>
  download(
    JSON.stringify(counter.snapshot(count, updatedAt), null, 2),
    'fortnite-chest-count.json',
    'application/json'
  )
);
byId('original').addEventListener('click', () =>
  download(savedRaw ?? '', 'original-counter-data.txt', 'text/plain')
);
document.addEventListener('keydown', (event) => {
  if (
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    damaged
  )
    return;
  if (
    event.target instanceof Element &&
    event.target.closest(
      'input, textarea, select, button, a, [contenteditable]'
    )
  )
    return;
  if (event.code === 'Space') {
    event.preventDefault();
    setCount(counter.change(count, 1));
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    setCount(counter.change(count, -1));
  }
});
render();
