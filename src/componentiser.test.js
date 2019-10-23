const path = require('path');
const fs = require('fs').promises;
const expect = require('chai').expect;
const sinon = require('sinon');
const assert = require('assert');

describe('componentiser', () => {
    let writeStub, readStub, readDirStub, statStub, sandbox;
    const file = '<svg height="60" width="200">\n' +
        '  <text x="0" y="15" fill="red" transform="rotate(30 20,40)">I love SVG</text>\n' +
        '  <text x="0" y="15" fill="blue" transform="rotate(130 20,140)">I love SVG</text>\n' +
        '  Sorry, your browser does not support inline SVG.\n' +
        '</svg>';
    const file2 = '<svg version="1.1" width="100" height="20">\n' +
        '    test1\n' +
        '</svg>\n';

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        writeStub = sandbox.stub(fs, 'writeFile').returns(Promise.resolve());
        readDirStub = sandbox.stub(fs, 'readdir').returns(Promise.resolve(['some-file.svg', 'otherSvg.svg', 'test.jpg', 'some-dir.svg']));

        readStub = sandbox.stub(fs, 'readFile');
        readStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/some-file.svg')).returns(Promise.resolve(file));
        readStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/otherSvg.svg')).returns(Promise.resolve(file2));
        readStub.callThrough();

        statStub = sandbox.stub(fs, 'stat');
        statStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/some-file.svg')).returns(Promise.resolve({isFile: sinon.stub().returns(true)}));
        statStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/otherSvg.svg')).returns(Promise.resolve({isFile: sinon.stub().returns(true)}));
        statStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/test.jpg')).returns(Promise.resolve({isFile: sinon.stub().returns(true)}));
        statStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/some-dir.svg')).returns(Promise.resolve({isFile: sinon.stub().returns(false)}));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('writes the template correctly', async () => {
        const componentiser = require('./componentiser');
        const components = [

            {
                "name": "OtherSvg",
                "contents": "test1",
                "viewBox": "0 0 100 20"
            },
            {
                "name": "SomeFile",
                "contents": "<text y=\"15\" transform=\"rotate(30 20 40)\">I love SVG</text><text y=\"15\" transform=\"rotate(130 20 140)\">I love SVG</text>Sorry, your browser does not support inline SVG.",
                "viewBox": "0 0 200 60"
            }
        ];

        const expectedOuput = await fs.readFile('src/test-output.js');
        await componentiser.createOutput('src', 'test/index.js', components);

        sinon.assert.calledWith(writeStub, 'test/index.js', expectedOuput.toString());
    });

    it('should load svgs from supplied folder and create react components', async () => {
        const componentiser = require('./componentiser');
        const components = await componentiser.componentise({
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
    });

    it('should throw an error if no svgs found', async () => {
        const componentiser = require('./componentiser');
        statStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/mario.jpg')).returns(Promise.resolve({isFile: sinon.stub().returns(true)}));
        statStub.withArgs(path.resolve(process.cwd(), 'path/to/fake/dir/peach.png')).returns(Promise.resolve({isFile: sinon.stub().returns(true)}));

        readDirStub.returns(Promise.resolve(['mario.jpg', 'peach.png']));

        await assert.rejects(async () => {
            await componentiser.componentise({
                src: 'path/to/fake/dir'
            });
        },
            {
                name: 'Error',
                message: 'No svgs found!'
            });
    });
});