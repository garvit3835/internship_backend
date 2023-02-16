const updateToken = async(token, id) => {
    const connect = require("./connect")
	let collection = await connect() 
	
	await collection.updateOne(              
		{ _id: id },
		{ $set: { token: token} }
	)
}

module.exports = updateToken