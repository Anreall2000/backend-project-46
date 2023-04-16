import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const genDiff = (o1, o2) => {
  const allKeys = _.sortBy([...new Set([...Object.keys(o1), ...Object.keys(o2)])], (el) => el);
  const obj1OnlyKeys = new Set(Object.keys(o1).filter((el) => !Object.keys(o2).includes(el)));
  const obj2OnlyKeys = new Set(Object.keys(o2).filter((el) => !Object.keys(o1).includes(el)));
  const mutualKeys = Object.keys(o1).filter((el) => Object.keys(o2).includes(el));
  const sameValueKeys = new Set(mutualKeys.filter((el) => o1[el] === o2[el]));
  const differentValueKeys = new Set(mutualKeys.filter((el) => o1[el] !== o2[el]));

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
    if (differentValueKeys.has(key)) {
      return [...diff, `- ${key}: ${o1[key]}`, `+ ${key}: ${o2[key]}`];
    }
    return diff;
  }, []);
  return `{\n  ${diffOutputArr.join('\n  ')}\n}`;
};

const genDiffFiles = (filepath1, filepath2) => {
  const p1 = path.resolve(process.cwd(), filepath1);
  const p2 = path.resolve(process.cwd(), filepath2);

  const f1 = fs.readFileSync(p1, 'utf8');
  const f2 = fs.readFileSync(p2, 'utf8');

  const obj1 = JSON.parse(f1);
  const obj2 = JSON.parse(f2);
  return genDiff(obj1, obj2);
};

export { genDiffFiles };
export default genDiff;
