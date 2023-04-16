import { fileURLToPath } from 'url';
import path from 'path';
import genDiff, { genDiffFiles } from '../src/gendiff.js';

test('flatList', () => {
  const obj1 = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };
  const obj2 = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };

  const answer = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  expect(genDiff(obj1, obj2)).toBe(answer);
});

test('flatFiles', () => {
  const answer = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const p1 = path.join(dirname, '..', '__fixtures__', 'file1.json');
  const p2 = path.join(dirname, '..', '__fixtures__', 'file2.json');

  expect(genDiffFiles(p1, p2)).toBe(answer);
});
