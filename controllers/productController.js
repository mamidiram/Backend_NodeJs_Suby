const Product = require("../models/Product");
const multer = require("multer");
const Firm = require('../models/Firm')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');// Destination folder where the upload image will be stored
    },
    filename:function(req,res,cb){
        cb(null,Date.now() + path.extname(file.originalname) );//Generating a unique filename
    }
});

const upload = multer({storage : storage});

const addProduct = async(req,res)=>{
    try {
        const{productName,price,category,bestseller,description} = req.body;
        const image = req.file ? req.file.filename : undefined;

       

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"No firm found"});
        }

        const product = new Product({
            productName,price,category,bestseller,description,image,firm:firm._id
        })

        const savedProduct = await product.save();

        firm.products.push(savedProduct);

        await firm.save()

        res.status(200).json(savedProduct)

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"})
    }
}

const getProductByFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"No firm found"});
        }

        const restaurantName = firm.firmName;

        const products = await Product.find({firm:firmId});

        res.status(200).json({restaurantName,products});

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}

const deleteProductById = async(req,res)=>{
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if(!deletedProduct){
            return res.status(404).json({error:"No product found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports = {addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById};


// *****************************


// const Product = require("../models/Product");
// const multer = require("multer");
// const path = require("path");
// const Firm = require('../models/Firm');

// // Configure multer for file storage
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/'); // Destination folder
//     },
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// const upload = multer({ storage: storage });

// // Add product function
// const addProduct = async (req, res) => {
//     try {
//         const { productName, price, category, bestseller, description } = req.body;
//         const image = req.file ? req.file.filename : undefined;

//         const firmId = req.params.firmId;
//         const firm = await Firm.findById(firmId);

//         if (!firm) {
//             return res.status(404).json({ error: "No firm found" });
//         }

//         // Ensure products is initialized
//         if (!firm.products) {
//             firm.products = [];
//         }

//         const product = new Product({
//             productName,
//             price,
//             category,
//             bestseller,
//             description,
//             image,
//             firm: firm._id
//         });

//         const savedProduct = await product.save();

//         firm.products.push(savedProduct._id); // Push the product ID
//         await firm.save();

//         res.status(200).json(savedProduct);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// module.exports = { addProduct: [upload.single('image'), addProduct] };
