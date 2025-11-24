import { sum } from '../src/sum';

describe('Pruebas en sum.ts', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});