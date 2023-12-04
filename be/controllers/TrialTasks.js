import Trialtask from "../models/TrialTaskModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

// Define the task attributes that can be used to filter the tasks
const trialtaskAttributes = [
  'uuid',
  'id',
  'name',
  'part_name',
  'visual_image',
  'tanggalIn',
  'tanggalCek',
  'quantity',
  'status',
  'remark_image',
  'note',
];

export const getTrialTasks = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Trialtask.findAll({
        attributes: trialtaskAttributes, // Get all data
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
        ],
      });
    } else {
      response = await Trialtask.findAll({
        attributes: trialtaskAttributes, // Get all data
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
        ],
      });
    }
    res
      .status(200)
      .json(response);
  } catch (error) {
    res
      .status(500)
      .json({ msg: error.message });
  }
};

export const getTrialtaskId = async (req, res) => {
  try {
    const trialtask = await Trialtask.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!trialtask)
      return res
        .status(404)
        .json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Trialtask.findOne({
        attributes: trialtaskAttributes,
        where: {
          id: trialtask.id,
        },
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
        ],
      });
    } else {
      response = await Trialtask.findOne({
        attributes: trialtaskAttributes,
        where: {
          [Op.and]: [
            {
              id: trialtask.id,
            },
            {
              userId: req.userId,
            },
          ],
        },
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
        ],
      });
    }

    res
      .status(200)
      .json(response);
  } catch (error) {
    res
      .status(500)
      .json({ msg: error.message });
  }
};

export const createTrialTasks = async (req, res) => {
  const { name, part_name, visual_image } = req.body;
  try {
    await Trialtask.create(
      { name: name, 
        part_name: part_name, 
        visual_image: visual_image, 
        userId: req.userId }
    );
    res
      .status(201)
      .json({ msg: "Task Created Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: error.message });
  }
};

export const updateTrialTasks = async (req, res) => {
  try {
    const trialtask = await Trialtask.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!trialtask)
      return res
        .status(404)
        .json({ msg: "Data tidak ditemukan" });
    const {
      name, part_name, visual_image, tanggalIn, quantity, tanggalCek, status, remark_image, note
    } = req.body;
    if (req.role === "admin" || req.role === "moderator") {
      await Trialtask.update({
        name, part_name, visual_image, tanggalIn, quantity, tanggalCek, status, remark_image, note
      }, {
        where: {
          id: trialtask.id,
        },
      });
    } else {
      if (req.userId !== trialtask.userId)
        return res
          .status(403)
          .json({ msg: "Akses terlarang" });
      await Trialtask.update({
        name, part_name, visual_image, remark_image
      }, {
        where: {
          [Op.and]: [
            {
              id: trialtask.id,
            },
            {
              userId: req.userId,
            },
          ],
        },
      });
    }
    res
      .status(200)
      .json({ msg: "Task updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: error.message });
  }
};

export const deleteTrialTask = async (req, res) => {
  try {
    const trialtask = await Trialtask.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!trialtask)
      return res
        .status(404)
        .json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin") {
      await Trialtask.destroy({
        where: {
          id: trialtask.id,
        },
      });
    } else {
      if (req.userId !== trialtask.userId)
        return res
          .status(403)
          .json({ msg: "Akses terlarang" });

      // Check if the confirmation flag is sent from the frontend
      if (!req.body.confirmation) {
        return res
          .status(200)
          .json({ msg: "Task deletion requires confirmation" });
      }

      await Trialtask.destroy({
        where: {
          [Op.and]: [
            {
              id: trialtask.id,
            },
            {
              userId: req.userId,
            },
          ],
        },
      });
    }
    res
      .status(200)
      .json({ msg: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: error.message });
  }
};