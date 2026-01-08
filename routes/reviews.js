const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

// ADD REVIEW
router.post("/", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);

  review.author = req.user._id;
  listing.reviews.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
});

// DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, async (req, res) => {
  await Listing.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewId },
  });
  await Review.findByIdAndDelete(req.params.reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${req.params.id}`);
});

module.exports = router;
