const sequelize = require('./config/database');

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database cleared and recreated.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  }); 