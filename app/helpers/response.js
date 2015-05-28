var log = require('./logger');

module.exports = function(err, data)
{
	if (err)
	{
		console.error(String(err).red);
		log.error(err);
		this.status(500).send({
			success: false,
			error: err
		});
	}
	else if (!data)
	{
		this.status(404).send({
			success: false,
			error: "No data found"
		});
	}
	else
	{
		this.send({
			success: true,
			data: data
		});
	}
};