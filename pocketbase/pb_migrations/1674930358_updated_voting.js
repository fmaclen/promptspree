migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.name = "reactions"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ucpxfx2r",
    "name": "reaction",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "0",
        "1",
        "2",
        "3",
        "4"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.name = "voting"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ucpxfx2r",
    "name": "vote",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "0",
        "1",
        "2",
        "3",
        "4"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
