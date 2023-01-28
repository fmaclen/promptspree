migrate((db) => {
  const collection = new Collection({
    "id": "aj1jzrx2wrlz3zz",
    "created": "2023-01-28 15:42:50.727Z",
    "updated": "2023-01-28 15:42:50.727Z",
    "name": "voting",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "witixjxw",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false
        }
      },
      {
        "system": false,
        "id": "6sdaj9ll",
        "name": "article",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "8j2asafd3n83t45",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "ucpxfx2r",
        "name": "vote",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "🤯",
            "🤣",
            "🤔",
            "😑",
            "😴"
          ]
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("aj1jzrx2wrlz3zz");

  return dao.deleteCollection(collection);
})
