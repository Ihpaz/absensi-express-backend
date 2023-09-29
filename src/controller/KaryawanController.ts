
import { Request,Response } from "express";
import Karyawan from "../db/models/Karyawan";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Role from "../db/models/Role";
import Absen from "../db/models/Absen";
import { Op, literal } from "sequelize";
import Posisi from "../db/models/Posisi";

const secret= process.env.JWT_SECRET as string;
interface CustomAuthRequest extends Request {
	auth?: { 
	  	id: string;
		role: string;
		source:string;
	};
}

async function login(req:Request,res:Response) {
	const { email, password } = req.body;
	try {

		const karyawan = await Karyawan.findOne({ where: { email:email }, include:Role});
		if(!karyawan){
		    return res.status(400).json({
				code:400,
				status:'error', 
				message: 'Bad Request',
				error_exception:"",
				data:[{msg:"Email / password tidak sesuai"}] 
			});
		}

		const cekpassword=await bcrypt.compare(password,karyawan.password);

		if(!cekpassword){
		   return res.status(400).json({
			   code:400,
			   status:'error', 
			   message: 'Bad Request',
			   error_exception:"",
			   data:[{msg:"Email / password tidak sesuai"}] 
		   });
		}

		const payload={
		   id:karyawan.id,
		   nama:karyawan.nama,
		   email:karyawan.email,
		   role:karyawan.Role.role
		}
		
		const token = jwt.sign(payload,secret, { expiresIn: '3h' , });

	   return res.status(200).send({
		   code: 200,
			 status:'success', 
		   data: {token:token,payload}
	   })

   } catch (error:any) {
	   return res.status(500).send({
		   code: 500,
		   status: 'error',
		   message: 'internal server error',
		   
	   });
   }
}

async function loginAdmin(req:Request,res:Response) {
	const { email, password } = req.body;
	try {
		const karyawan = await Karyawan.findOne({ where: { email:email }, include:Role});
		if(!karyawan){
		    return res.status(400).json({
				code:400,
				status:'error', 
				message: 'Bad Request',
				error_exception:"",
				data:[{msg:"Email / password tidak sesuai"}] 
			});
		}

		
		const cekpassword=await bcrypt.compare(password,karyawan.password);
		 
		if(!cekpassword || karyawan.Role.role!='admin'){
		   return res.status(400).json({
			   code:400,
			   status:'error', 
			   message: 'Bad Request',
			   error_exception:"",
			   data:[{msg:"Email / password tidak sesuai"}] 
		   });
		}

		const payload={
		   id:karyawan.id,
		   nama:karyawan.nama,
		   email:karyawan.email,
		   role:karyawan.Role.role
		}
		
		const token = jwt.sign(payload,secret, { expiresIn: '3h' , });

	   return res.status(200).send({
		   code: 200,
			 status:'success', 
		   data: {token:token,payload}
	   })

   } catch (error:any) {
	   return res.status(500).send({
		   code: 500,
		   status: 'error',
		   message: 'internal server error',
		   
	   });
   }
}

async function addkaryawan(req:Request,res:Response) {
	const data=req.body;
	try {

		if(!data.nama || !data.email || !data.nohp || !data.newpassword){
			return res.status(400).json({
				status:'Bad Request', 
				message:'Required data nama,email,nohp dan password'
			});
		}

		if(data.newpassword && (data.newpassword != data.renewpassword)){
			return res.status(403).json({
				status:'Bad request', 
				message:'password tidak sama'
			});
		}

		await Karyawan.create({
			nama:data.nama,
			email:data.email,
			nohp:data.nohp,
			password:await bcrypt.hash(data.newpassword,10),
			foto:`${data.email}-${data.nama}.jpg`,
			PosisiId:parseInt(data.posisi),
			RoleId:parseInt(data.role)
		});

		return res.status(200).send({
          	status:'success', 
            message:'Berhasil menambah karyawan'
        });

	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'internal server error',
		});
	}
}

async function updatekaryawan(req:CustomAuthRequest,res:Response) {
	const auth=req.auth;
	const data=req.body;
	const id=parseInt(req.params.id);
	try {
		const dtkaryawan=await Karyawan.findByPk(id);
		if(!dtkaryawan){
			return res.status(404).json({
				status:'Not Found', 
				message:'Karyawan tidak ditemukan'
			});
		}

		if(data.newpassword && (data.newpassword != data.renewpassword)){
			return res.status(403).json({
				status:'Bad request', 
				message:'password tidak sama'
			});
		}

		if(auth?.role=='admin' && req.headers['source']=='hradmin'){
			await Karyawan.update({
				nama:data.nama,
				email:data.email,
				nohp:data.nohp,
				password:data.newpassword? await 	bcrypt.hash(data.newpassword,10):dtkaryawan.password,
				foto:`${data.email}-${data.nama}.jpg`,
				PosisiId:data.PosisiId,
				RoleId:data.RoleId
			},
			{
				where:{id:id}
			});
		}else{

			

			await Karyawan.update({
				nohp:data.nohp,
				password:data.newpassword? await 	bcrypt.hash(data.newpassword,10):dtkaryawan.password,
				foto:`${dtkaryawan.email}-${dtkaryawan.nama}.jpg`,
			},
			{
				where:{id:id}
			});
		}
		

		return res.status(200).send({
			status:'success', 
		    message:'Berhasil merubah karyawan'
	    });

	} catch (error){
		return res.status(500).send({
			status: 'error',
			message: 'internal server error',
		});
	}
}

async function getOneKaryawan(req:Request,res:Response) {
	const id=parseInt(req.params.id);
	try {
		const dtkaryawan=await Karyawan.findOne({
			where:{
				id:id
			},
			include:[{
				model:Absen,
				required:false,
				where:{
					tglkerja:{
						[Op.eq]:literal("CURDATE()")
					}
				}
			},Posisi]
		});

		if(!dtkaryawan){
			return res.status(404).json({
				status:'Not Found', 
				message:'Karyawan tidak ditemukan'
			});	
		}

		
		return res.status(200).send({
			status:'success', 
		    message:'Berhasil mendapatkan karyawan',
			data:dtkaryawan
	   });

	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'internal server error',
		});
	}
}

async function getAllKaryawan(req:Request,res:Response) {
	try {
		const {count,rows}= await Karyawan.findAndCountAll({
			limit:100,
			include:[Role,Posisi],
			
		});

		return res.status(200).send({
			status:'success', 
		    message:'Berhasil mendapatkan data karyawan',
			data:rows,
			jumlah:count
	   });
	   
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'internal server error',
		});
	}
}

async function deleteKaryawan(req:Request,res:Response) {
	const id=parseInt(req.params.id);
	try {
		
		const dtkaryawan=await Karyawan.findByPk(id);
		if(!dtkaryawan){
			return res.status(404).json({
				status:'Not Found', 
				message:'Karyawan tidak ditemukan'
			});
		}

		await Karyawan.destroy({
			where:{id:id}
		});

		return res.status(200).send({
			status:'success', 
		    message:'Berhasil menghapus data karyawan',
	   });

	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'internal server error',
		});
	}
}

export default {login,loginAdmin,addkaryawan,updatekaryawan,getOneKaryawan,getAllKaryawan,deleteKaryawan}