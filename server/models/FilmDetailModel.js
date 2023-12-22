/* module.exports = (sequelize, DataTypes) => {
  const FilmDetail = sequelize.define("FilmDetails", {

    FilmLength: {
      type: DataTypes.TIME,
    },
    ReleaseDate: {
      type: DataTypes.DATE,
    },
    FilmDirector: {
      type: DataTypes.STRING(50),
    },
    FilmSynopsis: {
      type: DataTypes.STRING(255),
    },
    Title: {
      type: DataTypes.STRING(50),
    },

  });
  FilmDetail.associate = (models) => {
    FilmDetail.belongsTo(models.Users);
    FilmDetail.belongsTo(models.Medias);
  };
  return FilmDetail;
};
 */
