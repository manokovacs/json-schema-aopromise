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
            "email": {
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

#### Options for validator
```javascript
{
    filter: [true|false] // Whether to filter out properties that are no specified on the schema. Default true.
}
```

### Result filter
You may want to filter your function output. An example is when you have users stored in the database and only
a limited set of properties are public for the users of your API, for example skip the password hash. 
In this case you may want to have a limited schema with the public fields of the user and filter the output of the result
with that.
```javascript
var aop = require('aopromise');
aop.register('filtered', require('../lib/json-schema-aopromise').Filter);


userService.get = aop()
	.filtered(getLimitedUserSchema())
	.fn(function (id) {
		return {
			"id": id,
			"name": "Joe",
			"email": "secret@email.com" // this should be filtered out
		}
	});
	
	
userService.get(123).then(function(user){
    console.log(user);
    // outputs user without email: 
    // { id: 123, name: 'Joe' }
});
	
	


function getLimitedUserSchema() {
	var userSchema = getUserSchema(); // using user schema implementation above
	delete userSchema.properties.email;
	return userSchema;
}

```

#### Options for result filter
```javascript
{
    validate: [true|false] // Whether to validate the result against the schema. Default false.
}
```