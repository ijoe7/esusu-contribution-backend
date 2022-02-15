const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.generateOTCode = (size = 5, alpha = true) => {
  let characters = alpha
    ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-"
    : "0123456789";
  characters = characters.split("");
  let selections = "";
  for (let i = 0; i < size; i++) {
    let index = Math.floor(Math.random() * characters.length);
    selections += characters[index];
    characters.splice(index, 1);
  }
  return selections;
};

exports.createAccessToken = (signature) => {
    const token = jwt.sign({ signature }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
    });
  return token;
}
