module.exports = (sequelize, DataTypes) => {
  const SeriesDetail = sequelize.define("SeriesDetails", {
    /*           MediaID: {
            type: DataTypes.INTEGER,
            references: {
              model: Medias,
              key: 'MediaID'
            }
          }, */

    NumberOfEpisodes: {
      type: DataTypes.INTEGER,
    },
    NumberOfSeasons: {
      type: DataTypes.INTEGER,
    },
    SeriesSynopsis: {
      type: DataTypes.STRING(255),
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
          } */
  });
  SeriesDetail.associate = (models) => {
    SeriesDetail.belongsTo(models.Medias, {
      foreignKey: "MediaID",
      as: "Media",
    });
  };
  return SeriesDetail;
};
