migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2023-01-21 15:11:00.640Z",
      "updated": "2023-04-13 15:33:18.263Z",
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "users_name",
          "name": "nickname",
          "type": "text",
          "required": false,
          "unique": true,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "users_avatar",
          "name": "avatar",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [
              "image/jpg",
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ],
            "thumbs": null
          }
        },
        {
          "system": false,
          "id": "ggkbvptn",
          "name": "terms",
          "type": "bool",
          "required": true,
          "unique": false,
          "options": {}
        }
      ],
      "indexes": [
        "CREATE INDEX `__pb_users_auth__created_idx` ON `users` (`created`)",
        "CREATE UNIQUE INDEX \"idx_unique_users_name\" on \"users\" (\"nickname\")"
      ],
      "listRule": "id = @request.auth.id",
      "viewRule": "",
      "createRule": "",
      "updateRule": "id = @request.auth.id",
      "deleteRule": "id = @request.auth.id",
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "requireEmail": false
      }
    },
    {
      "id": "8j2asafd3n83t45",
      "created": "2023-01-21 15:50:31.749Z",
      "updated": "2023-04-13 15:33:18.264Z",
      "name": "articles",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "cyjvptc6",
          "name": "headline",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "qed6piau",
          "name": "status",
          "type": "select",
          "required": true,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "values": [
              "DRAFT",
              "PUBLISHED",
              "FAILED"
            ]
          }
        },
        {
          "system": false,
          "id": "f0gkwmcx",
          "name": "image",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 3,
            "maxSize": 5242880,
            "mimeTypes": [
              "image/jpg",
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ],
            "thumbs": []
          }
        },
        {
          "system": false,
          "id": "dd93jdvt",
          "name": "user",
          "type": "relation",
          "required": true,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "cksc0yus",
          "name": "category",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "gjwpqcuv",
          "name": "audio",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [
              "audio/mpeg"
            ],
            "thumbs": []
          }
        },
        {
          "system": false,
          "id": "e0dzmqep",
          "name": "model",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "rdp9pyna",
          "name": "body",
          "type": "json",
          "required": false,
          "unique": false,
          "options": {}
        }
      ],
      "indexes": [
        "CREATE INDEX `_8j2asafd3n83t45_created_idx` ON `articles` (`created`)"
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "aj1jzrx2wrlz3zz",
      "created": "2023-01-28 15:42:50.727Z",
      "updated": "2023-04-13 15:33:18.264Z",
      "name": "reactions",
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
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
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
            "collectionId": "8j2asafd3n83t45",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "ucpxfx2r",
          "name": "reaction",
          "type": "select",
          "required": true,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "values": [
              "0",
              "1",
              "2",
              "3",
              "4"
            ]
          }
        }
      ],
      "indexes": [
        "CREATE INDEX `_aj1jzrx2wrlz3zz_created_idx` ON \"reactions\" (`created`)"
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "78ryodztu4zy2zr",
      "created": "2023-03-18 15:17:57.323Z",
      "updated": "2023-04-13 15:33:18.265Z",
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
            "cascadeDelete": true,
            "minSelect": null,
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
      "indexes": [
        "CREATE INDEX `_78ryodztu4zy2zr_created_idx` ON `messages` (`created`)"
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
