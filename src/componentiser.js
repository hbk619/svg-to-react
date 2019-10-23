const fs = require('fs').promises;
const SVGO = require('svgo');
const path = require('path');
const camelCase = require('lodash.camelcase');
const upperFirst = require('lodash.upperfirst');
const template = require('lodash.template');
const svgoConfig = require('./svgo');
const svgo = new SVGO(svgoConfig);

const cheerio = require('cheerio');

const getComponent =  async (filePath, fileName) => {
    const contents = await fs.readFile(filePath);
    const optimised = await svgo.optimize(contents, { path: filePath});
    const fileNameWithoutExtension = path.parse(fileName).name;
    const $ = cheerio.load(optimised.data);
    const svg = $('svg');
    return {
        name: upperFirst(camelCase(fileNameWithoutExtension)),
        contents: svg.html(),
        viewBox: svg.attr('viewBox')
    }
};

const create = async (config) => {
    const components = await componentise(config);
    await createOutput('./', config.outputPath, {icons: components});
};

const componentise = async (config) => {

    const files = await fs.readdir(config.src);

    const promises = await files.map(fileName => {
        return getComponent(path.resolve(config.src, fileName), fileName);
    });

    return Promise.all(promises);

};

const createOutput = async (inputPath, outputPath, props) => {
    var templateSettings = require('lodash.templatesettings');

    const templateContents = await fs.readFile(`${inputPath}/template.js`);
    templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

    const compiled = template(templateContents.toString());
    const output = compiled({ icons: props });

    return fs.writeFile(outputPath, output);
};

module.exports = { create, componentise, createOutput };