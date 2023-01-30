migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = @request.data.user.id"
  collection.updateRule = "@request.auth.id = user.id"
  collection.deleteRule = "@request.auth.id = user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
