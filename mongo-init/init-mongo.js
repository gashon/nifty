db = db.getSiblingDB('nifty');

db.createUser({
  user: 'root',
  pwd: 'nifty',
  roles: [
    {
      role: 'readWrite',
      db: 'nifty',
    },
  ],
});
