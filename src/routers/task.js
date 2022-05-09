const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const sortOrder = {
  desc: -1,
  asc: 1,
};

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const { completed, limit, skip, sortBy } = req.query;
  const match = {};
  const sort = {};

  if (completed) {
    match.completed = completed === "true";
  }

  if (sortBy) {
    const [key, value] = sortBy.split(":");

    sort[key] = sortOrder[value];
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(limit) || 0,
        skip: parseInt(skip) || 0,
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const { id: _id } = req.params;

  try {
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const keysToUpdate = Object.keys(req.body);
  const allowedKeys = ["description", "completed"];

  const isValidOperation = keysToUpdate.every((key) =>
    allowedKeys.includes(key)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid updates!",
    });
  }

  const { id: _id } = req.params;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    keysToUpdate.forEach((key) => (task[key] = req.body[key]));

    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const { id: _id } = req.params;

  try {
    const result = await Task.findOneAndDelete({ _id, owner: req.user._id });

    if (!result) {
      return res.status(404).send();
    }

    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
