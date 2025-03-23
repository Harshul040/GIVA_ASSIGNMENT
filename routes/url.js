const express= require('express');
const {handleGenerate,handleStats}=require("../controllers/url");
const router=express.Router();

router.post("/",handleGenerate);
router.get("/stats/:shortId", handleStats); 
module.exports=router;
