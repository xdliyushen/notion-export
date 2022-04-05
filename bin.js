#!/usr/bin/env node

const { program } = require('commander');
const exportService = require('./index.js');

program
    .requiredOption('--email <email>', 'notion email required')
    .requiredOption('--password <password>', 'password required!')
    .option('--block-id <block...>', 'block')
    .option('--export-type <exportType>', 'export type', 'markdown')
    .parse();

exportService(program.opts());