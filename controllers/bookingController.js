const stripe = require("stripe")(
  "sk_test_51OcxAESCgR1oQTIJH2nORdUqZUVec5Ct69hzOEwA5tyYbnSqlZjyqSsMWZekmHJy7Z0hs34p2v7drd0UHagwjTDv00PMdLmGcT"
);
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

const factory = require("./handleFactory");

exports.getCheckoutSession = async (req, res, next) => {
  try {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: "http://localhost:3000/tour/the-sea-explorer",
      //   success_url: `${req.protocol}://${req.get("host")}/my-tours/?tour=${
      //     req.params.tourId
      //   }&user=${req.user.id}&price=${tour.price}`,
      //   success_url: `${req.protocol}://${req.get(
      //     "host"
      //   )}/my-tours?alert=booking`,
      cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        // {
        //   name: `${tour.name} Tour`,
        //   description: tour.summary,

        //   unit_amount: tour.price * 100,
        //   currency: "usd",
        //   quantity: 1,
        // },
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: `${tour.name} Tour`,
            },
            unit_amount: tour.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    });

    // 3) Create session as response
    console.log(session, "sssesssionnn");
    createBookingCheckout(session);
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {}
};

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_SECRET_KEY
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    console.log("yesssssssssssssssssss");
  createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
