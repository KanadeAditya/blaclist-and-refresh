const rbac = (processrole) => {
    return (req,res,next)=>{
        let {role} = req.body;
        if(processrole.includes(role)){
            next();
        }else{
            res.send({msg:"aaccess denied"})
        }
    }
}

module.exports = {rbac}