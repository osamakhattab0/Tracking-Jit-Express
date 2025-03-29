const express = require("express");
const cors = require("cors");
const { db, dbRun, dbAll } = require("./config/database");

const app = express();
const PORT = 3000; // يمكنك تغيير المنفذ إذا لزم الأمر

// ✅ تفعيل الميزات الأساسية
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ✅ تحميل المسارات (Routes)
const vehicleRoutes = require("./routes/vehicles");
const cameraRoutes = require("./routes/cameras");
const gpsRoutes = require("./routes/gps");

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/cameras", cameraRoutes);
app.use("/api/gps", gpsRoutes);

// ✅ التحقق من اتصال قاعدة البيانات
db.all("SELECT 1", (err) => {
    if (err) {
        console.error("❌ فشل الاتصال بقاعدة البيانات:", err.message);
    } else {
        console.log("✅ قاعدة البيانات متصلة بنجاح!");
    }
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
});
