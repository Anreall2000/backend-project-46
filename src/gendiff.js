import _ from 'lodash';

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
      return [...diff, {
        type: 'removed',
        key,
        value: o1[key],
      }];
    }
    if (obj2OnlyKeys.has(key)) {
      return [...diff, {
        type: 'added',
        key,
        value: o2[key],
      }];
    }
    if (sameValueKeys.has(key)) {
      return [...diff, {
        type: 'unchanged',
        key,
        value: o1[key],
      }];
    }
    if (isObject(o1[key]) && isObject(o2[key])) {
      return [...diff, {
        type: 'changedLater',
        key,
        value: genDiff(o1[key], o2[key]),
      }];
    }
    return [...diff, {
      type: 'updated',
      key,
      before: o1[key],
      current: o2[key],
    }];
  }, []);
  return diffOutputArr;
};

export default genDiff;
