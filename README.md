# json-schema-aopromise
[JSON Schema](http://json-schema.org/examples.html) validator and filter aspect for
[aopromise](https://www.npmjs.com/package/aopromise) aspect oriented programming toolkit, using [tv4](https://www.npmjs.com/package/tv4). 
Useful for type-hint-like parameter validation.

## Quick start
### Argument validation
You can use the aspect by passing the schemas for each argument of the wrapped function you want to validate

```javascript
aop = require('aopromise');
aop.register('validated', require('json-schema-aopromise').Validator);

var userSchema = getUserSchema();

userService.save = aop()
	.validated(userSchema) // schema for the first argument, you may an array for multiple arguments
	.fn(function (user) {
		// user object is valid
	});

userService.save({
    "id": "invalidId", // not a number
    "name": "John Doe",
    "gender": "DUCK!" // not in enum
}).catch(function (errs) { // will fail, so
    errs.forEach(function (e) {
        return console.error(e.message)
    });
});


// declaring schema
// more info at http://json-schema.org/examples.html
function getUserSchema() {
	return {
		"title": "User schema",
		"type": "object",
		"properties": {
			"id": {
				"type": "integer"
			},
			"name": {
				"type": "string"
			},
			"gender": {
				"type": "string",
				enum: ['male', 'female']
			}

		},
		"required": ["name"]
	};
}
```