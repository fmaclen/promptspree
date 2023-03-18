migrate((db) => {
  const collection = new Collection({
    "id": "78ryodztu4zy2zr",
    "created": "2023-03-18 15:17:57.323Z",
    "updated": "2023-03-18 15:17:57.323Z",
    "name": "messages",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
        "system": false,
        "id": "v6c9ukfo",
        "name": "role",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "USER",
            "ASSISTANT"
          ]
        }
      },
      {
        "system": false,
        "id": "6j0bh2qf",
        "name": "content",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("78ryodztu4zy2zr");

  return dao.deleteCollection(collection);
})
