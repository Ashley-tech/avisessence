import { MongoClient, Collection, ListCollectionsOptions, InsertManyResult, MongoError } from 'mongodb'

function setMongoDBUri() {
  return "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@cluster.hrd92.mongodb.net/"
}

export async function sendCommand<T>(database: string, command: Object, user?: string | undefined, password?: string | undefined): Promise<T | MongoError> {
  const client = new MongoClient(setMongoDBUri()) // New client
  try {
    const getCommand = await client.db(database).command(command)
    const foundJson: T = JSON.parse(JSON.stringify(getCommand))
    return foundJson
  } catch (error) {
    return error as MongoError
  } finally {
    await client.close()
  }
}

export async function getAllCollectionsFromDB(database: string, user?: string | undefined, password?: string | undefined) {
  const client = new MongoClient(setMongoDBUri()) // New client

  let myCollections: Collection[] = []
  const listOptions: ListCollectionsOptions = { nameOnly: true }
  try {
    myCollections = await client.db(database).collections(listOptions)
  } catch (error) {
    return error
  } finally {
    await client.close()
  }

  if (myCollections === null) {
    return null
  }

  let allDb: string[] = []
  myCollections.forEach(element => {
    allDb.push(element.collectionName)
  })

  let allCollections: string[] = []
  let collections: { [name: string]: JSON } = {}
  for (let index = 0; index < allDb.length; index++) {
    const element = allDb[index] // coverage
    collections[element] = await find(database, element, {}, undefined, user, password)
  }

  return JSON.parse(JSON.stringify(collections))
}


/**
 * Get a mongodb document.
 * @param {string} database Database name.
 * @param {string} collection Collection name.
 * @param {string} findkey Key of the document to find for.
 * @param {any} findvalue Value of the document to find for.
 * @param {any} options option applied for the result ---> see find function for example.
 * @param {string | undefined} user User for MongoDb db to force.
 * @param {string | undefined} password Password for MongoDb db to force.
 * @returns {Promise<JSON | null>} Json document or null if not found.
 * @example findOne('github', 'commit', 'sha' , '418ed06c52a3f339af386a7a62121a702d626b18')
 * @author u240370 - u483567
 * @async
 * @public
 */
export async function findOne(database: string, collection: string, findkey: string, findvalue: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<JSON | MongoError> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const myCollection = client.db(database).collection(collection) // Connect to Db & collection
  const query = { [findkey]: findvalue }

  try {
    const found = await myCollection.findOne(query, options)
    return JSON.parse(JSON.stringify(found))
  } catch (error) {
    return error as MongoError
  } finally {
    await client.close()
  }
}

export async function findOneTyped<T>(database: string, collection: string, findkey: string, findvalue: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<T | MongoError> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const myCollection = client.db(database).collection(collection) // Connect to Db & collection
  const query = { [findkey]: findvalue }

  try {
    const found = await myCollection.findOne(query, options)
    const foundJson: T = JSON.parse(JSON.stringify(found))
    return foundJson
  } catch (error) {
    return error as MongoError
  } finally {
    await client.close()
  }
}


/**
 * Find one document and delete it
 * @remark if multiple documents are find with the query, the first document document will be deleted
 * @param {string} database Database name.
 * @param {string} collection Collection name.
 * @param {any} query find documents.
 * @param {any} options optionnals arguments ---> https://www.mongodb.com/docs/v4.4/reference/method/db.collection.findOneAndDelete/
 * {
   writeConcern: <document>,
    projection: <document>,
    sort: <document>,
    maxTimeMS: <number>,
    collation: <document>
  }
* @param {string | undefined} user User for MongoDb db to force.
* @param {string | undefined} password Password for MongoDb db to force.
* @example findOneAndDelete('legion','restaurants',{mydoc})
* @result {lastErrorObject: {…}, value: {…}, ok: 1}
* @returns {Promise<JSON>} result from deleted doc
* @author u483567
* @async
* @public
*/
export async function findOneAndDelete(database: string, collection: string, query: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<JSON> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection
  let deleted = await coll.findOneAndDelete(query, options)
  await client.close()
  return JSON.parse(JSON.stringify(deleted))
}


/**
 * Find one document and replace it
 * @param {string} database Database name.
 * @param {string} collection Collection name.
 * @param {any} query find documents.
 * @param {any} replacement what to replace for the document
 * @param {any} options optionnals arguments ---> https://www.mongodb.com/docs/v4.4/reference/method/db.collection.findOneAndReplace/
 * @param {string | undefined} user User for MongoDb db to force.
 * @param {string | undefined} password Password for MongoDb db to force.
 * @example findOneAndReplace('legion','restaurants',{query},{replacement})
 * @returns {Promise<JSON>} result from replaced doc
 * @author u483567
 * @async
 * @public
 */
export async function findOneAndReplace(database: string, collection: string, query: any, replacement: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<JSON> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection
  let replaced = await coll.findOneAndReplace(query, replacement, options)
  await client.close()
  return JSON.parse(JSON.stringify(replaced))
}


