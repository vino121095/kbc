const BusinessProfile = require('../model/business');
// const Member = require('../model/member');
const { Member } = require('../model/index');

const addBusinessProfile = async (req, res) => {
    try {
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

        const business_profile_image = req.files['business_profile_image']
            ? req.files['business_profile_image'][0].path.replace(/\\/g, "/") // normalize path
            : null;

        // Format media gallery (array of images/videos)
        const media_gallery_files = req.files['media_gallery']
            ? req.files['media_gallery'].map(file => file.path.replace(/\\/g, "/"))
            : [];

        // Determine media type based on first file
        const media_gallery_type = media_gallery_files.length > 0
            ? /\.(mp4|mov|avi|mkv)$/i.test(media_gallery_files[0]) ? 'video' : 'image'
            : null;

        const newProfile = await BusinessProfile.create({
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
            media_gallery: media_gallery_type, // image or video
        });

        res.status(201).json({
            message: "Business profile created successfully",
            profile: newProfile,
            uploaded_media: {
                business_profile_image,
                media_gallery_files,
            }
        });
    } catch (error) {
        console.error("Error saving business profile:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getAllBusinessProfiles = async (req, res) => {
  try {
    const profiles = await BusinessProfile.findAll({
      include: [
        {
          model: Member,
          as: 'member', // this alias must match the one defined in belongsTo()
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    res.status(200).json({ profiles });
  } catch (error) {
    console.error("Error fetching business profiles:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const getBusinessProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await BusinessProfile.findByPk(id, {
            include: [
        {
          model: Member,
          as: 'member', // this alias must match the one defined in belongsTo()
          attributes: ['first_name', 'last_name'],
        },
      ],
        });

        if (!profile) {
            return res.status(404).json({ message: "Business profile not found" });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error", error });
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

        const business_profile_image = req.files?.['business_profile_image']
            ? req.files['business_profile_image'][0].path.replace(/\\/g, "/")
            : profile.business_profile_image;

        const media_gallery_files = req.files?.['media_gallery']
            ? req.files['media_gallery'].map(file => file.path.replace(/\\/g, "/"))
            : [];

        const media_gallery_type = media_gallery_files.length > 0
            ? /\.(mp4|mov|avi|mkv)$/i.test(media_gallery_files[0]) ? 'video' : 'image'
            : profile.media_gallery;

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
            media_gallery: media_gallery_type,
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

const deleteBusinessProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await BusinessProfile.findByPk(id);

        if (!profile) {
            return res.status(404).json({ message: "Business profile not found" });
        }

        await profile.destroy();
        res.status(200).json({ message: "Business profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting business profile:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};


module.exports = {
    addBusinessProfile,
    getAllBusinessProfiles,
    getBusinessProfileById,
    updateBusinessProfile,
    deleteBusinessProfile
};
