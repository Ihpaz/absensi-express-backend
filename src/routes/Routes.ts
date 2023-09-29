import express, { NextFunction } from "express";
import multer, { Multer } from 'multer';
import path from 'path';
import KaryawanController from "../controller/KaryawanController";
import AbsenController from "../controller/AbsenController";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the directory where you want to save the files
      cb(null, './uploads/');
    },
    filename: (req:any, file, cb) => {
      // Generate a custom filename for the uploaded file
      const fileName = `${req.auth.email}-${req.auth.nama}.jpg`;
      cb(null, fileName);
    },
});
  
const upload = multer({ storage }).single('Foto');
const router= express.Router();
router.use(express.static(path.join(__dirname, 'uploads')));

router.post("/auth/login", KaryawanController.login);
router.post("/auth/loginadmin", KaryawanController.loginAdmin);

router.post("/karyawan", (req: any, res: any) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(500).send({
                code: 500,
                status: 'error',
                message: 'internal server error',
                
            });
        } 

        KaryawanController.addkaryawan(req,res)
    })
       
})
router.get("/karyawan", KaryawanController.getAllKaryawan);
router.put("/karyawan/:id",KaryawanController.updatekaryawan)

router.post("/uploadfoto", (req: any, res: any) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(500).send({
                code: 500,
                status: 'error',
                message: 'internal server error',
                
            });
        }else{
            return res.status(200).send({
                status:'success', 
                message:'Berhasil Upload Foto'
                    });
        }

    })
       
})

router.get("/karyawan/:id", KaryawanController.getOneKaryawan);
router.delete("/karyawan/:id", KaryawanController.deleteKaryawan);

router.post("/absen",AbsenController.absen);
router.get("/absen",AbsenController.getAllAbsen);


export default router