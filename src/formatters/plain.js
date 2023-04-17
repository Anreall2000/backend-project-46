import genDiff from '../gendiff.js';

function isObject(value) {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
  );
}

const plainValue = (val) => {
  if (isObject(val)) {
    return '[complex value]';
  }
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  return `${val}`;
};

const plain = (o1, o2) => {
  const struct = genDiff(o1, o2);
  const plainTraversal = (node, path = []) => {
    const repr = node.filter((el) => el.type !== 'unchanged')
      .map((el) => {
        switch (el.type) {
          case 'removed':
            return `Property '${[...path, el.key].join('.')}' was removed`;
          case 'added':
            return `Property '${[...path, el.key].join('.')}' was added with value: ${plainValue(el.value)}`;
          case 'changedLater':
            return plainTraversal(el.value, [...path, el.key]);
          case 'updated':
            return `Property '${[...path, el.key].join('.')}' was updated. From ${plainValue(el.before)} to ${plainValue(el.current)}`;
          default:
            throw new Error(`unknown type ${el.type}`);
        }
      });
    return repr.join('\n');
  };
  return plainTraversal(struct);
};

export default plain;
