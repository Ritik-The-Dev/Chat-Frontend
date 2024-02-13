import {Router} from 'express'
import { addMessage,getMessage,addImageMessage,addAudioMessage} from '../controllers/MessageController.js'
import multer from 'multer'

const uploadImage = multer({dest:"uploads/image"})
const uploadAudio = multer({dest:"uploads/recordings"})
const router = Router()

router.post("/add-message",addMessage)
router.get("/get-message/:from/:to",getMessage)
router.post("/add-image-message",uploadImage.single("image"),addImageMessage)
router.post("/add-audio-message",uploadAudio.single("audio"),addAudioMessage)

export default router;