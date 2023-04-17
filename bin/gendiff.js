#!/usr/bin/env node
import { program } from 'commander';
import { genDiffFiles } from '../src/gendiff.js';
import { stylish, plain, json } from '../src/formatters';

program.name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    switch (options.format) {
      case 'stylish':
        console.log(genDiffFiles(filepath1, filepath2, stylish));
        break;
      case 'plain':
        console.log(genDiffFiles(filepath1, filepath2, plain));
        break;
      case 'json':
        console.log(genDiffFiles(filepath1, filepath2, json));
        break;
      default:
        throw new Error(`unknown format: ${options.format}`);
    }
  });

program.parse();
