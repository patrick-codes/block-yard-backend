const cron = require("node-cron");
const order = require("../models/order");

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🔄 Checking for shipped orders to complete...");

    // Find orders in "Processing" older than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const ordersToUpdate = await order.find({
      status: "Processing",
      updatedAt: { $lte: threeDaysAgo },
    });

    for (let ord of ordersToUpdate) {
      ord.status = "Completed";
      await ord.save();
      console.log(`✅ Order ${ord._id} marked as Completed`);
    }

    console.log("✅ Order status job finished");
  } catch (err) {
    console.error("❌ Error in order status job:", err.message);
  }
});
