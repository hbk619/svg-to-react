const mock = require('mock-fs');
const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('componentiser', () => {
    let writeStub, readStub, readDirStub;
    const file =  '<svg height="60" width="200">\n' +
        '  <text x="0" y="15" fill="red" transform="rotate(30 20,40)">I love SVG</text>\n' +
        '  <text x="0" y="15" fill="blue" transform="rotate(130 20,140)">I love SVG</text>\n' +
        '  Sorry, your browser does not support inline SVG.\n' +
        '</svg>';
    const file2 = '<svg version="1.1" width="100" height="20">\n' +
        '    test1\n' +
        '</svg>\n';

    beforeEach(() => {
        writeStub = sinon.stub(fs, 'writeFile').yields(null);
        readDirStub = sinon.stub(fs, 'readdir').yields(null, ['some-file.svg', 'otherSvg.svg']);
        readStub = sinon.stub(fs, 'readFile');
        readStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/some-file.svg')).yields(null, file);
        readStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/otherSvg.svg')).yields(null, file2);
        readStub.callThrough();
    });

    afterEach(() => {
        mock.restore();
    });

    it('should load svgs from supplied folder and create react components', async () => {
        const compontiser = require('./componentiser');
        const components = await compontiser.componentise({
            src: 'path/to/fake/dir'
        });

        sinon.assert.calledWith(readDirStub, 'path/to/fake/dir');
        expect(components.length).to.equal(2);

        const someFileComponent = components.find((item) => item.name === 'SomeFile');
        expect(someFileComponent).not.to.equal(undefined);
        expect(someFileComponent.contents).to.equal('<text y="15" transform="rotate(30 20 40)">I love SVG</text><text y="15" transform="rotate(130 20 140)">I love SVG</text>Sorry, your browser does not support inline SVG.');
        expect(someFileComponent.viewBox).to.equal('0 0 200 60');

        const otherSvgComponent = components.find((item) => item.name === 'OtherSvg');
        expect(otherSvgComponent).not.to.equal(undefined);
        expect(otherSvgComponent.contents).to.equal('test1');
        expect(otherSvgComponent.viewBox).to.equal('0 0 100 20');

        await compontiser.createOutput('src', 'test/index.js', components);

        sinon.assert.calledWith(writeStub, 'test/index.js', fs.readFileSync('src/test-output.js').toString());
    });
});