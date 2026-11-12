/* MIT License. Copyright (c) 2026 LootCounter contributors. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ChestCounter = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX = 10000000;
  function validCount(value) {
    return (
      typeof value === 'number' &&
      Number.isSafeInteger(value) &&
      value >= 0 &&
      value <= MAX
    );
  }
  function parseCount(text) {
    if (typeof text !== 'string' || !/^\d+$/.test(text.trim())) return null;
    const value = Number(text.trim());
    return validCount(value) ? value : null;
  }
  function snapshot(count, updatedAt) {
    if (
      !validCount(count) ||
      typeof updatedAt !== 'string' ||
      !Number.isFinite(Date.parse(updatedAt))
    ) {
      throw new TypeError('Invalid counter record');
    }
    return { version: 1, count, updatedAt };
  }
  function readSnapshot(raw) {
    try {
      if (typeof raw !== 'string' || raw.length > 4096) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== 1) return null;
      return snapshot(data.count, data.updatedAt);
    } catch {
      return null;
    }
  }
  function change(count, delta) {
    if (!validCount(count) || ![-1, 1].includes(delta))
      throw new TypeError('Invalid change');
    return Math.min(MAX, Math.max(0, count + delta));
  }
  return Object.freeze({
    MAX,
    validCount,
    parseCount,
    snapshot,
    readSnapshot,
    change,
  });
});
