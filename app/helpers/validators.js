var semver = require('semver');

module.exports = {
	isSlug: function(value) 
	{
		return /^[a-z0-9\-]{4,}$/.test(value);
	},
	isStatus: function(value) 
	{
		return ['prod','dev','qa','stage'].indexOf(value) > -1;
	},
	isCommit: function(value) 
	{
		return /^[a-z0-9]{40}$/.test(value);
	},
	isSemver: function(value)
	{
		return !!semver.valid(value);
	},
	isToken: function(value)
	{
		return /^[a-z0-9]{40}$/.test(value);
	},
	isBundleId: function(value)
	{
		return /^[a-zA-Z0-9\.\-]{3,}$/.test(value);
	},
	isBranch: function(value)
	{
		return /^[a-zA-Z0-9_\-\/]*[a-zA-Z0-9]$/.test(value);
	}
};