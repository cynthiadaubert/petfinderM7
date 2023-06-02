import { User, Auth } from "../models";
import { getSHA256ofString, updatePassword } from "./auth-controller";

export async function createUser(data) {
  const { email, password, username } = data;
  try {
    const newUser = await User.create({
      email: email,
      username: username,
    });
    let userId = newUser.get("id");
    const newAuth = await Auth.create({
      email: email,
      password: getSHA256ofString(password),
      user_Id: userId,
    });
    return userId; // debe retornar si o si!!
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function findEmail(email) {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    /*     console.log("soy el user",user) */
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateUserData(data, userId) {
  const updatedData = {
    name: data.name,
    location: data.location,
    password: data.password,
  };
  if (updatedData.name) {
    try {
      await User.update(
        {
          name: updatedData.name,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  if (updatedData.location) {
    try {
      await User.update(
        {
          location: updatedData.location,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  if (updatedData.password) {
    try {
      await updatePassword(updatedData.password, userId);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  return updatedData;
}

export async function getAllUsers() {
  try {
    return await User.findAll({});
  } catch (error) {
    throw error;
  }
}
