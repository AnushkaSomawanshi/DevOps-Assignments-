import { Appointment } from "../models/Appointment.js";
import { Blog } from "../models/Blog.js";
import { Doctor } from "../models/Doctor.js";
import { HealthPackage } from "../models/HealthPackage.js";
import { Hospital } from "../models/Hospital.js";
import { User } from "../models/User.js";
import {
  seedAppointments,
  seedBlogs,
  seedDoctors,
  seedHospitals,
  seedPackages,
  seedUsers,
} from "../data/seedData.js";

export async function seedDatabase() {
  const [userCount, doctorCount, hospitalCount, packageCount, blogCount, appointmentCount] =
    await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Hospital.countDocuments(),
      HealthPackage.countDocuments(),
      Blog.countDocuments(),
      Appointment.countDocuments(),
    ]);

  if (!userCount) await User.insertMany(seedUsers);
  if (!doctorCount) await Doctor.insertMany(seedDoctors);
  if (!hospitalCount) await Hospital.insertMany(seedHospitals);
  if (!packageCount) await HealthPackage.insertMany(seedPackages);
  if (!blogCount) await Blog.insertMany(seedBlogs);
  if (!appointmentCount) await Appointment.insertMany(seedAppointments);
}
