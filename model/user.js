import { Schema, model } from "mongoose";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

const phoneNumberRegex = /^0(20|24|27|50|53|54|55|57)[0-9]{7}$/;
const validatePhoneNumber = (phoneNumber) => {
  return phoneNumberRegex.test(phoneNumber);
};

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.includes("@");
      },
      message: (props) => `invalid email`,
    },
  },

  phoneNumber: {
    type: String,
    unique: true,
    validate: {
      validator: validatePhoneNumber,
      message: "Invalid Phone Number.",
    },
  },

  userId: {
    type: String,
    required: true,
    minlength: 6,
    default: "",
  },

  role: {
    type: String,
    enum: ["parent", "teacher", "admin"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  tempPassword: String,
});

//generate Password And hash
userSchema.methods.generateTempPass = async function () {
  const tempPass = nanoid(6);

  const hashedPass = await bcrypt.hash(tempPass, 10);
  this.tempPass = hashedPass;
  // await User.save();

  this.tempPassword = hashedPass; // Store hashed temp password

  // this.tempPassExpiry = Date.now() + 3600 * 1000;//1 hour expiry

  return tempPass;
};

//is genrated credential === logins
userSchema.methods.isMatch = async function (inputPass) {
  if (!this.tempPassword) return false;

  const isMatching = await bcrypt.compare(inputPass, this.tempPassword);
  console.log("Comparing:", inputPass, this.tempPassword);

  return isMatching;
};

const User = model("User", userSchema);

export default User;
