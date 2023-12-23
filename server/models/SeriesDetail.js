module.exports = (sequelize, DataTypes) => {
  const SeriesDetail = sequelize.define("SeriesDetails", {
    /*           MediaID: {
            type: DataTypes.INTEGER,
            references: {
              model: Medias,
              key: 'MediaID'
            }
          }, */
    Title: {
      type: DataTypes.STRING(50),
    },
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
    SeriesDetail.belongsTo(models.Users);
    SeriesDetail.belongsTo(models.Medias);
  };
  return SeriesDetail;
};
