const Sequelize = require("sequelize");
function log() {
  console.log("【db】", ...arguments);
}
log("init sequelize...");
const config = require("../config").db;
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    }
  }
);
const ID_TYPE = Sequelize.STRING(50);
function defineModel(name, attributes) {
  var attrs = {};
  attrs.id = {
    // type: ID_TYPE,
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  };
  for (let key in attributes) {
    let value = attributes[key];
    if (typeof value === "object" && value["type"]) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: false
      };
    }
  }

  attrs.createdAt = {
    type: Sequelize.BIGINT,
    allowNull: true
  };
  attrs.updatedAt = {
    type: Sequelize.BIGINT,
    allowNull: true
  };
  attrs.version = {
    type: Sequelize.BIGINT,
    allowNull: true
  };
  return sequelize.define(name, attrs, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeValidate: function(obj) {
        let now = Date.now();
        if (obj.isNewRecord) {
          // if (!obj.id) {
          //   obj.id = generateId();
          // }
          obj.createdAt = now;
          obj.updatedAt = now;
          obj.version = 0;
        } else {
          obj.updatedAt = Date.now();
          obj.version++;
        }
      }
    }
  });
}
module.exports = {
  defineModel,
  STRING: Sequelize.STRING,
  BOOLEAN: Sequelize.BOOLEAN,
  sync: sequelize.sync.bind(sequelize),
  Op: Sequelize.Op
};

// var Pet = sequelize.define('pets_test', {
//   id: {
//     type: Sequelize.STRING(50),
//     primaryKey: true
//   },
//   name: Sequelize.STRING(100),
//   gender: Sequelize.BOOLEAN,
//   birth: Sequelize.STRING(10),
//   createdAt: Sequelize.BIGINT,
//   updatedAt: Sequelize.BIGINT,
//   version: Sequelize.BIGINT
// }, {
//   timestamps: false
// });
// sequelize.sync()
// var now = Date.now();
// (async () => {
// await Pet.drop()
// await Pet.sync({ force: true, match: /_test$/ })
// console.log(await Pet.findAll())
// var p = await Pet.findOne({where:{name:'Odie'}})
// console.log(p)
// p.gender = true;
// p.updatedAt = Date.now();
// p.version ++;
// await p.save();
//     await p.destroy();
// })();
// (async () => {
//     var dog = await Pet.create({
//         id: 'd-' + now,
//         name: 'Odie',
//         gender: false,
//         birth: '2008-08-08',
//         createdAt: now,
//         updatedAt: now,
//         version: 0
//     });
//     console.log('created: ' + JSON.stringify(dog));
// })();