/**
 * Find Multiple MongoDB Documents. {@link https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/ | MongoDB Doc}
 * @param {string} database The Database name.
 * @param {string} collection The Collection name.
 * @param {any} query What to find.
 * ```json
 * {
 *    "borough" : "Brooklyn",
 *    "cuisine" : "Chinese",
 *    "address.street" : /avenue/i,
 *    "name" : /May/i
 *  }
 * ```
 * @param {any} options
 * Options for the list result (sort, project ...)
 * Options list can be found here: {@link https://mongodb.github.io/node-mongodb-native/4.0//interfaces/findoptions.html#limit}
 * @param {string | undefined} user User for MongoDb db to force.
 * @param {string | undefined} password Password for MongoDb db to force.
 * @returns {Promise<JSON>}
 * Json Array of documents or null if not found.
 * Without projection.
 * ```json
 * [
 *  {
 *    cuisine: 'Chinese',
 *    name: 'May May Kitchen'
 *  }
 * ]
 * ```
 * 
 * With projection.
 * ```json
 * [
 *  {
 *    _id: '63515804f1f542e5fb7cd6f8',
 *    address: {
 *        …
 *    },
 *    borough: 'Brooklyn',
 *    cuisine: 'Chinese',
 *    grades: Array(5),
 *    …
 *  }
 * ]
 * ```
 * @example
 * Without projection
 * ```ts
 * find('legion','restaurants', {"borough" : "Brooklyn", "cuisine" : "Chinese", "address.street" : /avenue/i})
 * ```
 * 
 * With projection
 * ```ts
 * find('legion','restaurants', {"borough" : "Brooklyn", "cuisine" : "Chinese", "address.street" : /avenue/i},{projection: {"_ids" : 0, "cuisine" : 1, "name" : 1},otherOption: other,...})
 * ```
 * @author u483567
 * @public
 * {@label MONGODB}
 */
export async function find(database: string, collection: string, query: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<JSON> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection

  let list = await coll.find(query, options).toArray() // get list result with options
  await client.close()
  return JSON.parse(JSON.stringify(list))
}


/**
* Insert dcouments
* @param {string} database Database name.
* @param {string} collection Collection name.
* @param {any} documents documents to insert
* @param {any} options see --> https://www.mongodb.com/docs/v4.4/reference/method/db.collection.insert/
* @param {string | undefined} user User for MongoDb db to force.
* @param {string | undefined} password Password for MongoDb db to force.
* @example insert('legion','restaurants',{mydoc}) // insert mydoc
* @example insert('legion','restaurants',[{mydoc},{mydoc2}]) // insert mydoc and mydoc2 use [] for multipte insert
* @result {acknowledged: true, insertedCount: 1, insertedIds: {…}}
* @returns {Promise<JSON | null>} result from the insert see @result above
* @author u483567
* @async
* @public
*/
export async function insertOne(database: string, collection: string, documents: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<JSON | null> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection

  let list = null
  try {
    list = await coll.insertOne(documents, options)
  } catch (error: any) {
    list = error
  } finally {
    await client.close()
    return list
  }
}


export async function insertMany(database: string, collection: string, documents: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<any | null> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection

  let list = null
  try {
    list = await coll.insertMany(documents, options)
  } catch (error: any) {
    list = error
  } finally {
    await client.close()
    return list
  }
}


/**
 * Update dcouments
 * @param {string} database Database name.
 * @param {string} collection Collection name.
 * @param {any} query query documents
 * @param {any} update documents or pipeline
 * @param {any} options see --> https://www.mongodb.com/docs/v4.4/reference/method/db.collection.update/
 * @param {string | undefined} user User for MongoDb db to force.
 * @param {string | undefined} password Password for MongoDb db to force.
 * @example update('legion','restaurants',{query},{update},{options})
 * @result {acknowledged: true, insertedCount: 1, insertedIds: {…}}
 * @returns {Promise<any>} result from the insert see @result above
 * @author u483567
 * @async
 * @public
 */
export async function updateOne(database: string, collection: string, query: any, update: any, options?: any, user?: string | undefined, password?: string | undefined): Promise<any> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection
  let list = await coll.updateOne(query, update, options)
  await client.close()
  return list
}


/**
 * Get distinct key
 * @param {string} database Database name.
 * @param {string} collection Collection name.
 * @param {any} key key name
 * @param {string | undefined} user User for MongoDb db to force.
 * @param {string | undefined} password Password for MongoDb db to force.
 * @example distinct('legion','restaurants',"grades.grade") // récupère la liste des grades
 * @result ['A', 'B', 'C', 'P', 'Z']
 * @returns {Promise<any>} Array of distinct value from a key
 * @example
 * @author u483567
 * @async
 * @public
 */
export async function distinct(database: string, collection: string, key: any, user?: string | undefined, password?: string | undefined): Promise<any> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection
  let list = await coll.distinct(key)
  await client.close()
  return list
}


/**
 * Aggregate function.
 * @param {string} database Database name.
 * @param {string} collection Collection name.
 * @param {any} pipeline Aggregation pipeline.
 * @param {string | undefined} user User for MongoDb db to force.
 * @param {string | undefined} password Password for MongoDb db to force.
 * @returns {Promise<JSON | null>}
 * Json of aggregate result.
 * @author u483567
 * @async
 * @public
 */
export async function aggregate(database: string, collection: string, pipeline: any, user?: string | undefined, password?: string | undefined): Promise<JSON | null> {
  const client = new MongoClient(setMongoDBUri()) // New client
  const coll = client.db(database).collection(collection) // Connect to Db & collection

  let aggregateResult: Array<any> = []
  try {
    aggregateResult = await coll.aggregate(pipeline).toArray()
  } catch (error: any) {
    return error
  } finally {
    await client.close()
  }
  return JSON.parse(JSON.stringify(aggregateResult))
}
