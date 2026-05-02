import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/config/database.js"; // adjust if needed
import User from "./src/models/User.js"; // adjust path if needed

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();

    const users = [
      {
        firstName: "Harsh",
        lastName: "Pagda",
        email: "harsh@example.com",
        phone: "9876543210",
        password: "password123",
        voterId: "ABC1234567",
        aadharNumber: "123456789012",
        state: "Gujarat",
        constituency: "Ahmedabad West",
        dateOfBirth: new Date("2000-05-10"),
        role: "user",
        isEligible: true,
        hasVoted: false,
        preferredLanguage: "en",
        isVerified: true,
      },
      {
        firstName: "Rahul",
        lastName: "Sharma",
        email: "rahul@example.com",
        phone: "9123456789",
        password: "password123",
        voterId: "XYZ9876543",
        aadharNumber: "987654321098",
        state: "Maharashtra",
        constituency: "Mumbai South",
        dateOfBirth: new Date("1995-08-15"),
        role: "admin",
        isEligible: true,
        hasVoted: true,
        preferredLanguage: "hi",
        isVerified: true,
      },
      {
        firstName: "Priya",
        lastName: "Patel",
        email: "priya@example.com",
        phone: "9012345678",
        password: "password123",
        state: "Gujarat",
        constituency: "Surat East",
        dateOfBirth: new Date("2007-02-20"),
        role: "user",
        isEligible: false,
        hasVoted: false,
        preferredLanguage: "en",
        isVerified: false,
      },
      {
        firstName: "Amit",
        lastName: "Verma",
        email: "amit@example.com",
        phone: "9988776655",
        password: "password123",
        state: "Gujarat",
        constituency: "New Delhi",
        dateOfBirth: new Date("1988-11-25"),
        role: "user",
        isEligible: true,
        hasVoted: false,
        preferredLanguage: "hi",
        isVerified: true,
      },
    ];

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");
    console.log(`Inserted Users: ${users.length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedUsers();
