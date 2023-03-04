migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // remove
  collection.schema.removeField("btkraaho")

  // remove
  collection.schema.removeField("ie7acsq5")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "btkraaho",
    "name": "prompt",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 10,
      "max": 280,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ie7acsq5",
    "name": "completion",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
