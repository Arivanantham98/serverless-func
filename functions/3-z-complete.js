require("dotenv").config();
const Airtable = require("airtable-node");

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base("appPs1829Fm4JuJEz")
  .table("products");

exports.handler = async (event, context, cb) => {
  const { id } = event.queryStringParameters;
  if (id) {
    try {
      const product = await airtable.retrieve(id);
      if (product.error) {
        return {
          
          statusCode: 404,
          body: `No product with id: ${id}`,
        };
      }
      return {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: `Server Error`,
      }
    }
  }
  try {
    const { records } = await airtable.list();
    const products = records.map((product) => {
      const { id } = product;
      const { name, image, price ,company,shipping,featured,category} = product.fields;
      const url = image[0].url;
      return { id, name, url, price,company,shipping,featured,category};
    })
    return {
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        },
      statusCode: 200,
      body: JSON.stringify(products),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: "Server Error",
    };
  }
}
