migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.listRule = "status = \"PUBLISHED\" || (@request.auth.id = user.id && status = \"DRAFT\")"
  collection.viewRule = "status = \"PUBLISHED\" || (@request.auth.id = user.id && status = \"DRAFT\")"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
