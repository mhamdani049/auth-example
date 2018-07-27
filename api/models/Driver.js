module.exports = {
	attributes: {
		id: {
			type: 'integer',
			primaryKey: true,
		},
		employee: {
			model: 'User'
		},
		nopol: {
			type: 'string',
			unique: true,
		}
	}
}