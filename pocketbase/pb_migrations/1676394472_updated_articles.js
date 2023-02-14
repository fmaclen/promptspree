migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qed6piau",
    "name": "status",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "DRAFT",
        "PUBLISHED",
        "FAILED"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qed6piau",
    "name": "status",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "DRAFT",
        "PUBLISHED"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
