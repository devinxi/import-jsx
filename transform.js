'use strict';
// Only load these if compiled source is not already cached
let babel;
let jsxTransform;

const transform = (source, options, modulePath) => {
	if (!babel) {
		babel = require('@babel/core');
		// jsxTransform = require('@babel/plugin-transform-react-jsx');
	}

	// if (source.includes('React')) {
	// 	options.pragma = 'React.createElement';
	// 	options.pragmaFrag = 'React.Fragment';
	// }

	// const plugins = [
	// 	[
	// 		jsxTransform,
	// 		{
	// 			pragma: options.pragma,
	// 			pragmaFrag: options.pragmaFrag,
	// 			useBuiltIns: true
	// 		}
	// 	]
	// ].filter(Boolean);

	const result = babel.transformSync(source, {
		// {
		presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
		plugins: [
			[
				'babel-plugin-transform-rename-import',
				{
					original: 'solid-js',
					replacement: options.importPath
				}
			],
			[
				'babel-plugin-jsx-dom-expressions',
				{moduleName: options.importPath, generate: 'universal'}
			]
		],
		// },
		filename: modulePath,
		sourceMaps: 'inline',
		babelrc: false,
		configFile: false
	});

	return result.code;
};

module.exports = transform;
