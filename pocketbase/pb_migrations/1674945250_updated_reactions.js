migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = @request.data.user"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.createRule = null

  return dao.saveCollection(collection)
})
