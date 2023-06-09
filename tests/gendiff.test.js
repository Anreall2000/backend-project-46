import { fileURLToPath } from 'url';
import path from 'path';
import genDiffFiles from '../src/formatters';

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

  expect(genDiffFiles(jsonFile1, jsonFile2, 'stylish')).toBe(answer);

  const ymlFile1 = path.join(dirname, '..', '__fixtures__', 'file1.yml');
  const ymlFile2 = path.join(dirname, '..', '__fixtures__', 'file2.yml');

  expect(genDiffFiles(ymlFile1, ymlFile2, 'stylish')).toBe(answer);
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

  expect(genDiffFiles(jsonFile1, jsonFile2, 'stylish')).toBe(answer);
});

test('plainDeepFiles', () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const jsonFile1 = path.join(dirname, '..', '__fixtures__', 'file3.json');
  const jsonFile2 = path.join(dirname, '..', '__fixtures__', 'file4.json');

  const answer = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

  expect(genDiffFiles(jsonFile1, jsonFile2, 'plain')).toBe(answer);
});

test('jsonDeepFiles', () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const jsonFile1 = path.join(dirname, '..', '__fixtures__', 'file3.json');
  const jsonFile2 = path.join(dirname, '..', '__fixtures__', 'file4.json');

  expect(() => JSON.parse(genDiffFiles(jsonFile1, jsonFile2, 'json'))).not.toThrow();
});
