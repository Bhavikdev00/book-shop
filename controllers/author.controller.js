const Author = require('../models/authors.model');
const { processBase64Image } = require("../middlewares/multer.middleware");

// Function to create a new author
const createAuthor = async (req, res) => {
    // Log the request body
    console.log(req.body);

    // Check if authorName and avatar are provided in the request body
    if (!req.body.authorName || !req.body.avatar) {
        // If not provided, return a 400 status with an error message
        return res.status(400).json({ status: "Failed", message: 'Author name and avatar are required' });
    }

    // Check if author with the provided authorName already exists
    const author = await Author.findOne({ authorName: req.body.authorName });
    if (author) {
        // If author already exists, return a 200 status with a success message
        return res.status(409).json({ status: "Failed", message: "Author Already Exists" });
    }

    // Process the avatar image provided in the request body
    const authorAvatar = await processBase64Image(req.body.avatar, "jpg");

    // Create a new author instance
    const newAuthor = new Author({
        authorName: req.body.authorName,
        avatar: authorAvatar,
    });

    // Save the new author to the database
    const authorData = await newAuthor.save();
    console.log(authorData);
}

// Function to update an existing author
const updateAuthor = async (req, res) => {
    // Log the author ID and request body
    console.log(req.params.id);
    console.log(req.body);

    // Find the author by ID
    const author = await Author.findById(req.params.id);
    if (!author) {
        // If author not found, return a 404 status with an error message
        return res.status(404).json({ status: "Failed", message: 'Author not found' });
    }

    // Update the author's avatar if provided in the request body
    if (req.body.avatar) {
        if (req.body.avatar.length <= 0) {
            // If avatar is empty, return a 400 status with an error message
            return res.status(400).json({ status: "Failed", message: 'Author avatar is required' });
        }
        // Process the new avatar image provided in the request body
        const authorAvatar = await processBase64Image(req.body.avatar, "jpg");
        author.avatar = authorAvatar;
    }

    // Update the author's name if provided in the request body and different from current name
    if (req.body.authorName && req.body.authorName !== author.authorName) {
        if (req.body.authorName.length <= 0) {
            // If authorName is empty, return a 400 status with an error message
            return res.status(400).json({ status: "Failed", message: 'Author name is required' });
        }
        // Update the author's name
        author.authorName = req.body.authorName;
    }

    // Save the updated author to the database
    await author.save();

    // Fetch the updated author data from the database
    const updatedAuthor = await Author.findById(req.params.id).select("-__v");

    // Return a 200 status with the updated author data and a success message
    return res.status(200).json({ status: "Success", data: updatedAuthor, message: "Author updated successfully" });
}

// Export the functions for use in other files
module.exports = { createAuthor, updateAuthor };
