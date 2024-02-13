import getPrismaInstance from "../utils/PrismaClient.js";


export const checkUser = async(req,res,next) =>{
    try{
        const {email} = req.body;
        if(!email){
            return res.json({
                msg:"Email is Required",
                status:false
            })
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique({where : {email}})
        if(!user){
            return res.json({
                msg:'User not Found',
                status: false
            })
        }
        else{
            return res.json({
                mes:"User Found",
                status:true,
                data:user
            })
        }
    }
    catch(err){
        next(err)
    }
}

export const onBoard = async(req,res,next)=>{
    try{
        const {email,name,about,image:profilePicture} = req.body;
        if(!email || !name || !profilePicture){
            return res.send("Email ,Name and Image are requird.")
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.create({
            data:{email,name,about,profilePicture},
        });
        return res.json({msg:"Success",status:true,user})
    }
    catch(err){
        next(err)
    }
}

export const editUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { name, about, image: profilePicture } = req.body;
        if (!name || !profilePicture) {
            return res.status(400).json({ error: "Name and Image are required." });
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.update({
            where: { id: userId },
            data: { name, about, profilePicture },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.json({ msg: "Success", status: true, user });
    } catch (err) {
        next(err);
    }
};



export const getAllUser = async(req,res,next)=>{
    try{
        const prisma  = getPrismaInstance();
        const users = await prisma.user.findMany({
            orderBy:{name:"asc"},
            select:{
            id:true,
            name:true,
            email:true,
            profilePicture:true,
            about:true
            }
        })
        const userGroupedbyInitialLetter = {}
        
        users.forEach((user)=>{
            const initialLetter = user.name.charAt(0).toUpperCase();
            if(!userGroupedbyInitialLetter[initialLetter]){
                userGroupedbyInitialLetter[initialLetter] = [];
            }
            userGroupedbyInitialLetter[initialLetter].push(user)
        })
        return res.status(200).send({users: userGroupedbyInitialLetter})
    }
    catch(err){
        next(err)
    }
}