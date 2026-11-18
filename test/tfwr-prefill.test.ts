import { test } from 'node:test'
import assert from 'node:assert/strict'

import { parseScriptPrefill } from '../app/utils/tfwr-prefill.ts'

test('no comment yields none', () => {
  const result = parseScriptPrefill('plant(Entities.Grass)\nmove(East)')
  assert.equal(result.status, 'none')
  assert.deepEqual(result.items, {})
})

test('single line prefill', () => {
  const result = parseScriptPrefill('# {"wood":100000}\nplant(Entities.Grass)')
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.items, { wood: 100000 })
})

test('first comment may follow code and span multiple lines', () => {
  const source = [
    'import Test',
    '# {',
    '#   "wood": 1000,',
    '#   "carrot": 1000',
    '# }',
    'a= 10',
    '# this comment should not be even processed because it\'s second comment',
  ].join('\n')
  const result = parseScriptPrefill(source)
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.items, { wood: 1000, carrot: 1000 })
})

test('second comment is never processed', () => {
  const result = parseScriptPrefill('# {"wood": 5}\n# {"bone": 9}')
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.items, { wood: 5 })
})

test('comment that is not JSON is ignored', () => {
  const result = parseScriptPrefill('# just a note\n# {"wood": 5}')
  assert.equal(result.status, 'none')
})

test('hash inside strings is not a comment', () => {
  const result = parseScriptPrefill('s = "# not a comment"\nprint(s)\n# {"wood": 7}')
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.items, { wood: 7 })
})

test('hash inside triple-quoted string is not a comment', () => {
  const source = 's = """\n# {"wood": 1}\n"""\n# {"hay": 2}'
  const result = parseScriptPrefill(source)
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.items, { hay: 2 })
})

test('escaped quote inside string keeps quote open', () => {
  const source = 's = "a\\" # nope"\n# {"hay": 2}'
  const result = parseScriptPrefill(source)
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.items, { hay: 2 })
})

test('JSON array is not treated as a prefill', () => {
  const result = parseScriptPrefill('# [1, 2]')
  assert.equal(result.status, 'none')
})

test('malformed JSON is an error', () => {
  const result = parseScriptPrefill('# { "wood": }')
  assert.equal(result.status, 'error')
})

test('negative amount is an error', () => {
  const result = parseScriptPrefill('# {"wood": -5}')
  assert.equal(result.status, 'error')
  assert.match(result.message ?? '', /wood/)
})

test('non-integer amount is an error', () => {
  const result = parseScriptPrefill('# {"wood": 1.5}')
  assert.equal(result.status, 'error')
})

test('trailing text after comment block is not appended to JSON', () => {
  const result = parseScriptPrefill('# {"wood": 1}\nmove(East) # tail')
  assert.equal(result.status, 'ok')
  assert.deepEqual(result.items, { wood: 1 })
})
