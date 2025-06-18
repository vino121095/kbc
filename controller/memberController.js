const Member = require('../model/member');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Referral = require('../model/referral');
const BusinessProfile = require('../model/business');
const fs = require('fs');
const MemberFamily = require('../model/memberFamily');
const { Op } = require('sequelize');

// Helper: Generate Access Token
const generateAccessToken = (member) => {
    return jwt.sign(
        { mid: member.mid, email: member.email },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: '2h' }
    );
};

// ✅ Register Member
const registerMember = async (req, res) => {
    const t = await Member.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                errors: errors.array(),
            });
        }

        // Handle profile image
        const profile_image = req.files?.['profile_image']?.[0]?.path.replace(/\\/g, "/") || null;

        // Parse and validate business_profiles array
        let business_profiles = [];
        if (typeof req.body.business_profiles === 'string') {
            business_profiles = JSON.parse(req.body.business_profiles);
        } else {
            business_profiles = req.body.business_profiles || [];
        }

        if (!Array.isArray(business_profiles) || business_profiles.length === 0) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                msg: 'At least one business profile is required',
            });
        }

        // Parse and validate family_details (optional)
        let family_details = {};
        if (typeof req.body.family_details === 'string') {
            family_details = JSON.parse(req.body.family_details);
        } else {
            family_details = req.body.family_details || {};
        }

        // Destructure member data
        let {
            first_name, last_name, email, password,
            dob, gender, join_date, aadhar_no,
            blood_group, contact_no, alternate_contact_no,
            marital_status, address, city, state, zip_code,
            work_phone, extension, mobile_no, preferred_contact,
            secondary_email, emergency_contact, emergency_phone,
            personal_website, linkedin_profile, facebook,
            instagram, twitter, youtube, kootam, best_time_to_contact,
            referral_name, referral_code,
            status = 'Pending',
            access_level = 'Basic',
        } = req.body;

        if (Array.isArray(email)) email = email[0];

        // Check if email already exists
        const existingMember = await Member.findOne({ where: { email } });
        if (existingMember) {
            return res.status(400).json({
                success: false,
                msg: 'Email already exists!',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create member
        const newMember = await Member.create({
            first_name, last_name, email, password: hashedPassword,
            dob, gender, join_date, aadhar_no, blood_group,
            contact_no, alternate_contact_no, marital_status,
            address, city, state, zip_code, profile_image,
            work_phone, extension, mobile_no, preferred_contact,
            secondary_email, emergency_contact, emergency_phone,
            personal_website, linkedin_profile, facebook,
            instagram, twitter, youtube, kootam, best_time_to_contact,
            status, access_level,
        }, { transaction: t });

        // Handle referral
        if (referral_code) {
            const referrer = await Member.findOne({
                where: { application_id: referral_code }
            });

            if (!referrer) {
                await t.rollback();
                return res.status(400).json({
                    success: false,
                    msg: 'Invalid referral code',
                });
            }

            await Referral.create({
                member_id: newMember.mid,
                referral_name: referral_name || '',
                referral_code,
                referred_by_member_id: referrer.mid,
            }, { transaction: t });
        }

        // Handle business profiles
        for (let i = 0; i < business_profiles.length; i++) {
            const profile = business_profiles[i];

            const business_profile_image = req.files?.[`business_profile_image_${i}`]?.[0]?.path.replace(/\\/g, "/") || null;
            const gallery_files = req.files?.[`media_gallery_${i}`] || [];
            const gallery_paths = gallery_files.map(file => file.path.replace(/\\/g, "/"));
            const gallery_type = gallery_paths.length > 0
                ? /\.(mp4|mov|avi|mkv)$/i.test(gallery_paths[0]) ? 'video' : 'image'
                : null;

            await BusinessProfile.create({
                member_id: newMember.mid,
                company_name: profile.company_name,
                business_type: profile.business_type,
                role: profile.role,
                company_address: profile.company_address,
                city: profile.city,
                state: profile.state,
                zip_code: profile.zip_code,
                experience: profile.experience,
                staff_size: profile.staff_size,
                contact: profile.contact,
                email: Array.isArray(profile.email) ? profile.email[0] : profile.email,
                source: profile.source,
                business_profile_image,
                media_gallery: gallery_paths.join(','),
                media_gallery_type: gallery_type,
            }, { transaction: t });
        }

        // Handle family details if provided
        if (Object.keys(family_details).length > 0) {
            const {
                father_name,
                father_contact,
                mother_name,
                mother_contact,
                spouse_name,
                spouse_contact,
                number_of_children,
                address: family_address,
                children_names = []
            } = family_details;

            const familyPayload = {
                member_id: newMember.mid,
                father_name,
                father_contact,
                mother_name,
                mother_contact,
                address: family_address,
            };

            if (marital_status?.toLowerCase().trim() === 'married') {
                familyPayload.spouse_name = spouse_name;
                familyPayload.spouse_contact = spouse_contact;
                familyPayload.number_of_children = number_of_children;

                if (
                    number_of_children > 0 &&
                    Array.isArray(children_names) &&
                    children_names.length === Number(number_of_children)
                ) {
                    familyPayload.children_names = JSON.stringify(children_names);
                }
            }

            await MemberFamily.create(familyPayload, { transaction: t });
        }


        await t.commit();

        res.status(201).json({
            success: true,
            msg: 'Member, business profiles and family details created successfully',
            data: {
                mid: newMember.mid,
                application_id: newMember.application_id,
                first_name: newMember.first_name,
                email: newMember.email,
                profile_image,
                createdAt: newMember.createdAt,
            }
        });

    } catch (error) {
        await t.rollback();

        // Cleanup uploaded files if error occurs
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        console.error("Error registering member:", error);
        res.status(500).json({
            success: false,
            msg: 'An error occurred during registration',
            error: error.message,
        });
    }
};

// ✅ Login Member
const loginMember = async (req, res) => {
    try {
        const { emailOrContact, email, contact_no, password } = req.body;

        const identifier = emailOrContact || email || contact_no;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, msg: 'Email/Contact number and password are required' });
        }

        const member = await Member.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { contact_no: identifier }
                ]
            }
        });

        if (!member) {
            return res.status(400).json({ success: false, msg: 'Email/Contact or password is incorrect' });
        }

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'Email/Contact or password is incorrect' });
        }

        const accessToken = generateAccessToken(member);

        res.status(200).json({
            success: true,
            msg: 'Login successful',
            accessToken,
            tokenType: 'Bearer',
            data: {
                mid: member.mid,
                email: member.email,
                contact_no: member.contact_no,
                first_name: member.first_name,
                last_name: member.last_name,
                profile_image: member.profile_image,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Login failed', error: error.message });
    }
};


// ✅ Logout Member (Just client-side token removal; no server-side logic for JWT unless using blacklist)
const logoutMember = async (req, res) => {
    // Optionally, you can implement JWT blacklist here.
    res.status(200).json({
        success: true,
        msg: 'Logout successful',
    });
};

// ✅ Verify Token Middleware (optional for protected routes)
const verifyMemberToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, msg: 'Access token is required' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, msg: 'Invalid or expired token' });
        }

        req.member = decoded;
        next();
    });
};

