import { DataTypes,Model} from "sequelize";
import connection from "../../config/dbConnect";

class Posisi extends Model{}
Posisi.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  posisi:{
    type:DataTypes.STRING,
  }
},{
  sequelize: connection,
  underscored: false,
  tableName: 'msposisi',
})

export default Posisi;

