const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// beforeAll is used to set up resources before any tests are run.
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

// afterAll is used to clean up resources after all tests have been run.
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
