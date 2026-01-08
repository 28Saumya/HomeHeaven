const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
    return updateListings();
  })
  .catch((err) => console.error(err));

async function main() {
  await mongoose.connect(Mongo_url);
}

async function updateListings() {
  await Listing.updateMany({}, {
    $set: {
      location: "Default Location",
      country: "Default Country"
    }
  });

  console.log("✅ All listings updated.");
  mongoose.connection.close();
}
