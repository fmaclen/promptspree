migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c7h9c3xxl5i1ok1")

  // remove
  collection.schema.removeField("lypqowl0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fu4rvrlb",
    "name": "field",
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
  const collection = dao.findCollectionByNameOrId("c7h9c3xxl5i1ok1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lypqowl0",
    "name": "role",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("fu4rvrlb")

  return dao.saveCollection(collection)
})
