import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';
import retriveObjectFromFile from '../parsers.js';

const genDiffFilesRaw = (filepath1, filepath2, method) => {
  const obj1 = retriveObjectFromFile(filepath1);
  const obj2 = retriveObjectFromFile(filepath2);
  return method(obj1, obj2);
};

const genDiffFiles = (filepath1, filepath2, format = 'stylish') => {
  switch (format) {
    case 'stylish':
      return genDiffFilesRaw(filepath1, filepath2, stylish);
    case 'plain':
      return genDiffFilesRaw(filepath1, filepath2, plain);
    case 'json':
      return genDiffFilesRaw(filepath1, filepath2, json);
    default:
      throw new Error(`unknown format: ${format}`);
  }
};

export { stylish, plain, json };
export default genDiffFiles;
