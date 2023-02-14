migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.deleteRule = "@request.auth.id = user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
