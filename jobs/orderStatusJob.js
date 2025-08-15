const cron = require("node-cron");
const Order = require("../models/order");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🔄 Checking shipped orders to mark as completed...");

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const ordersToUpdate = await Order.find({
      status: "Shipped",
      shippedAt: { $lte: twoDaysAgo },
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
