#!/usr/bin/env node

const yargs = require('yargs');

const options = {
    'src': {
        alias: 's',
        describe: 'Directory with the icons folder',
        type: 'string'
    },
    'output': {
        alias: 'o',
        describe: 'Where to output the code',
        type: 'string'
    }
};

const argv = yargs
    .usage('$0 --src <dir> --output <dir>')
    .command('svg-to-react', 'Convert SVGs to react components')
    .example('$0 -s ./images -o ./output')
    .options(options)
    .strict()
    .help('h')
    .alias('h', 'help')
    .demandOption(['s', 'o'])
    .argv;

(async () => {
    try {
        await require('../src/componentiser').create(argv);
    } catch (e) {
        console.error('Failed to load svgs!');
        console.error(e);
    }
})();