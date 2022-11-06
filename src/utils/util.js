import express from "express";

const router=express.Router();


router.get('/download/link',function(req,res){
    response.pipe(file);
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
})

router.get('/download', function(req, res){
    const file = `${__dirname}/apk/app-cash-release.apk`;
    res.download(file); // Set disposition and send it.
  });

  router.get('/download/poker.apk',function(req,res){
    const file = `${__dirname}/apk/app-poker-release.apk`;
    res.download(file);
})

export default router;