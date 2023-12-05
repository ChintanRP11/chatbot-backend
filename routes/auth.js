const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

const chatbotResponses = {
  hello: "Hi there! How can I help you?",
  "how are you?": "I am just a chatbot, but thanks for asking!",
  "what is your name?": "I am a chatbot, so I don't have a name!",
  "tell me a joke":
    "Why don’t scientists trust atoms? Because they make up everything!",
  "who created you?": "I was created by Chintan Pansuriya",
  "who is your owner?": "My owner is Chintan Pansuriya",
  "how do you do?": "I don't have feelings, but I'm here to assist you!",
  "what is the meaning of life?":
    "The meaning of life is subjective and varies for each individual.",
  "tell me something interesting":
    "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
  "favorite color": "I don't have a favorite color; I appreciate them all!",
  "how does the internet work?":
    "The internet is a global network of interconnected computers that communicate using standard protocols. It enables the transfer of data and information worldwide.",
  "thank you":
    "You're welcome! If you have any more questions, feel free to ask.",
  "tell me a riddle":
    "I’m tall when I’m young, and I’m short when I’m old. What am I? Answer: A candle!",
  "recommend a book":
    "One highly recommended book is 'The Hitchhiker's Guide to the Galaxy' by Douglas Adams.",
  "what's the weather like today?":
    "I'm sorry, I don't have real-time data. You can check a weather website for the current weather!",
  "favorite movie":
    "I don't watch movies, but I hear 'The Matrix' is quite popular!",
  "where are you from?":
    "I exist in the digital realm, so you could say I'm from the world wide web!",
  "what's your favorite programming language?":
    "I don't have preferences, but I was created using JavaScript!",
  bye: "Goodbye! If you need assistance later, don't hesitate to return.",
  default: "I didn't understand that. Can you please rephrase?",
};

router.post("/register", async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same username already exists." });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        password: hashedPassword,
        firstname,
        lastname,
      });

      await user.save();

      res.status(200).json({ message: "User registered successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user-profile", async (req, res) => {
  try {
    const userId = req.query.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid userId" });
    }

    res.status(200).json({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/chat/send", async (req, res) => {
  try {
    const { message, userId } = req.body;
    const botResponse =
      chatbotResponses[message.toLowerCase()] || chatbotResponses["default"];
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          chatHistory: [
            {
              message: message,
              timestamp: new Date(),
              sent: true,
            },
            {
              message: botResponse,
              timestamp: new Date(),
              sent: false,
            },
          ],
        },
      },
      { new: true }
    );

    res.status(201).json({ message: "Chat message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/chat/history", async (req, res) => {
  try {
    const userId = req.query.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const chatHistory = user.chatHistory;

    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/clear-chat-history", async (req, res) => {
  try {
    const { userId } = req.body;

    await User.findByIdAndUpdate(userId, { $set: { chatHistory: [] } });

    res.status(200).json({ message: "Chat history cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
