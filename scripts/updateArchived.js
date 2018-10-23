// Load Environment
const dotenv = require('dotenv');
dotenv.load();

var mongoose = require('mongoose');

// Attempt to connect to database
mongoose.connect(process.env.MONGO_DATABASE, function()
{
  console.log('Connected to db.');
  mongoose.connection.db.collection('games').update(
    {},
    {$set: {
       isArchived: false
      }
    },
    {multi: true}
  );
  console.log('Active games have been updated.');
  mongoose.connection.db.collection('game-archive').find({}).forEach(game => {
    game.isArchived = true;
    mongoose.connection.db.collection('games').insert(game);
  });
  console.log('Archived games transferred.');
});