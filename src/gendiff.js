import _ from 'lodash';
import retriveObjectFromFile from './parsers.js';

const firstObjectOnlyKeys = (o1, o2) => {
  const keys = Object.keys(o1).filter((el) => !Object.keys(o2).includes(el));
  return new Set(keys);
};

function isObject(value) {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
  );
}

const genDiff = (o1, o2) => {
  const allKeys = _.sortBy([...new Set([...Object.keys(o1), ...Object.keys(o2)])], (el) => el);

  const obj1OnlyKeys = firstObjectOnlyKeys(o1, o2);
  const obj2OnlyKeys = firstObjectOnlyKeys(o2, o1);

  const mutualKeys = Object.keys(o1).filter((el) => Object.keys(o2).includes(el));
  const sameValueKeys = new Set(mutualKeys.filter((el) => o1[el] === o2[el]));

  const diffOutputArr = allKeys.reduce((diff, key) => {
    if (obj1OnlyKeys.has(key)) {
      // return [...diff, `- ${key}: ${o1[key]}`];
      return [...diff, {
        type: 'removed',
        key,
        value: o1[key],
      }];
    }
    if (obj2OnlyKeys.has(key)) {
      // return [...diff, `+ ${key}: ${o2[key]}`];
      return [...diff, {
        type: 'added',
        key,
        value: o2[key],
      }];
    }
    if (sameValueKeys.has(key)) {
      // return [...diff, `  ${key}: ${o1[key]}`];
      return [...diff, {
        type: 'unchanged',
        key,
        value: o1[key],
      }];
    }
    if (isObject(o1[key]) && isObject(o2[key])) {
      // return [...diff, `  ${key}: ${genDiff(o1[key], o2[key])}`];
      return [...diff, {
        type: 'changedLater',
        key,
        value: genDiff(o1[key], o2[key]),
      }];
    }
    // return [...diff, `- ${key}: ${o1[key]}`, `+ ${key}: ${o2[key]}`]
    return [...diff, {
      type: 'updated',
      key,
      before: o1[key],
      current: o2[key],
    }];
  }, []);
  return diffOutputArr;
};

const stylishObject = (obj, level = 0) => {
  const numOfSpaces = (level + 1) * 2;
  const allKeys = _.sortBy(Object.keys(obj), (el) => el);
  const repr = allKeys.map((key) => {
    if (isObject(obj[key])) {
      return `${' '.repeat(numOfSpaces)}  ${key}: ${stylishObject(obj[key], level + 2)}`;
    }
    return `${' '.repeat(numOfSpaces)}  ${key}: ${obj[key]}`;
  });
  return `{\n${repr.join('\n')}\n${' '.repeat(numOfSpaces - 2)}}`;
};

const stylishValue = (val, level = 0) => {
  if (isObject(val)) {
    return stylishObject(val, level);
  }
  return `${val}`;
};

const stylish = (o1, o2) => {
  const struct = genDiff(o1, o2);
  const stylishTraversal = (node, level = 0) => {
    const numOfSpaces = (level + 1) * 2;
    const repr = node.map((el) => {
      switch (el.type) {
        case 'removed':
          return `${' '.repeat(numOfSpaces)}- ${el.key}: ${stylishValue(el.value, level + 2)}`; // + 2 for one level deeper and for "- "
        case 'added':
          return `${' '.repeat(numOfSpaces)}+ ${el.key}: ${stylishValue(el.value, level + 2)}`;
        case 'unchanged':
          return `${' '.repeat(numOfSpaces)}  ${el.key}: ${stylishValue(el.value, level + 2)}`;
        case 'changedLater':
          return `${' '.repeat(numOfSpaces)}  ${el.key}: ${stylishTraversal(el.value, level + 2)}`;
        case 'updated':
          return `${' '.repeat(numOfSpaces)}- ${el.key}: ${stylishValue(el.before, level + 2)}`
          + '\n'
          + `${' '.repeat(numOfSpaces)}+ ${el.key}: ${stylishValue(el.current, level + 2)}`;
        default:
          throw new Error('unknown type');
      }
    });
    return `{\n${repr.join('\n')}\n${' '.repeat(numOfSpaces - 2)}}`;
  };

  return stylishTraversal(struct);
};

const genDiffFiles = (filepath1, filepath2, method) => {
  const obj1 = retriveObjectFromFile(filepath1);
  const obj2 = retriveObjectFromFile(filepath2);
  return method(obj1, obj2);
};

export { genDiffFiles, stylish };
export default stylish;