// GET: All Members
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: BusinessProfile,
                    as: 'BusinessProfiles', // Optional alias if defined
                },
                {
                    model: MemberFamily,
                    as: 'MemberFamily', // Optional alias
                },
                {
                    model: Referral,
                    as: 'Referral', // Optional alias
                }
            ],
        });

        res.status(200).json({
            success: true,
            data: members,
        });
    } catch (error) {
        console.error("Error fetching all members:", error);
        res.status(500).json({
            success: false,
            msg: 'Failed to retrieve members',
            error: error.message,
        });
    }
};

// GET: Member by ID
const getMemberById = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: BusinessProfile,
                    as: 'BusinessProfiles',
                },
                {
                    model: MemberFamily,
                    as: 'MemberFamily',
                },
                {
                    model: Referral,
                    as: 'Referral',
                }
            ],
        });

        if (!member) {
            return res.status(404).json({ success: false, msg: 'Member not found' });
        }

        res.status(200).json({
            success: true,
            data: member,
        });

    } catch (error) {
        console.error("Error fetching member:", error);
        res.status(500).json({
            success: false,
            msg: 'Failed to fetch member',
            error: error.message,
        });
    }
};

// PUT: Update Member
const updateMember = async (req, res) => {
    const t = await Member.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                errors: errors.array(),
            });
        }

        const memberId = req.params.id;
        const member = await Member.findByPk(memberId);
        if (!member) {
            return res.status(404).json({ success: false, msg: 'Member not found' });
        }

        // Handle profile image
        const profile_image = req.files?.['profile_image']?.[0]?.path.replace(/\\/g, "/") || member.profile_image;

        // Parse business profiles
        // let business_profiles = [];
        // if (typeof req.body.business_profiles === 'string') {
        //     business_profiles = JSON.parse(req.body.business_profiles);
        // } else {
        //     business_profiles = req.body.business_profiles || [];
        // }

        // Parse family details
        // let family_details = {};
        // if (typeof req.body.family_details === 'string') {
        //     family_details = JSON.parse(req.body.family_details);
        // } else {
        //     family_details = req.body.family_details || {};
        // }

        // Destructure data
        let {
            first_name, last_name, email, password,
            dob, gender, join_date, aadhar_no,
            blood_group, contact_no, alternate_contact_no,
            marital_status, address, city, state, zip_code,
            work_phone, extension, mobile_no, preferred_contact,
            secondary_email, emergency_contact, emergency_phone,
            personal_website, linkedin_profile, facebook,
            instagram, twitter, youtube, kootam, best_time_to_contact,
            referral_name, referral_code,
            status = member.status,
            access_level = member.access_level,
        } = req.body;

        if (Array.isArray(email)) email = email[0];

        // Hash password if updated
        const updatedPassword = password ? await bcrypt.hash(password, 10) : member.password;

        // Update Member
        await member.update({
            first_name, last_name, email, password: updatedPassword,
            dob, gender, join_date, aadhar_no, blood_group,
            contact_no, alternate_contact_no, marital_status,
            address, city, state, zip_code, profile_image,
            work_phone, extension, mobile_no, preferred_contact,
            secondary_email, emergency_contact, emergency_phone,
            personal_website, linkedin_profile, facebook,
            instagram, twitter, youtube, kootam, best_time_to_contact,
            status, access_level,
        }, { transaction: t });

        // Delete old business profiles
        // await BusinessProfile.destroy({ where: { member_id: memberId }, transaction: t });

        // // Recreate business profiles
        // for (let i = 0; i < business_profiles.length; i++) {
        //     const profile = business_profiles[i];

        //     const business_profile_image = req.files?.[`business_profile_image_${i}`]?.[0]?.path.replace(/\\/g, "/") || null;
        //     const gallery_files = req.files?.[`media_gallery_${i}`] || [];
        //     const gallery_paths = gallery_files.map(file => file.path.replace(/\\/g, "/"));
        //     const gallery_type = gallery_paths.length > 0
        //         ? /\.(mp4|mov|avi|mkv)$/i.test(gallery_paths[0]) ? 'video' : 'image'
        //         : null;

        //     await BusinessProfile.create({
        //         member_id: memberId,
        //         company_name: profile.company_name,
        //         business_type: profile.business_type,
        //         role: profile.role,
        //         company_address: profile.company_address,
        //         city: profile.city,
        //         state: profile.state,
        //         zip_code: profile.zip_code,
        //         experience: profile.experience,
        //         staff_size: profile.staff_size,
        //         contact: profile.contact,
        //         email: Array.isArray(profile.email) ? profile.email[0] : profile.email,
        //         source: profile.source,
        //         business_profile_image,
        //         media_gallery: gallery_paths.join(','),
        //         media_gallery_type: gallery_type,
        //     }, { transaction: t });
        // }

        // // Update or create family details
        // const existingFamily = await MemberFamily.findOne({ where: { member_id: memberId } });

        // const {
        //     father_name,
        //     father_contact,
        //     mother_name,
        //     mother_contact,
        //     spouse_name,
        //     spouse_contact,
        //     number_of_children,
        //     address: family_address,
        //     children_names = []
        // } = family_details;

        // const familyPayload = {
        //     member_id: memberId,
        //     father_name,
        //     father_contact,
        //     mother_name,
        //     mother_contact,
        //     address: family_address,
        // };

        // if (marital_status?.toLowerCase().trim() === 'married') {
        //     familyPayload.spouse_name = spouse_name;
        //     familyPayload.spouse_contact = spouse_contact;
        //     familyPayload.number_of_children = number_of_children;
        //     if (number_of_children > 0 && Array.isArray(children_names)) {
        //         familyPayload.children_names = JSON.stringify(children_names);
        //     }
        // }

        // if (existingFamily) {
        //     await existingFamily.update(familyPayload, { transaction: t });
        // } else if (Object.keys(familyPayload).length > 1) {
        //     await MemberFamily.create(familyPayload, { transaction: t });
        // }

        await t.commit();

        return res.status(200).json({
            success: true,
            msg: 'Member updated successfully',
            data: {
                mid: member.mid,
                email: member.email,
                profile_image,
            }
        });

    } catch (error) {
        await t.rollback();

        // Cleanup uploaded files
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }

        console.error("Update member error:", error);
        return res.status(500).json({
            success: false,
            msg: 'Failed to update member',
            error: error.message,
        });
    }
};

const updateBusinessProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await BusinessProfile.findByPk(id);

    if (!profile) {
      return res.status(404).json({ message: "Business profile not found" });
    }

    const {
      member_id,
      company_name,
      business_type,
      role,
      company_address,
      city,
      state,
      zip_code,
      experience,
      staff_size,
      contact,
      email,
      source,
    } = req.body;

    const business_profile_image = req.files?.["business_profile_image"]
      ? req.files["business_profile_image"][0].path.replace(/\\/g, "/")
      : profile.business_profile_image;

    const media_gallery_files = req.files?.["media_gallery"]
      ? req.files["media_gallery"].map((file) => file.path.replace(/\\/g, "/"))
      : [];

    const media_gallery_type =
      media_gallery_files.length > 0
        ? /\.(mp4|mov|avi|mkv)$/i.test(media_gallery_files[0])
          ? "video"
          : "image"
        : profile.media_gallery_type;

    await profile.update({
      member_id,
      company_name,
      business_type,
      role,
      company_address,
      city,
      state,
      zip_code,
      experience,
      staff_size,
      contact,
      email,
      source,
      business_profile_image,
      media_gallery: media_gallery_files.join(","),
      media_gallery_type,
    });

    res.status(200).json({
      message: "Business profile updated successfully",
      profile,
      uploaded_media: {
        business_profile_image,
        media_gallery_files,
      },
    });
  } catch (error) {
    console.error("Error updating business profile:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateFamilyDetails = async (req, res) => {
  const t = await MemberFamily.sequelize.transaction();
  try {
    const {
      member_id,
      father_name,
      father_contact,
      mother_name,
      mother_contact,
      spouse_name,
      spouse_contact,
      number_of_children,
      children_names,
      address,
      marital_status
    } = req.body;

    // Check for existing family record
    const existingFamily = await MemberFamily.findOne({
      where: { member_id },
      transaction: t
    });

    // Build payload
    const familyPayload = {
      member_id,
      father_name,
      father_contact,
      mother_name,
      mother_contact,
      address
    };

    if (marital_status?.toLowerCase().trim() === 'married') {
      familyPayload.spouse_name = spouse_name;
      familyPayload.spouse_contact = spouse_contact;
      familyPayload.number_of_children = number_of_children;

      if (number_of_children > 0 && Array.isArray(children_names)) {
        familyPayload.children_names = JSON.stringify(children_names);
      }
    }

    // Update or create based on existing record
    if (existingFamily) {
      await existingFamily.update(familyPayload, { transaction: t });
    } else {
      await MemberFamily.create(familyPayload, { transaction: t });
    }

    await t.commit();
    return res.status(200).json({ success: true, message: 'Family details saved successfully' });

  } catch (error) {
    await t.rollback();
    console.error('Family update failed:', error);
    return res.status(500).json({ success: false, message: 'Failed to save family details', error: error.message });
  }
};

// DELETE: Member
const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, msg: 'Member not found' });
        }

        await member.destroy();

        res.status(200).json({ success: true, msg: 'Member deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Delete failed', error: error.message });
    }
};

module.exports = {
    registerMember,
    loginMember,
    logoutMember,
    verifyMemberToken,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
    updateBusinessProfile,
    updateFamilyDetails
};
