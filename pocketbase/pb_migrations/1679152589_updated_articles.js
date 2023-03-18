migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  // remove
  collection.schema.removeField("xgfwuld9")

  // remove
  collection.schema.removeField("2xaxj4y7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rdp9pyna",
    "name": "body",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.listRule = "status = \"PUBLISHED\" || (@request.auth.id = user.id && status = \"DRAFT\")"
  collection.viewRule = "status = \"PUBLISHED\" || (@request.auth.id = user.id && status = \"DRAFT\")"
  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = @request.data.user"
  collection.updateRule = "@request.auth.id = user.id"
  collection.deleteRule = "@request.auth.id = user.id"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xgfwuld9",
    "name": "body",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2xaxj4y7",
    "name": "messages",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("rdp9pyna")

  return dao.saveCollection(collection)
})
