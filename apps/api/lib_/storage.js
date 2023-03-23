"use strict";
exports.__esModule = true;
var storage_1 = require("@google-cloud/storage");
var storage = new storage_1.Storage({
    projectId: process.env.GOOGLE_SERVICE_PROJECT_ID,
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY
    }
});
exports["default"] = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);
