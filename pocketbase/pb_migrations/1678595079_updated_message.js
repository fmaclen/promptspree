migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c7h9c3xxl5i1ok1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tvsgvnll",
    "name": "model",
    "type": "text",
    "required": true,
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

  // remove
  collection.schema.removeField("tvsgvnll")

  return dao.saveCollection(collection)
})
