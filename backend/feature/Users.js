import prisma from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  });
  res.json(users);
};

export const Register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: {
          connect: {
            id: role,
          },
        },
      },
    });

    res.json(`User ${user.name} created successfully`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
      include: {
        role: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const userId = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role.name;
    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const decoded = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "You are not authenticated" });
  }

  // const user = await prisma.user.findFirst({
  //   where: {
  //     refreshToken: refreshToken,
  //   },
  // });

  // console.log(user);

  // await prisma.user.update({
  //   where: {
  //     id: user.id,
  //   },
  //   data: {
  //     refreshToken: null,
  //   },
  // });

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const Menu = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "You are not authenticated" });
    }
    const decoded = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const menu = await prisma.role.findUnique({
      where: {
        name: decoded.role,
      },
      select: {
        menus: {
          select: {
            id: true,
            name: true,
            url: true,
            subMenus: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });
    res.json(menu);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.send(`User deleted ${deletedUser.name} successfully`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { name, email, password, role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        email,
        password,
        role: {
          connect: {
            id: parseInt(role),
          },
        },
      },
    });
    res.send(`User updated ${updatedUser.name} successfully`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
