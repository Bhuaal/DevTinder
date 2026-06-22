const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName) {
    throw new Error("Please enter Firstname");
  } else if (!lastName) {
    throw new Error("Please enter lastname");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error("First name should be between 3 to 50 character");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditField = [
    "firstName",
    "lastName",
    "age",
    "about",
    "imageUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditField.includes(field);
  });

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
