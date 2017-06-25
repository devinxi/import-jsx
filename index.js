'use strict';

const path = require('path');
const fs = require('fs');
const requireFromString = require('require-from-string');
const resolveFrom = require('resolve-from');
const callerPath = require('caller-path');
const buble = require('buble');

const cache = new Map();

const importJsx = (moduleId, options) => {
	if (typeof moduleId !== 'string') {
		throw new TypeError('Expected a string');
	}

	const modulePath = resolveFrom(path.dirname(callerPath()), moduleId);

	if (cache.has(modulePath)) {
		return cache.get(modulePath);
	}

	const source = fs.readFileSync(modulePath, 'utf8');

	options = Object.assign({
		pragma: source.includes('React') ? 'React.createElement' : 'h'
	}, options);

	const result = buble.transform(source, {
		transforms: {
			arrow: false,
			classes: false,
			conciseMethodProperty: false,
			templateString: false,
			destructuring: false,
			parameterDestructuring: false,
			defaultParameter: false,
			letConst: false,
			numericLiteral: false,
			exponentiation: false,
			computedProperty: false,
			unicodeRegExp: false
		},

		source: modulePath,
		jsx: options.pragma
	});

	const transpiledSource = `${result.code}\n//# sourceMappingURL=${result.map.toUrl()}`;
	const m = requireFromString(transpiledSource, modulePath);

	cache.set(modulePath, m);

	return m;
};

module.exports = importJsx;

module.exports.create = options => {
	return moduleId => importJsx(moduleId, options);
};