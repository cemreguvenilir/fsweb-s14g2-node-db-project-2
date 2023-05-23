const carsModel = require("./cars-model");
const vinValidator = require("vin-validator");

const checkCarId = async (req, res, next) => {
  // HOKUS POKUS
  try {
    const isExist = await carsModel.getById(req.params.id);
    if (!isExist) {
      res.status(404).json({ message: "car is not found" });
    } else {
      req.currentCar = isExist;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkCarPayload = (req, res, next) => {
  // HOKUS POKUS
  try {
    const fields = ["vin", "make", "model", "mileage"];
    let missedFields = [];
    for (let i = 0; i < fields.length; i++) {
      const item = fields[i];
      if (!req.body[item]) {
        missedFields.push(item);
      }
    }

    if (missedFields.length > 0) {
      res.status(400).json({
        message: `${missedFields.toString()} ${
          missedFields.length == 1 ? "is" : "are"
        } missing`,
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkVinNumberValid = (req, res, next) => {
  // HOKUS POKUS
  try {
    let isValidVin = vinValidator.validate(req.body.vin);
    if (!isValidVin) {
      res.status(400).json({ message: `vin ${req.body.vin} is invalid` });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkVinNumberUnique = async (req, res, next) => {
  // HOKUS POKUS
  try {
    let isExist = await carsModel.getByVin(req.body.vin);
    if (isExist) {
      res.status(400).json({ message: `vin ${req.body.vin} already exists` });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
};
