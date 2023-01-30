migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.deleteRule = "@request.auth.id != user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
