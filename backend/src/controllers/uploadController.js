import multer from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary";
import {configCloudinary} from "../config/cloudinary.js"


const cloudinary = configCloudinary();
const storage = new CloudinaryStorage({
    cloudinary,
    params: async()=> ({
        folder:"pft-receipts",
        resource_type: "image",
        allowed_formats: ["jpg","jpeg","png","webp"]
    })
});

export const upload = multer({storage});

export const handleUpload = (req,res) => {
    console.log("Uploaded file details:", req.file)
    if(!req.file) return res.status(400).json({message: "No File"});
    res.json({url: req.file.path || req.file.secure_url});
};