const express = require('express');
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .delete(deleteUser);

router.put('/:id/approve', toggleUserApproval);

module.exports = router;
