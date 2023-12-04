import SubTask from "../models/SubTaskModel.js";

// define the task attributes that can be used to filter the tasks
const taskAttributes = [
  "uuid",
  "name",
  "startDate",
  "endDate",
  "taskId",
  "design_image",
  "design_progress",
  "design_approval",
  "material_image",
  "material_progress",
  "material_approval",
  "std_part_image",
  "std_part_progress",
  "std_part_approval",
  "machining_image",
  "machining_progress",
  "machining_approval",
  "assembly_image",
  "assembly_progress",
  "assembly_approval",
  "trial_image",
  "trial_progress",
  "trial_approval",
  "harden_coating_image",
  "harden_coating_progress",
  "harden_coating_approval",
];

export const createSubTask = async (req, res) => {
  const {
    name,
    startDate,
    endDate,
    taskId,
    design_image,
    design_progress,
    design_approval,
    material_image,
    material_progress,
    material_approval,
    std_part_image,
    std_part_progress,
    std_part_approval,
    machining_image,
    machining_progress,
    machining_approval,
    assembly_image,
    assembly_progress,
    assembly_approval,
    trial_image,
    trial_progress,
    trial_approval,
    harden_coating_image,
    harden_coating_progress,
    harden_coating_approval,
  } = req.body;

  try {

    if (req.user && req.user.role === 'admin') {
      
      await SubTask.create({
        name,
		startDate,
		endDate,
        taskId,
        design_image,
        design_progress,
        design_approval,
        material_image,
        material_progress,
        material_approval,
        std_part_image,
        std_part_progress,
        std_part_approval,
        machining_image,
        machining_progress,
        machining_approval,
        assembly_image,
        assembly_progress,
        assembly_approval,
        trial_image,
        trial_progress,
        trial_approval,
        harden_coating_image,
        harden_coating_progress,
        harden_coating_approval,
      });

      res.status(201).json({ msg: "SubTask Created Successfully" });
    } else {
      await SubTask.create({
        name,
		startDate,
		endDate,
        taskId,
        design_image,
        design_progress,
        material_image,
        material_progress,
        std_part_image,
        std_part_progress,
        machining_image,
        machining_progress,
        assembly_image,
        assembly_progress,
        trial_image,
        trial_progress,
        harden_coating_image,
        harden_coating_progress,
      });

      res.status(201).json({ msg: "SubTask Created Successfully (Approval part not modified)" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getSubTasks = async (req, res) => {
  try {
    const subtask = await SubTask.findAll({
      where: {
        taskId: req.params.id,
      },
    });
    if (!subtask) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    response = await SubTask.findAll({
      attributes: taskAttributes,
      where: {
        taskId: req.params.id,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSubtaskId = async (req, res) => {
  try {
    const subtask = await SubTask.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!subtask) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    response = await SubTask.findOne({
      attributes: taskAttributes,
      where: {
        uuid: req.params.id,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSubTasks = async (req, res) => {
  try {
    const subtask = await SubTask.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!subtask) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const {
      name,
      startDate,
      endDate,
      design_image,
      design_progress,
      design_approval,
      material_image,
      material_progress,
      material_approval,
      std_part_image,
      std_part_progress,
      std_part_approval,
      machining_image,
      machining_progress,
      machining_approval,
      assembly_image,
      assembly_progress,
      assembly_approval,
      trial_image,
      trial_progress,
      trial_approval,
      harden_coating_image,
      harden_coating_progress,
      harden_coating_approval,
    } = req.body;


    subtask.name = name;
    subtask.startDate = startDate;
    subtask.endDate = endDate;
    subtask.design_image = design_image;
    subtask.design_progress = design_progress;
    subtask.design_approval = design_approval;
    subtask.material_image = material_image;
    subtask.material_progress = material_progress;
    subtask.material_approval = material_approval;
    subtask.std_part_image = std_part_image;
    subtask.std_part_progress = std_part_progress;
    subtask.std_part_approval = std_part_approval;
    subtask.machining_image = machining_image;
    subtask.machining_progress = machining_progress;
    subtask.machining_approval = machining_approval;
    subtask.assembly_image = assembly_image;
    subtask.assembly_progress = assembly_progress;
    subtask.assembly_approval = assembly_approval;
    subtask.trial_image = trial_image;
    subtask.trial_progress = trial_progress;
    subtask.trial_approval = trial_approval;
    subtask.harden_coating_image = harden_coating_image;
    subtask.harden_coating_progress = harden_coating_progress;
    subtask.harden_coating_approval = harden_coating_approval;

    await subtask.save();

    res.status(200).json({ msg: "SubTask updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const deleteSubTask = async (req, res) => {
  try {
    const subtask = await SubTask.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!subtask) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin") {
      await SubTask.destroy({
        where: {
          id: subtask.id,
        },
      });
    }
    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
