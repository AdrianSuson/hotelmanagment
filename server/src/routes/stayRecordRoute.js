import express from "express";
import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "..", "assets", "id_pictures");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const date = new Date();
    const datePrefix = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${datePrefix}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Route to fetch stay records data
router.get("/stay_records", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        stay_records.id,
        CONCAT(guests.first_name, ' ', guests.last_name) AS guestName,
        guests.id AS guest_id,
        rooms.room_number,
        rooms.id AS room_id,
        rooms.rate AS roomRate,
        sc.label AS status,
        sc.code AS code,
        sc.color AS bgColor,
        sc.text_color AS textColor,
        stay_records.check_in,
        stay_records.check_out,
        stay_records.adults,
        stay_records.kids,
        stay_records.adults + stay_records.kids AS guestNumber
      FROM stay_records
      JOIN guests ON stay_records.guest_id = guests.id
      JOIN rooms ON stay_records.room_id = rooms.id
      JOIN status_codes sc ON rooms.status_code_id = sc.id
    `);

    const currentDate = new Date();

    for (const record of rows) {
      const checkOutDate = new Date(record.check_out);
      const currentDateWithoutTime = new Date(currentDate.setHours(0, 0, 0, 0));
      const checkOutDateWithoutTime = new Date(
        checkOutDate.setHours(0, 0, 0, 0)
      );

      if (
        currentDateWithoutTime > checkOutDateWithoutTime &&
        record.code !== "12"
      ) {
        // If current date is after checkout date and status is not "12", set it to "12" (Overtime)
        await db.query("UPDATE rooms SET status_code_id = 12 WHERE id = ?", [
          record.room_id,
        ]);
      } else if (
        currentDateWithoutTime <= checkOutDateWithoutTime &&
        record.code !== "1"
      ) {
        // If checkout date is today or later and status is "12", change status back to "1"
        await db.query("UPDATE rooms SET status_code_id = 1 WHERE id = ?", [
          record.room_id,
        ]);
      }
    }

    const [updatedRows] = await db.query(`
      SELECT
        stay_records.id,
        CONCAT(guests.first_name, ' ', guests.last_name) AS guestName,
        guests.id AS guest_id,
        rooms.room_number,
        rooms.id AS room_id,
        rooms.rate AS roomRate,
        sc.label AS status,
        sc.code AS code,
        sc.color AS bgColor,
        sc.text_color AS textColor,
        stay_records.check_in,
        stay_records.check_out,
        stay_records.adults,
        stay_records.kids,
        stay_records.adults + stay_records.kids AS guestNumber
      FROM stay_records
      JOIN guests ON stay_records.guest_id = guests.id
      JOIN rooms ON stay_records.room_id = rooms.id
      JOIN status_codes sc ON rooms.status_code_id = sc.id
    `);

    res.json({ success: true, stay_records: updatedRows });
  } catch (error) {
    console.error("Error fetching stay records:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching stay records.",
    });
  }
});

// Route to fetch stay records by guest ID (only one route now)
router.get("/stay_records/guest/:guest_id", async (req, res) => {
  const guestId = req.params.guest_id;

  try {
    const [rows] = await db.query(
      `
      SELECT
        stay_records.id,
        CONCAT(guests.first_name, ' ', guests.last_name) AS guestName,
        guests.id AS guest_id,
        rooms.room_number,
        rooms.id AS room_id,
        rooms.rate AS roomRate,
        sc.label AS status,
        sc.color AS bgcolor,
        sc.text_color,
        stay_records.check_in,
        stay_records.check_out,
        stay_records.adults,
        stay_records.kids,
        stay_records.adults + stay_records.kids AS guestNumber
      FROM stay_records
      JOIN guests ON stay_records.guest_id = guests.id
      JOIN rooms ON stay_records.room_id = rooms.id
      JOIN status_codes sc ON rooms.status_code_id = sc.id
      WHERE stay_records.guest_id = ?;
    `,
      [guestId]
    );

    const currentDate = new Date();

    for (const record of rows) {
      const checkOutDate = new Date(record.check_out);
      const currentDateWithoutTime = new Date(currentDate.setHours(0, 0, 0, 0));
      const checkOutDateWithoutTime = new Date(
        checkOutDate.setHours(0, 0, 0, 0)
      );

      if (
        currentDateWithoutTime > checkOutDateWithoutTime &&
        record.code !== "12"
      ) {
        await db.query("UPDATE rooms SET status_code_id = 12 WHERE id = ?", [
          record.room_id,
        ]);
      } else if (
        currentDateWithoutTime <= checkOutDateWithoutTime &&
        record.code === "12"
      ) {
        await db.query("UPDATE rooms SET status_code_id = 1 WHERE id = ?", [
          record.room_id,
        ]);
      }
    }

    res.json({ success: true, stay_records: rows });
  } catch (error) {
    console.error("Error fetching stay records:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching stay records.",
    });
  }
});

// Route to create or update a stay record
router.post(
  "/makeStayRecord",
  upload.single("id_picture"),
  async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      room_id,
      check_in,
      check_out,
      adults,
      kids,
    } = req.body;
    const file = req.file;

    try {
      // Check if the email already exists
      const [existingGuest] = await db.query(
        "SELECT id, id_picture FROM guests WHERE email = ?",
        [email]
      );

      let guestId;
      let oldImageFilename = null;

      if (existingGuest.length > 0) {
        // Use the existing guest's ID and update their information
        guestId = existingGuest[0].id;
        oldImageFilename = existingGuest[0].id_picture;

        const updateFields = [];
        const updateValues = [];

        if (firstName) {
          updateFields.push("first_name = ?");
          updateValues.push(firstName);
        }

        if (lastName) {
          updateFields.push("last_name = ?");
          updateValues.push(lastName);
        }

        if (phoneNumber) {
          updateFields.push("phone = ?");
          updateValues.push(phoneNumber);
        }

        if (file && file.filename !== oldImageFilename) {
          updateFields.push("id_picture = ?");
          updateValues.push(file.filename);
        }

        if (updateFields.length > 0) {
          updateValues.push(guestId);
          await db.query(
            `UPDATE guests SET ${updateFields.join(", ")} WHERE id = ?`,
            updateValues
          );
        }

        // If a new image was uploaded, delete the old image file
        if (file && oldImageFilename && file.filename !== oldImageFilename) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "..",
            "assets",
            "id_pictures",
            oldImageFilename
          );
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Failed to delete old ID picture:", err);
            } else {
              console.log(
                "Old ID picture deleted successfully:",
                oldImageFilename
              );
            }
          });
        }
      } else {
        // Insert the new guest
        const guestFields = [firstName, lastName, email, phoneNumber];
        let guestValues = "(first_name, last_name, email, phone";

        if (file) {
          guestFields.push(file.filename);
          guestValues += ", id_picture";
        }

        guestValues += ") VALUES (?, ?, ?, ?";
        if (file) {
          guestValues += ", ?";
        }
        guestValues += ")";

        const [guestResult] = await db.query(
          `INSERT INTO guests ${guestValues}`,
          guestFields
        );

        if (!guestResult.insertId) {
          throw new Error("Failed to create guest.");
        }

        guestId = guestResult.insertId;
      }

      // Create a stay record using the guest ID
      const parsedCheckIn = new Date(check_in);
      const parsedCheckOut = new Date(check_out);
      const [stayRecordResult] = await db.query(
        "INSERT INTO stay_records (room_id, guest_id, check_in, check_out, adults, kids) VALUES (?, ?, ?, ?, ?, ?)",
        [room_id, guestId, parsedCheckIn, parsedCheckOut, adults, kids]
      );

      if (!stayRecordResult.insertId) {
        throw new Error("Failed to create stay record.");
      }

      res.json({
        success: true,
        message: "Stay record created successfully.",
        stayRecordId: stayRecordResult.insertId,
      });
    } catch (error) {
      console.error("Stay Record Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while creating stay record.",
      });
    }
  }
);

router.post(
  "/makeNewStayRecord",
  upload.single("id_picture"),
  async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      room_id,
      check_in,
      check_out,
      adults,
      kids,
    } = req.body;
    const file = req.file;

    try {
      // Check if the email already exists
      const [existingGuest] = await db.query(
        "SELECT id FROM guests WHERE email = ?",
        [email]
      );

      if (existingGuest.length > 0) {
        // If the email is already registered, return an error
        return res.status(400).json({
          success: false,
          message: "Email is already registered. Please use a different email.",
        });
      }

      // Insert the new guest
      const guestFields = [firstName, lastName, email, phoneNumber];
      let guestValues = "(first_name, last_name, email, phone";

      if (file) {
        guestFields.push(file.filename);
        guestValues += ", id_picture";
      }

      guestValues += ") VALUES (?, ?, ?, ?";
      if (file) {
        guestValues += ", ?";
      }
      guestValues += ")";

      const [guestResult] = await db.query(
        `INSERT INTO guests ${guestValues}`,
        guestFields
      );

      if (!guestResult.insertId) {
        throw new Error("Failed to create guest.");
      }

      const guestId = guestResult.insertId;

      // Create a stay record using the new guest ID
      const parsedCheckIn = new Date(check_in);
      const parsedCheckOut = new Date(check_out);
      const [stayRecordResult] = await db.query(
        "INSERT INTO stay_records (room_id, guest_id, check_in, check_out, adults, kids) VALUES (?, ?, ?, ?, ?, ?)",
        [room_id, guestId, parsedCheckIn, parsedCheckOut, adults, kids]
      );

      if (!stayRecordResult.insertId) {
        throw new Error("Failed to create stay record.");
      }

      res.json({
        success: true,
        message: "Stay record created successfully.",
        stayRecordId: stayRecordResult.insertId,
      });
    } catch (error) {
      console.error("Stay Record Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while creating stay record.",
      });
    }
  }
);

// Route to update stay record details
router.put("/stay_records/:id", async (req, res) => {
  const stayRecordId = req.params.id;
  const { room_id, check_in, check_out, adults, kids } = req.body;

  const sqlParts = [];
  const values = [];

  if (room_id !== undefined) {
    sqlParts.push("room_id = ?");
    values.push(room_id);
  }
  if (check_in !== undefined) {
    sqlParts.push("check_in = ?");
    values.push(new Date(check_in));
  }
  if (check_out !== undefined) {
    sqlParts.push("check_out = ?");
    values.push(new Date(check_out));
  }
  if (adults !== undefined) {
    sqlParts.push("adults = ?");
    values.push(adults);
  }
  if (kids !== undefined) {
    sqlParts.push("kids = ?");
    values.push(kids);
  }

  if (sqlParts.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No fields provided for update." });
  }

  const sql = `UPDATE stay_records SET ${sqlParts.join(", ")} WHERE id = ?`;
  values.push(stayRecordId);

  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Stay record not found." });
    }
    res.json({ success: true, message: "Stay record updated successfully." });
  } catch (error) {
    console.error("Error updating stay record:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while updating the stay record.",
    });
  }
});

// Route to delete stay record
router.delete("/stay_records/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "DELETE FROM stay_records WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error("Stay record not found.");
    }

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      message: "Stay record deleted successfully.",
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Error deleting stay record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete stay record.",
    });
  }
});

export default router;
