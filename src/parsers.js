import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

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

export default retriveObjectFromFile;
