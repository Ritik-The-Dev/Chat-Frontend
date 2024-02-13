import {Router} from 'express'
import { checkUser,onBoard,getAllUser,editUser} from '../controllers/AuthController.js'


const router = Router()

router.post("/check-user",checkUser)
router.post("/onboard-user",onBoard)
router.put("/edit-user/:userId",editUser)
router.get("/get-contacts",getAllUser)

export default router;