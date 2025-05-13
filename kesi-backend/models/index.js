const User = require('./User');
const Case = require('./Case');
const Evidence = require('./Evidence');

// User-Case relationships
User.hasMany(Case, { as: 'assignedCases', foreignKey: 'assignedToId' });
Case.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

// Case-Evidence relationships
Case.hasMany(Evidence, { foreignKey: 'caseId' });
Evidence.belongsTo(Case, { foreignKey: 'caseId' });

// User-Evidence relationships
User.hasMany(Evidence, { foreignKey: 'uploadedById' });
Evidence.belongsTo(User, { as: 'uploadedBy', foreignKey: 'uploadedById' });

module.exports = {
  User,
  Case,
  Evidence
}; 