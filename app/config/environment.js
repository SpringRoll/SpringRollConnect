module.exports = {
	development: 
	{
		spaces: 4,
		errorHandlerOptions: {
			dumpExceptions: true, 
			showStack: true
		}
	},
	production: 
	{
		spaces: 0,
		errorHandlerOptions: {
			dumpExceptions: false, 
			showStack: false
		}
	}
};
