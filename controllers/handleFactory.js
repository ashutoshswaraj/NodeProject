const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`${doc} not found`, 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("Please upadate properly"));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createOne = (Model) => async (req, res) => {
  // console.log(req.body);
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `failesd${err}`,
    });
  }
};

exports.getOne = (Model, popOption) => async (req, res, next) => {
  try {
    let querry = Model.findById(req.params.id);
    if (popOption) querry.populate(popOption);
    // const fetAlltour = await Tour.findById(req.params.id)

    // we use populate on the field we want to add referece data from user module
    // const fetAlltour = await Tour.findById(req.params.id).populate("guides")

    // now if we dont want some fields from user in our guide
    const fetchalldata = await querry;

    if (!fetchalldata) {
      return next(new AppError("No doc found"));
    }
    res.status(200).json({
      status: "success",

      data: fetchalldata,
    });
  } catch (err) {}
};
// exports.getOneTour_slug = (Model, popOption) => async (req, res, next) => {
//   try {
//     let querry = Model.findOne(req.params.slug);
//     console.log(querry, "qqqqqqqqqqqqqqq");
//     if (popOption) querry.populate(popOption);
//     // const fetAlltour = await Tour.findById(req.params.id)

//     // we use populate on the field we want to add referece data from user module
//     // const fetAlltour = await Tour.findById(req.params.id).populate("guides")

//     // now if we dont want some fields from user in our guide
//     const fetchalldata = await querry;

//     if (!fetchalldata) {
//       return next(new AppError("No doc found"));
//     }
//     res.status(200).json({
//       status: "success",
//       data: {
//         data: fetchalldata,
//       },

//     });
//   } catch (err) {}
// };

exports.getOneTour_slug = (Model, popOption) => async (req, res, next) => {
  try {
    // Corrected query syntax
    const query = { slug: req.params.slug };

    // Use the corrected query
    let querry = Model.findOne(query);

    console.log(querry, "qqqqqqqqqqqqqqq");

    if (popOption) querry.populate(popOption);

    const fetchalldata = await querry;

    if (!fetchalldata) {
      return next(new AppError("No doc found"));
    }

    res.status(200).json({
      status: "success",
      data: [fetchalldata],
    });
  } catch (err) {
    // Handle error appropriately
    console.error(err);
    next(new AppError("Error fetching data"));
  }
};

exports.getAll = (Model) => async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  } catch (err) {}
};
