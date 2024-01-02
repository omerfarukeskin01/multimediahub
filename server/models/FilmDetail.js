module.exports = (sequelize, DataTypes) => {
  const FilmDetail = sequelize.define("FilmDetails", {
    /*       MediaID: {
        type: DataTypes.INTEGER,
        references: {
          model: Medias,
          key: 'MediaID'
        }
      }, */
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

    /*       AddedOrUpdatedByUserId: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: 'UserID'
        }
      }, */
    /*     isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }, */
  });
  FilmDetail.associate = (models) => {
    //FilmDetail.belongsTo(models.Users);
    FilmDetail.belongsTo(models.Medias);
  };
  return FilmDetail;
};
