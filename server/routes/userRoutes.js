import express from 'express';
import authProtect from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/profile', authProtect, (req, res) => {
    res.status(200).json({
       message: "Protected route accessed",
       user: req.user,
    });
});

export default router;