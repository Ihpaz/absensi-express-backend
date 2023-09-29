import { DataTypes,Model} from "sequelize";
import connection from "../../config/dbConnect";
import Karyawan from "./Karyawan";

class Absen extends Model{
  public id!:number;
  public tglkerja!:Date;
  public tglabsenmasuk!:Date;
  public tglabsenpulang!:Date;

}
Absen.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tglkerja:{
    type:DataTypes.DATEONLY,
  },
  tglabsenmasuk:{
    type:DataTypes.DATE,
  },
  tglabsenpulang:{
    type:DataTypes.DATE,
  }
},{
  sequelize: connection,
  underscored: false,
  tableName: 'trabsen',
})

Karyawan.hasMany(Absen);
Absen.belongsTo(Karyawan);

export default Absen;

