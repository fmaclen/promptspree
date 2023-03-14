migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c7h9c3xxl5i1ok1")

  // remove
  collection.schema.removeField("fu4rvrlb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ob6ddmub",
    "name": "role",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "SYSTEM",
        "USER",
        "ASSISTANT"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c7h9c3xxl5i1ok1")

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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ob6ddmub",
    "name": "field1",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "SYSTEM",
        "USER",
        "ASSISTANT"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
