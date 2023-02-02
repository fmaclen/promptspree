migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // remove
  collection.schema.removeField("dfdc32hd")

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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dfdc32hd",
    "name": "summary",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 200,
      "pattern": ""
    }
  }))

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
        "draft",
        "published"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
