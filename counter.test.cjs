const test = require('node:test');
const assert = require('node:assert/strict');
const counter = require('./counter.js');
test('count boundaries do not admit missing, fractional, negative or unsafe values', () => {
  for (const value of [
    '',
    ' ',
    '1.5',
    '-1',
    'Infinity',
    '1e3',
    '10000001',
    '12x',
  ])
    assert.equal(counter.parseCount(value), null);
  assert.equal(counter.parseCount(' 120 '), 120);
  assert.equal(counter.change(0, -1), 0);
  assert.equal(counter.change(counter.MAX, 1), counter.MAX);
  assert.equal(counter.change(12, 1), 13);
  assert.throws(() => counter.change(-1, 1));
});
test('export round trip and malformed saved data', () => {
  const expected = {
    version: 1,
    count: 23,
    updatedAt: '2026-11-12T00:00:00.000Z',
  };
  assert.deepEqual(
    counter.readSnapshot(
      JSON.stringify(counter.snapshot(23, expected.updatedAt))
    ),
    expected
  );
  for (const raw of [
    null,
    '',
    '{bad',
    'null',
    '{}',
    JSON.stringify({ ...expected, version: 2 }),
    JSON.stringify({ ...expected, count: -1 }),
    JSON.stringify({ ...expected, updatedAt: 'bad' }),
  ])
    assert.equal(counter.readSnapshot(raw), null);
});
