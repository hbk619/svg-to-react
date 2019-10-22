import React from 'react';
import t from 'prop-types';

const icons = {
    OtherSvg: {
        className: '',
        viewBox: '0 0 100 20',
        contents: (
            <g>
                test1
            </g>
        )
    },
    SomeFile: {
        className: '',
        viewBox: '0 0 200 60',
        contents: (
            <g>
                <text y="15" transform="rotate(30 20 40)">I love SVG</text><text y="15" transform="rotate(130 20 140)">I love SVG</text>Sorry, your browser does not support inline SVG.
            </g>
        )
    }

};

const Icon = ({ name, size, className, style, ...props }) => {
    const ChosenIcon = icons[name];

    if (!ChosenIcon) {
        throw new Error(`Cannot find icon '${name}'`);
    }

    return (
        <svg
            {...props}
            width={size}
            height={size}
            viewBox={ChosenIcon.viewBox}
            style={{ ...style, width: size, height: size }}
            className={`${className ? className + ' ' : ''}Icon ${ChosenIcon.className}`}>
            {ChosenIcon.contents}
        </svg>
    );
};

Icon.propTypes = {
    name: t.string,
    className: t.string,
    size: t.number,
    style: t.object
};

Icon.defaultProps = {
    size: 25
};

export default Icon;

export const OtherSvg = (props) => <Icon {...props} name="OtherSvg" />;
export const SomeFile = (props) => <Icon {...props} name="SomeFile" />;

