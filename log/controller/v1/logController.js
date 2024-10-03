
const DB = require("../../../common/couchdb");

const getAllLog = async (req, res) => {
    try {
        // Building the query object
        // Create an index for the _id field
        const indexDefinition = {
            index: {
                fields: ['_id']
            },
            name: 'index-_id',
            type: 'json'
        };

        // Create the index
        await DB.createIndex(indexDefinition);

        // Extract query parameters from the request
        const { paymentGatewayName, paymentLinkId, tag } = req.query;

        const selector = {
            collectionName: "Log", // Adding the collectionName filter
        };

        // Add additional filters if provided
        if (paymentGatewayName) {
            selector.paymentGatewayName = paymentGatewayName;
        }

        if (paymentLinkId) {
            selector.paymentLinkId = paymentLinkId;
        }

        if (tag) {
            selector.tag = tag;
        }

        const result = await DB.find({
            selector,
            sort: [{ "_id": "desc" }], // Sort by "_id" in descending order (latest first)
        });

        console.log(result.docs.length);

        const response = {
            docs: result.docs,
            totalDocs: result.docs.length,
            success: true,
        };

        res.json(response);
    } catch (error) {
        // Handling errors
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





module.exports = {
    getAllLog
};
