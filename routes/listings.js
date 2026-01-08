const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

/* ================= INDEX ================= */
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

/* ================= NEW ================= */
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

/* ================= CREATE ================= */
router.post("/", isLoggedIn, upload.single("image"), async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing created!");
  res.redirect(`/listings/${listing._id}`);
});

/* ================= SHOW ================= */
router.get("/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
});

/* ================= EDIT ================= */
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
});

/* ================= UPDATE ================= */
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = req.body.listing.location;
  listing.country = req.body.listing.country;

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
});

/* ================= DELETE ================= */
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
});

module.exports = router;
