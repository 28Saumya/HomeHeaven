const Listing = require("./models/listing");
const Review = require("./models/review");

/* ================= LOGIN CHECK ================= */
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

/* ================= LISTING OWNER CHECK ================= */
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

/* ================= REVIEW AUTHOR CHECK ================= */
module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
