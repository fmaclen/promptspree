migrate((db) => {
  const collection = new Collection({
    "id": "c7h9c3xxl5i1ok1",
    "created": "2023-03-12 04:23:00.919Z",
    "updated": "2023-03-12 04:23:00.919Z",
    "name": "message",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "gpeqgcgf",
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
        "id": "lypqowl0",
        "name": "role",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hryggjto",
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
  const collection = dao.findCollectionByNameOrId("c7h9c3xxl5i1ok1");

  return dao.deleteCollection(collection);
})
