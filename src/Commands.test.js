/* eslint-env jest */

import commands from './Commands';

function verifyCommandAndExample(cmd) {
  expect(typeof cmd.command).toBe('string');
  expect(typeof cmd.example).toBe('string');
}

describe('LaTeX Commands', () => {
  test('commands is an array', () => {
    expect(commands.constructor).toBe(Array);
  })
  for (const cmd of commands) {
    it(`Command is valid: ${cmd.command}`, () => {
      verifyCommandAndExample(cmd);
      expect(cmd.descriptions).toBeDefined();
      expect(cmd.descriptions.constructor).toBe(Array);
      for (const desc of cmd.descriptions) {
        expect(typeof desc).toBe('string');
      }

      if (cmd.variants) {
        expect(cmd.variants.constructor).toBe(Array);
        for (const variant of cmd.variants) {
          verifyCommandAndExample(variant);
        }
      }
    })
  }
})