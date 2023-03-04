migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cyjvptc6",
    "name": "headline",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cyjvptc6",
    "name": "headline",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 80,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
