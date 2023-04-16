import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const firstObjectOnlyKeys = (o1, o2) => {
  const keys = Object.keys(o1).filter((el) => !Object.keys(o2).includes(el));
  return new Set(keys);
};

const genDiff = (o1, o2) => {
  const allKeys = _.sortBy([...new Set([...Object.keys(o1), ...Object.keys(o2)])], (el) => el);

  const obj1OnlyKeys = firstObjectOnlyKeys(o1, o2);
  const obj2OnlyKeys = firstObjectOnlyKeys(o2, o1);

  const mutualKeys = Object.keys(o1).filter((el) => Object.keys(o2).includes(el));
  const sameValueKeys = new Set(mutualKeys.filter((el) => o1[el] === o2[el]));

  const diffOutputArr = allKeys.reduce((diff, key) => {
    if (obj1OnlyKeys.has(key)) {
      return [...diff, `- ${key}: ${o1[key]}`];
    }
    if (obj2OnlyKeys.has(key)) {
      return [...diff, `+ ${key}: ${o2[key]}`];
    }
    if (sameValueKeys.has(key)) {
      return [...diff, `  ${key}: ${o1[key]}`];
    }
    return [...diff, `- ${key}: ${o1[key]}`, `+ ${key}: ${o2[key]}`];
  }, []);
  return `{\n  ${diffOutputArr.join('\n  ')}\n}`;
};

const getFileType = (fileName) => {
  if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
    return 'yaml';
  }
  if (fileName.endsWith('.json')) {
    return 'json';
  }
  return '';
};

const retriveObjectFromFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const type = getFileType(filepath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  switch (type) {
    case 'json':
      return JSON.parse(content);
    case 'yaml':
      return yaml.load(content);
    default:
      throw new Error('Unknown file type');
  }
};

const genDiffFiles = (filepath1, filepath2) => {
  const obj1 = retriveObjectFromFile(filepath1);
  const obj2 = retriveObjectFromFile(filepath2);
  return genDiff(obj1, obj2);
};

export { genDiffFiles };
export default genDiff;
