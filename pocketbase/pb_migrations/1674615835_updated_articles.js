migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = @request.data.user"
  collection.updateRule = "@request.auth.id = user"
  collection.deleteRule = "@request.auth.id = user"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
