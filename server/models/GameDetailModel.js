/* module.exports = (sequelize, DataTypes) => {
  const GameDetail = sequelize.define("GameDetails", {

    Title: {
      type: DataTypes.STRING(50),
    },
    Publisher: {
      type: DataTypes.STRING(50),
    },
    ReleaseDate: {
      type: DataTypes.DATE,
    },

  });
  GameDetail.associate = (models) => {
    GameDetail.belongsTo(models.Users);
    GameDetail.belongsTo(models.Medias);
  };
  return GameDetail;
}; */
