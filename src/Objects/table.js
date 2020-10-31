var AWS = require("aws-sdk");

/* LOCALLY */
AWS.config.update({
    region: "eu-west-2",
    endpoint: "http://localhost:8000"
});
  
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues : true
});

module.exports = {
    tableExists(tableName) {
        return new Promise((resolve,reject) => {
            var params = {
                TableName: tableName /* required */
            };
            dynamodb.describeTable(params, function(err, data) {
                if (err) {
                    reject(err); // an error occurred
                }
                else {
                    resolve(data); // successful response
                }
            });
        });
    },

    getItems(params) {
        return new Promise((resolve,reject) => {
            docClient.scan(params, function onScan(err, data) {
                if (err) {
                    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    //console.log("Scan succeeded! Found " + data.Count + " items.");
                    resolve(data.Items);
                }
            });
        });
    },

    putItem(params) {
        return new Promise((resolve,reject) => {
            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    //console.log("Added item:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            });
        });
    },

    removeItem(params) {
        return new Promise((resolve,reject) => {
            docClient.delete(params, function(err, data) {
                if (err) {
                    console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    //console.log("Deleted item:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            });
        });
    },

    putItems(params) {
        docClient.batchWrite(params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              //console.log("Success", JSON.stringify(data, null, 2));
            }
          });
    },

    createTable(params) {
        return new Promise((resolve,reject) => {
            dynamodb.createTable(params, function(err, data) {
                if (err) {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                    reject("false");
                } else {
                    //console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                    resolve("true");
                }
            });
        });
    }
}