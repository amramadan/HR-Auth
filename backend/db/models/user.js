const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = mongoose;
const hashCost = 7;

const UserSchema = new Schema(
  {
    //   name: {
    //       type: String,
    //       required: true
    //   },
    //   email: {
    //       type: String,
    //       required: true,
    //       unique: true,
    //       set: v => String(v).toLowerCase(),
    //       validate: {
    //       validator: function(v) {
    //           const emailPattern = /^[a-z0-9.-_]+@[a-z]+\.[a-z]{3}$/;
    //           return emailPattern.test(v);
    //       },
    //       message: "{VALUE} is not a valid email!"
    //   }
    // },
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

UserSchema.pre("save", function(next) {
  const currentDate = new Date();
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  if (!this.password || this.password.length < 8)
    next({
      message: "password is required at least 8 char",
      code: 409
    });

  if (this.isModified("password")) {
    bcrypt.genSalt(hashCost, (err, salt) => {
      if (err) throw err;
      // hash the password using our new salt
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) next(err);
        // override the cleartext password with the hashed one
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Hide password field when printing out data.
UserSchema.set("toJSON", {
  transform: function(doc, ret, opt) {
    delete ret["password"];
    return ret;
  }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = { User, hashCost };
