const BusinessProfile = require('../model/business');
// const Member = require('../model/member');
const { Member } = require('../model/index');

const addBusinessProfile = async (req, res) => {
    try {
        const {
            member_id,
            company_name,
            business_type,
            business_registration_type,
            about,
            company_address,
            city,
            state,
            zip_code,
            business_starting_year,
            staff_size,
            business_work_contract,
            email,
            source,
            tags,
            website,
            google_link,
            facebook_link,
            instagram_link,
            linkedin_link,
            // Salary-based fields
            designation,
            salary,
            location,
            experience,
        } = req.body;

        // Validate required fields
        if (!member_id || !business_type || !company_name) {
            return res.status(400).json({ 
                message: "member_id, business_type, and company_name are required fields" 
            });
        }

        // Validate business_type enum values
        if (!['self-employed', 'salary'].includes(business_type)) {
            return res.status(400).json({ 
                message: "business_type must be either 'self-employed' or 'salary'" 
            });
        }

        // Validate business_registration_type enum values if provided
        if (business_registration_type && !['proprietor', 'partnership', 'others'].includes(business_registration_type)) {
            return res.status(400).json({ 
                message: "business_registration_type must be either 'proprietor', 'partnership', or 'others'" 
            });
        }

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

        // Prepare profile data based on business type
        const profileData = {
            member_id,
            company_name,
            business_type,
            business_registration_type: business_type === 'self-employed' ? business_registration_type : null,
            about: business_type === 'self-employed' ? about : null,
            company_address: business_type === 'self-employed' ? company_address : null,
            city: business_type === 'self-employed' ? city : null,
            state: business_type === 'self-employed' ? state : null,
            zip_code: business_type === 'self-employed' ? zip_code : null,
            business_starting_year: business_type === 'self-employed' ? business_starting_year : null,
            staff_size: business_type === 'self-employed' ? staff_size : null,
            business_work_contract: business_type === 'self-employed' ? business_work_contract : null,
            email,
            source,
            tags,
            website,
            google_link,
            facebook_link,
            instagram_link,
            linkedin_link,
            business_profile_image,
            media_gallery: media_gallery_files.join(','), // store as comma-separated string
            media_gallery_type,
        };

        // Add salary-based fields only if business type is 'salary'
        if (business_type === 'salary') {
            profileData.company_name = company_name;
            profileData.designation = designation;
            profileData.salary = salary;
            profileData.location = location;
            profileData.experience = experience;
        } else if (business_type === 'self-employed') {
            // For self-employed, ensure salary-based fields are null
            profileData.designation = null;
            profileData.location = null;
            profileData.experience = null;
        }

        const newProfile = await BusinessProfile.create(profileData);

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
            business_registration_type,
            about,
            company_address,
            city,
            state,
            zip_code,
            business_starting_year,
            staff_size,
            business_work_contract,
            email,
            source,
            tags,
            website,
            google_link,
            facebook_link,
            instagram_link,
            linkedin_link,
            // Salary-based fields
            designation,
            salary,
            location,
            experience,
        } = req.body;

        // Validate required fields
        if (!member_id || !business_type || !company_name) {
            return res.status(400).json({ 
                message: "member_id, business_type, and company_name are required fields" 
            });
        }

        // Validate business_type enum values
        if (!['self-employed', 'salary'].includes(business_type)) {
            return res.status(400).json({ 
                message: "business_type must be either 'self-employed' or 'salary'" 
            });
        }

        // Validate business_registration_type enum values if provided
        if (business_registration_type && !['proprietor', 'partnership', 'others'].includes(business_registration_type)) {
            return res.status(400).json({ 
                message: "business_registration_type must be either 'proprietor', 'partnership', or 'others'" 
            });
        }

        const business_profile_image = req.files?.['business_profile_image']
            ? req.files['business_profile_image'][0].path.replace(/\\/g, "/")
            : profile.business_profile_image;

        const media_gallery_files = req.files?.['media_gallery']
            ? req.files['media_gallery'].map(file => file.path.replace(/\\/g, "/"))
            : (profile.media_gallery ? profile.media_gallery.split(',') : []);

        const media_gallery_type = media_gallery_files.length > 0
            ? /\.(mp4|mov|avi|mkv)$/i.test(media_gallery_files[0]) ? 'video' : 'image'
            : profile.media_gallery_type;

        // Prepare update data based on business type
        const updateData = {
            member_id,
            company_name,
            business_type,
            business_registration_type: business_type === 'self-employed' ? business_registration_type : null,
            about: business_type === 'self-employed' ? about : null,
            company_address: business_type === 'self-employed' ? company_address : null,
            city: business_type === 'self-employed' ? city : null,
            state: business_type === 'self-employed' ? state : null,
            zip_code: business_type === 'self-employed' ? zip_code : null,
            business_starting_year: business_type === 'self-employed' ? business_starting_year : null,
            staff_size: business_type === 'self-employed' ? staff_size : null,
            business_work_contract: business_type === 'self-employed' ? business_work_contract : null,
            email,
            source,
            tags,
            website,
            google_link,
            facebook_link,
            instagram_link,
            linkedin_link,
            business_profile_image,
            media_gallery: media_gallery_files.join(','), // store as comma-separated string
            media_gallery_type,
        };

        // Handle salary-based fields based on business type
        if (business_type === 'salary') {
            updateData.company_name = company_name;
            updateData.designation = designation;
            updateData.salary = salary;
            updateData.location = location;
            updateData.experience = experience;
        } else if (business_type === 'self-employed') {
            // For self-employed, ensure salary-based fields are null
            updateData.designation = null;
            updateData.location = null;
            updateData.experience = null;
        }

        await profile.update(updateData);

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