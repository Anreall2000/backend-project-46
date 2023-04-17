import { fileURLToPath } from 'url';
import path from 'path';
import { genDiffFiles } from '../src/gendiff.js';
import { stylish, plain, json } from '../src/formatters';

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

  expect(genDiffFiles(jsonFile1, jsonFile2, plain)).toBe(answer);
});

test('jsonDeepFiles', () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const jsonFile1 = path.join(dirname, '..', '__fixtures__', 'file3.json');
  const jsonFile2 = path.join(dirname, '..', '__fixtures__', 'file4.json');

  const answer = [{
    key: 'common',
    type: 'changedLater',
    value: [{ key: 'follow', type: 'added', value: false }, { key: 'setting1', type: 'unchanged', value: 'Value 1' }, { key: 'setting2', type: 'removed', value: 200 }, {
      before: true, current: null, key: 'setting3', type: 'updated',
    }, { key: 'setting4', type: 'added', value: 'blah blah' }, { key: 'setting5', type: 'added', value: { key5: 'value5' } }, {
      key: 'setting6',
      type: 'changedLater',
      value: [{
        key: 'doge',
        type: 'changedLater',
        value: [{
          before: '', current: 'so much', key: 'wow', type: 'updated',
        }],
      }, { key: 'key', type: 'unchanged', value: 'value' }, { key: 'ops', type: 'added', value: 'vops' }],
    }],
  }, {
    key: 'group1',
    type: 'changedLater',
    value: [{
      before: 'bas', current: 'bars', key: 'baz', type: 'updated',
    }, { key: 'foo', type: 'unchanged', value: 'bar' }, {
      before: { key: 'value' }, current: 'str', key: 'nest', type: 'updated',
    }],
  }, { key: 'group2', type: 'removed', value: { abc: 12345, deep: { id: 45 } } }, { key: 'group3', type: 'added', value: { deep: { id: { number: 45 } }, fee: 100500 } }];

  expect(genDiffFiles(jsonFile1, jsonFile2, json)).toEqual(answer);
});
