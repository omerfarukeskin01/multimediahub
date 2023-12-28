module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define("Lists", {
    listname: {
      type: DataTypes.STRING(50),
    },
  });
  List.associate = (models) => {
    List.belongsTo(models.Users);
    List.belongsToMany(models.Medias, {
      through: "ListMedia",
      foreignKey: "Listid",
    });
  };
  return List;
};
