migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cksc0yus",
    "name": "keywords",
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

  // remove
  collection.schema.removeField("cksc0yus")

  return dao.saveCollection(collection)
})
