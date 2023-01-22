migrate((db) => {
  const collection = new Collection({
    "id": "8j2asafd3n83t45",
    "created": "2023-01-21 15:50:31.749Z",
    "updated": "2023-01-21 15:50:31.749Z",
    "name": "articles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cyjvptc6",
        "name": "headline",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": 80,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "dfdc32hd",
        "name": "summary",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 200,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ybchdjkv",
        "name": "body",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "d6zenbbi",
        "name": "breaking",
        "type": "bool",
        "required": false,
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
  const collection = dao.findCollectionByNameOrId("8j2asafd3n83t45");

  return dao.deleteCollection(collection);
})
