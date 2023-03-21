migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("78ryodztu4zy2zr")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jkmkvbb9",
    "name": "article",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "8j2asafd3n83t45",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("78ryodztu4zy2zr")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jkmkvbb9",
    "name": "article",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "8j2asafd3n83t45",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
