const Listing = require("../models/listing");

// ================= INDEX =================
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// ================= NEW FORM =================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// ================= CREATE =================
module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);

  // 🔑 owner is REQUIRED for delete/edit
  listing.owner = req.user._id;

  // image upload (Cloudinary)
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${listing._id}`);
};

// ================= SHOW =================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
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
};

// ================= EDIT FORM =================
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
};

// ================= UPDATE =================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing);

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// ================= DELETE =================
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
