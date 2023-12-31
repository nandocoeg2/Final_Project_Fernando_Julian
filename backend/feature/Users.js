import prisma from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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

export const getUserMenu = async (req, res) => {
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
          },
        },
      },
    });
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }
    res.json(menu);
  } catch (error) {
    console.log(error);
  }
};

export const getRoleMenu = async (req, res) => {
  try {
    const menu = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        menus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(menu);
  } catch (error) {
    console.log(error);
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const menu = await prisma.menu.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json(menu);
  } catch (error) {
    console.log(error);
  }
};

export const updateRoleMenu = async (req, res) => {
  try {
    const { roleId, menuIds } = req.body;
    if (menuIds.length === 0) {
      return res.status(400).send("Menu is required");
    }
    if (!roleId) {
      return res.status(400).send("Role is required");
    }
    const parsedMenuIds = menuIds.map((menuId) => ({
      id: parseInt(menuId),
    }));
    const role = await prisma.role.update({
      where: {
        id: parseInt(roleId),
      },
      data: {
        menus: {
          set: parsedMenuIds,
        },
      },
    });
    res.status(200).send(`Successfully updated role menu ${roleId}`);
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
    res.status(400).send(`Error: Cannot Delete User`);
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        email,
        password: await bcrypt.hash(password, await bcrypt.genSalt()),
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
    const { name, length, userId, data } = req.body;
    const report = await prisma.reportUpload.create({
      data: {
        name,
        userId,
        length,
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
    res.status(400).send(`Cannot create report`);
  }
};

export const getReportData = async (req, res) => {
  try {
    const report = await prisma.reportUpload.findMany({
      select: {
        id: true,
        name: true,
        length: true,
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
      orderBy: {
        createdAt: "desc",
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
        length: true,
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
    if (report.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(400).send(`Error: Cannot get report data`);
  }
};

export const getReportDataById = async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const report = await prisma.reportUpload.findUnique({
      where: {
        id: dataId,
      },
      select: {
        id: true,
        name: true,
        length: true,
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
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.log(error);
  }
};

export const actionReportData = async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const { statusReportId, processByUser } = req.body;
    const report = await prisma.reportUpload.update({
      where: {
        id: dataId,
      },
      data: {
        statusReportId: parseInt(statusReportId),
        processedByUserId: processByUser,
      },
    });
    res.status(200).send(`Successfully update status report data ${dataId}`);
  } catch (error) {
    res.status(400).send(`Error: Cannot update status report data`);
  }
};
