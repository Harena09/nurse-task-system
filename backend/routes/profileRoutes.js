
const express = require("express");
const router = express.Router();
const User = require("../../Models/users");

//UPDATE user profile
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { fullname, role, email } = req.body;

    //Validate input
    if (!id || !fullname || !role || !email) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const updated = await User.findByIdAndUpdate(
            id,
            { fullname, role, email },
            { returnDocument: "after" }
        );

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: updated._id,
                fullname: updated.fullname,
                role: updated.role,
                email: updated.email
            }
        });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;