migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.updateRule = "@request.auth.id = @request.data.user"
  collection.deleteRule = "@request.auth.id = @request.data.user"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
