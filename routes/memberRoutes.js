const express = require('express');
const router = express.Router();

const memberController = require('../controller/memberController');
const { uploadBusinessProfileMedia, uploadBusinessProfile } = require('../middleware/multer');

// Authentication routes
router.post('/member/register', uploadBusinessProfileMedia, memberController.registerMember);
router.post('/member/login', memberController.loginMember);
router.post('/member/logout/:id', memberController.logoutMember);

// Profile routes - protected by authentication middleware
router.get('/member/all', memberController.getAllMembers);
router.get('/member/:id', memberController.getMemberById);
router.put('/member/update/:id', uploadBusinessProfileMedia, memberController.updateMember);
router.put('/business-profile/update/:id', uploadBusinessProfile, memberController.updateBusinessProfile);
router.put('/family-details/update/:id', memberController.updateFamilyDetails);
router.delete('/member/delete/:id', memberController.deleteMember);

// Password change route
// router.put('/admin/change-password', memberController.changeAdminPassword);

module.exports = router;
