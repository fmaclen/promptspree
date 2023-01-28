migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

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
        "1",
        "2",
        "3",
        "4",
        "5"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

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
        "🤯",
        "🤣",
        "🤔",
        "😑",
        "😴"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
