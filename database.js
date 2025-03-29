const sqlite3 = require("sqlite3").verbose();

// 📌 فتح اتصال بقاعدة البيانات
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("❌ خطأ في فتح قاعدة البيانات:", err.message);
    } else {
        console.log("✅ تم الاتصال بقاعدة البيانات!");
    }
});

// 📌 إنشاء الجداول إذا لم تكن موجودة
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plate_number TEXT UNIQUE NOT NULL,
        driver_name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS cameras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        camera_name TEXT NOT NULL,
        rtsp_url TEXT UNIQUE NOT NULL,
        FOREIGN KEY(vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS gps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        speed REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
    )`);

    console.log("✅ تم إنشاء الجداول بنجاح!");
});

// 📌 تشغيل أوامر `INSERT`, `UPDATE`, `DELETE`
const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                console.error("❌ خطأ في dbRun:", err.message);
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

// 📌 تشغيل أوامر `SELECT`
const dbAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error("❌ خطأ في dbAll:", err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// 📌 تصدير الوظائف لاستخدامها في `server.js`
module.exports = { db, dbRun, dbAll };
