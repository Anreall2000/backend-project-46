import _ from 'lodash';
import { genDiff } from '../gendiff.js';

function isObject(value) {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
  );
}

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

export default stylish;
