const jwt= require('jsonwebtoken')
const JWT_SECRET = "sdhsvhcb65c2ewc91cc2"

const fetchuser=(req,res,next)=>{
    let success;
    // Get user from jwt token and add id to req
    const token=req.header('auth-token');
    if(!token){
        success=false
        return res.status(401).send({success,error:"Unauthorized user"})
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user
        next();
        success=true
    
    } catch (error) {
        success=false
        return res.status(401).send({success,error:"Unauthorized user"})
    }
}

module.exports=fetchuser