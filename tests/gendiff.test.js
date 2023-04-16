import { fileURLToPath } from 'url';
import path from 'path';
import { genDiffFiles, stylish } from '../src/gendiff.js';

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

  expect(stylish(obj1, obj2)).toBe(answer);
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
  const jsonFile1 = path.join(dirname, '..', '__fixtures__', 'file1.json');
  const jsonFile2 = path.join(dirname, '..', '__fixtures__', 'file2.json');

  expect(genDiffFiles(jsonFile1, jsonFile2, stylish)).toBe(answer);

  const ymlFile1 = path.join(dirname, '..', '__fixtures__', 'file1.yml');
  const ymlFile2 = path.join(dirname, '..', '__fixtures__', 'file2.yml');

  expect(genDiffFiles(ymlFile1, ymlFile2, stylish)).toBe(answer);
});

test('deepFiles', () => {
  const answer = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const jsonFile1 = path.join(dirname, '..', '__fixtures__', 'file3.json');
  const jsonFile2 = path.join(dirname, '..', '__fixtures__', 'file4.json');

  console.log(genDiffFiles(jsonFile1, jsonFile2, stylish));

  expect(genDiffFiles(jsonFile1, jsonFile2, stylish)).toBe(answer);
});
