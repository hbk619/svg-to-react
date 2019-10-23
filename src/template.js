import React from 'react';
import t from 'prop-types';

const icons = {
<% icons.map(function(icon, i) { %>    <%= icon.name %>: {
        className: '<%= icon.className %>',
        viewBox: '<%= icon.viewBox %>',
        contents: (
            <g>
                <%= icon.contents %>
            </g>
        )
    }<% if (i < icons.length - 1) { %>,<% } %>
<% }) %>
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

<% icons.map(function(icon, i) {%>export const <%= icon.name %> = (props) => <Icon {...props} name="<%= icon.name %>" />;
<% }) %>
