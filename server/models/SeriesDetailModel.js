/* module.exports = (sequelize, DataTypes) => {
  const SeriesDetail = sequelize.define("SeriesDetails", {
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

  });
  SeriesDetail.associate = (models) => {
    SeriesDetail.belongsTo(models.Users);
    SeriesDetail.belongsTo(models.Medias);
  };
  return SeriesDetail;
};
 */
