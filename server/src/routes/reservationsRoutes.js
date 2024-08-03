import express from "express";
import db from "../config/db.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "assets", "id_pictures"));
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

router.post(
  "/makeReservation",
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
    const id_picture = req.file ? req.file.filename : null;

    try {
      // Check if the email already exists
      const [existingGuest] = await db.query(
        "SELECT id FROM guests WHERE email = ?",
        [email]
      );

      let guestId;

      if (existingGuest.length > 0) {
        // If guest exists, use the existing guest ID
        guestId = existingGuest[0].id;
      } else {
        // Insert the new guest
        const [guestResult] = await db.query(
          "INSERT INTO guests (first_name, last_name, email, phone, id_picture) VALUES (?, ?, ?, ?, ?)",
          [firstName, lastName, email, phoneNumber, id_picture]
        );

        if (!guestResult.insertId) {
          throw new Error("Failed to create guest.");
        }

        guestId = guestResult.insertId;
      }

      // Create a reservation using the guest ID
      const parsedCheckIn = new Date(check_in);
      const parsedCheckOut = new Date(check_out);
      const [reservationResult] = await db.query(
        "INSERT INTO reservations (room_id, guest_id, check_in, check_out, adults, kids) VALUES (?, ?, ?, ?, ?, ?)",
        [room_id, guestId, parsedCheckIn, parsedCheckOut, adults, kids]
      );

      if (!reservationResult.insertId) {
        throw new Error("Failed to create reservation.");
      }

      res.json({
        success: true,
        message: "Reservation created successfully.",
        reservationId: reservationResult.insertId,
      });
    } catch (error) {
      console.error("Reservation Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred while creating reservation.",
      });
    }
  }
);

router.post(
  "/confirmReservation/:id",
  upload.single("id_picture"),
  async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    let connection;

    try {
      connection = await db.getConnection(); // Get a connection from the pool
      await connection.beginTransaction(); // Start transaction

      if (file) {
        const fileName = file.filename;
        await connection.query(
          "UPDATE guests SET id_picture = ? WHERE id = (SELECT guest_id FROM reservations WHERE id = ?)",
          [fileName, id]
        );
      }

      const [reservationData] = await connection.query(
        "SELECT * FROM reservations WHERE id = ?",
        [id]
      );

      if (reservationData.length === 0) {
        throw new Error("Reservation not found.");
      }

      await connection.query(
        "INSERT INTO stay_records (room_id, guest_id, check_in, check_out, adults, kids) VALUES (?, ?, ?, ?, ?, ?)",
        [
          reservationData[0].room_id,
          reservationData[0].guest_id,
          reservationData[0].check_in,
          reservationData[0].check_out,
          reservationData[0].adults,
          reservationData[0].kids,
        ]
      );

      await connection.query("DELETE FROM reservations WHERE id = ?", [id]);

      await connection.commit();
      connection.release();

      res.send({
        success: true,
        message: "Reservation confirmed and checked in.",
      });
    } catch (error) {
      if (connection) {
        await connection.rollback();
        connection.release();
      }
      console.error("Error confirming reservation:", error);
      res.status(500).send({
        success: false,
        message: "Failed to confirm reservation.",
      });
    }
  }
);

// Route to fetch reservation data
router.get("/reservations", async (req, res) => {
  try {
    // Delete old reservations before fetching the current data
    await db.query(
      "DELETE FROM reservations WHERE check_out < NOW() - INTERVAL 1 DAY"
    );

    const [rows] = await db.query(`
      SELECT 
        reservations.id,
        reservations.room_id,
        reservations.guest_id,
        reservations.check_in,
        reservations.check_out,
        reservations.adults,
        reservations.kids,
        CONCAT(guests.first_name, ' ', guests.last_name) AS guestName,
        rooms.room_number,
        guests.id_picture,
        (reservations.adults + reservations.kids) AS guestNumber
      FROM reservations
      JOIN guests ON reservations.guest_id = guests.id
      JOIN rooms ON reservations.room_id = rooms.id;
    `);

    res.json({ success: true, reservations: rows });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching reservations.",
    });
  }
});

