import assert from 'node:assert/strict'
import { test } from 'node:test'
import { describePythonError } from '../app/utils/python-error.ts'

test('a plain traceback gives type, summary and frame', () => {
  const description = describePythonError(
    'Traceback (most recent call last):\n'
    + '  File "<string>", line 4, in <module>\n'
    + "NameError: name 'not_a_function' is not defined\n",
  )
  assert.equal(description.type, 'NameError')
  assert.equal(description.summary, "NameError: name 'not_a_function' is not defined")
  assert.equal(description.frame, '<string>, line 4, in <module>')
  assert.match(description.detail, /^Traceback/)
})

test('the deepest frame wins when a call stack is shown', () => {
  const description = describePythonError(
    'Traceback (most recent call last):\n'
    + '  File "<string>", line 2, in <module>\n'
    + '  File "<string>", line 5, in harvest\n'
    + '  File "<string>", line 9, in can_harvest\n'
    + 'TypeError: unsupported operand type(s) for +: \'int\' and \'NoneType\'\n',
  )
  assert.equal(description.type, 'TypeError')
  assert.equal(description.frame, '<string>, line 9, in can_harvest')
})

test('Python 3.11 caret and source lines between frames are skipped', () => {
  const description = describePythonError(
    'Traceback (most recent call last):\n'
    + '  File "<string>", line 1, in <module>\n'
    + '    print(\n'
    + '    ^^^^^\n'
    + "SyntaxError: '(' was never closed\n",
  )
  assert.equal(description.type, 'SyntaxError')
  assert.equal(description.summary, "SyntaxError: '(' was never closed")
  assert.equal(description.frame, '<string>, line 1, in <module>')
})

test('an exception without a message keeps just its type', () => {
  const description = describePythonError(
    'Traceback (most recent call last):\n'
    + '  File "<string>", line 2, in <module>\n'
    + 'KeyboardInterrupt\n',
  )
  assert.equal(description.type, 'KeyboardInterrupt')
  assert.equal(description.summary, 'KeyboardInterrupt')
})

test('a fully qualified type name is kept', () => {
  const description = describePythonError(
    'Traceback (most recent call last):\n'
    + '  File "<string>", line 1, in <module>\n'
    + 'json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)\n',
  )
  assert.equal(description.type, 'json.decoder.JSONDecodeError')
  assert.match(description.summary, /^json\.decoder\.JSONDecodeError: Expecting value/)
})

test('an error without a traceback is reported as-is', () => {
  const description = describePythonError(new Error('Pyodide could not start'))
  assert.equal(description.type, null)
  assert.equal(description.summary, 'Pyodide could not start')
  assert.equal(description.frame, null)
  assert.equal(description.detail, 'Pyodide could not start')
})

test('a traceback that ends in a non-exception line falls back to its first line', () => {
  const description = describePythonError('Traceback (most recent call last):\n')
  assert.equal(description.type, null)
  assert.equal(description.summary, 'Traceback (most recent call last):')
  assert.equal(description.frame, null)
})

test('multi-line details are preserved in full', () => {
  const raw = 'Traceback (most recent call last):\n'
    + '  File "<string>", line 3, in <module>\n'
    + 'ValueError: Unknown item "gold" in prefill comment\n'
  const description = describePythonError(raw)
  assert.equal(description.type, 'ValueError')
  assert.equal(description.summary, 'ValueError: Unknown item "gold" in prefill comment')
  assert.equal(description.detail, raw.trim())
})
