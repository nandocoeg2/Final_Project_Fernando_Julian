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
      role: true,
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

export const reportData = async (req, res) => {
  try {
    const { name, size, userId, statusReportId, data } = req.body;
    const report = await prisma.reportUpload.create({
      data: {
        name,
        size,
        userId,
        statusReportId,
        dataUploads: {
          create: data.map((item) => ({
            senderName: item[0],
            senderCity: item[1],
            senderCountry: item[2],
            beneficiaryName: item[3],
            beneficiaryCity: item[4],
            beneficiaryCountry: item[5],
          })),
        },
      },
    });
    res.status(200).send(`Successfully`);
  } catch (error) {
    console.log(error);
  }
};

export const getReportData = async (req, res) => {
  try {
    const report = await prisma.reportUpload.findMany({
      select: {
        id: true,
        name: true,
        size: true,
        uploadByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        statusReport: {
          select: {
            id: true,
            name: true,
          },
        },
        dataUploads: true,
        createdAt: true,
      },
    });
    res.status(200).json(report);
  } catch (error) {
    console.log(error);
  }
};

export const getReportDataByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const report = await prisma.reportUpload.findMany({
      where: {
        userId: parseInt(userId),
      },
      select: {
        id: true,
        name: true,
        size: true,
        uploadByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        statusReport: {
          select: {
            id: true,
            name: true,
          },
        },
        dataUploads: true,
        createdAt: true,
      },
    });
    res.status(200).json(report);
  } catch (error) {
    console.log(error);
  }
};

export const getReportDataById = async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const report = await prisma.reportUpload.findUnique({
      where: {
        id: parseInt(dataId),
      },
      select: {
        id: true,
        name: true,
        size: true,
        uploadByUser: {
          select: {
            id: true,
            name: true,
          },
        },
        statusReport: {
          select: {
            id: true,
            name: true,
          },
        },
        dataUploads: true,
        createdAt: true,
      },
    });
    res.status(200).json(report);
  } catch (error) {
    console.log(error);
  }
};

export const actionReportData = async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const { statusReportId } = req.body;
    const report = await prisma.reportUpload.update({
      where: {
        id: parseInt(dataId),
      },
      data: {
        statusReportId: parseInt(statusReportId),
      },
    });
    res.status(200).send(`Successfully update status report data ${dataId}`);
  } catch (error) {
    console.log(error);
  }
};