// Route to fetch reservation data by ID
router.get("/reservation/:id", async (req, res) => {
  const reservationId = req.params.id;

  try {
    // Delete old reservations before fetching the current data
    await db.query(
      "DELETE FROM reservations WHERE check_out < NOW() - INTERVAL 1 DAY"
    );

    const [rows] = await db.query(
      `
      SELECT 
        reservations.id,
        reservations.room_id,
        reservations.guest_id,
        reservations.check_in,
        reservations.check_out,
        reservations.adults,
        reservations.kids,
        CONCAT(guests.first_name, ' ', guests.last_name) AS guestName,
        rooms.room_number,
        guests.id_picture,
        (reservations.adults + reservations.kids) AS guestNumber
      FROM reservations
      JOIN guests ON reservations.guest_id = guests.id
      JOIN rooms ON reservations.room_id = rooms.id
      WHERE reservations.id = ?;
    `,
      [reservationId]
    );

    if (rows.length > 0) {
      res.json({ success: true, reservation: rows[0] });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching reservation.",
    });
  }
});

// Route to fetch reservation data by guest ID
router.get("/reservations/guest/:guest_id", async (req, res) => {
  const guestId = req.params.guest_id;

  try {
    // Delete old reservations before fetching the current data
    await db.query(
      "DELETE FROM reservations WHERE check_out < NOW() - INTERVAL 1 DAY"
    );

    const [rows] = await db.query(
      `
      SELECT 
        reservations.id,
        reservations.room_id,
        reservations.guest_id,
        reservations.check_in,
        reservations.check_out,
        reservations.adults,
        reservations.kids,
        CONCAT(guests.first_name, ' ', guests.last_name) AS guestName,
        rooms.room_number,
        guests.id_picture,
        (reservations.adults + reservations.kids) AS guestNumber
      FROM reservations
      JOIN guests ON reservations.guest_id = guests.id
      JOIN rooms ON reservations.room_id = rooms.id
      WHERE reservations.guest_id = ?;
    `,
      [guestId]
    );

    res.json({ success: true, reservations: rows });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching reservations.",
    });
  }
});

// Route to delete a reservation and the guest if they have no other reservations
router.delete("/deleteReservation/:id", async (req, res) => {
  const reservationId = req.params.id;
  try {
    // Find the guest ID associated with the reservation
    const [reservation] = await db.query(
      "SELECT guest_id FROM reservations WHERE id = ?",
      [reservationId]
    );

    if (reservation.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found." });
    }

    const guestId = reservation[0].guest_id;

    // Delete the reservation
    const [deleteResult] = await db.query(
      "DELETE FROM reservations WHERE id = ?",
      [reservationId]
    );

    if (deleteResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found." });
    }

    // Check if the guest has any other reservations
    const [guestReservations] = await db.query(
      "SELECT id FROM reservations WHERE guest_id = ?",
      [guestId]
    );

    if (guestReservations.length === 0) {
      // Delete the guest if they have no other reservations
      await db.query("DELETE FROM guests WHERE id = ?", [guestId]);
    }

    res.json({
      success: true,
      message: "Reservation and guest deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while deleting the reservation.",
    });
  }
});

router.put("/reservations/:id", async (req, res) => {
  const reservationId = req.params.id;
  const { room_id, check_in, check_out, adults, kids } = req.body;

  // Create an array to hold SQL parts and another for the parameters
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

  // Check if there are any fields to update
  if (sqlParts.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No fields provided for update." });
  }

  // Join all parts of the SQL statement
  const sql = `UPDATE reservations SET ${sqlParts.join(", ")} WHERE id = ?`;
  values.push(reservationId);

  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found." });
    }
    res.json({ success: true, message: "Reservation updated successfully." });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while updating the reservation.",
    });
  }
});

export default router;
