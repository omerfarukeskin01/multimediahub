module.exports = (sequelize, DataTypes) => {
  const GameDetail = sequelize.define("GameDetails", {
    /*           MediaID: {
            type: DataTypes.INTEGER,
            references: {
              model: Medias,
              key: 'MediaID'
            }
          }, */

    Publisher: {
      type: DataTypes.STRING(50),
    },
    ReleaseDate: {
      type: DataTypes.DATE,
    },
    /*           AddedOrUpdatedByUserId: {
            type: DataTypes.INTEGER,
            references: {
              model: Users,
              key: 'UserID'
            }
          }, */

    /*           isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
          }, */
  });
  GameDetail.associate = (models) => {
    GameDetail.belongsTo(models.Medias, { foreignKey: "MediaID" });
  };
  return GameDetail;
};
