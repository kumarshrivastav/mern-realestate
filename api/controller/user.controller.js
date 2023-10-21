class UserController{
    test(req,res){
        return res.send({message:"Hello World"})
    }
}

export default new UserController()