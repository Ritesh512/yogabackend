const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Handle database errors
const handleDatabaseError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? LIMIT 1";

  pool.query(query, [email], (error, results) => {
    if (error) {
      return handleDatabaseError(res, error);
    }

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    res.status(200).json({ message: "ok", user: results[0] });
  });
});

app.post("/register", (req, res) => {
  const { name, email, password, mobileNumber, age } = req.body;

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  pool.query(checkEmailQuery, [email], (error, results) => {
    if (error) {
      return handleDatabaseError(res, error);
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const insertUserQuery =
      "INSERT INTO users (name, email, password, mobileNumber, age) VALUES (?, ?, ?, ?, ?)";
    pool.query(
      insertUserQuery,
      [name, email, password, mobileNumber, age],
      (error, results) => {
        if (error) {
          return handleDatabaseError(res, error);
        }

        const insertedUserId = results.insertId;
        const getUserQuery = "SELECT * FROM users WHERE id = ?";
        pool.query(getUserQuery, [insertedUserId], (error, userResults) => {
          if (error) {
            return handleDatabaseError(res, error);
          }

          const insertedUser = userResults[0];
          res.status(200).json({ message: "ok", user: insertedUser });
        });
      }
    );
  });
});

app.post("/userPlan", (req, res) => {
  const { email, upiId, batchId } = req.body;

  const checkUserPlanQuery = "SELECT * FROM userPlans WHERE email = ?";
  pool.query(checkUserPlanQuery, [email], (error, results) => {
    if (error) {
      return handleDatabaseError(res, error);
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ error: "User plan already exists for the given email" });
    }

    const curDate = new Date();
    const lastDayOfMonth = new Date(
      curDate.getFullYear(),
      curDate.getMonth() + 1,
      0
    );
    const validTill = lastDayOfMonth;

    const alphanumeric =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let refNo = "";
    for (let i = 0; i < 12; i++) {
      refNo += alphanumeric.charAt(
        Math.floor(Math.random() * alphanumeric.length)
      );
    }

    const insertUserPlanQuery =
      "INSERT INTO userPlans (email, registrationDate, validTill, refNo, isActive, upiId, batchId) VALUES (?, ?, ?, ?, ?, ?, ?)";
    pool.query(
      insertUserPlanQuery,
      [email, curDate, validTill, refNo, true, upiId, batchId],
      (error, results) => {
        if (error) {
          return handleDatabaseError(res, error);
        }

        const insertedUserPlanId = results.insertId;
        const getUserQuery = "SELECT * FROM userPlans WHERE id = ?";
        pool.query(getUserQuery, [insertedUserPlanId], (error, userResults) => {
          if (error) {
            return handleDatabaseError(res, error);
          }

          const insertedUser = userResults[0];
          res.status(200).json({ message: "ok", user: insertedUser });
        });
      }
    );
  });
});

app.post("/getUserPlan", (req, res) => {
  const { email } = req.body;

  const getUserPlanQuery = "SELECT * FROM userPlans WHERE email = ?";
  pool.query(getUserPlanQuery, [email], (error, results) => {
    if (error) {
      return handleDatabaseError(res, error);
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Subscribe Your Plan" });
    }

    const userPlan = results[0];
    res.status(200).json({ message: "ok", userPlan });
  });
});

app.post('/checkAndDeleteUserPlan', (req, res) => {
  const { email } = req.body;

  const getUserPlanQuery = 'SELECT * FROM userPlans WHERE email = ?';
  pool.query(getUserPlanQuery, [email], (error, results) => {
    if (error) {
      return handleDatabaseError(res, error);
    }

    if (results.length === 0) {
      return res.status(200).json({ message: 'UserPlan not found' });
    }

    const userPlan = results[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validTillDate = new Date(userPlan.validTill);
    validTillDate.setHours(0, 0, 0, 0);

    if (today > validTillDate) {
      const deleteUserPlanQuery = 'DELETE FROM userPlans WHERE email = ?';
      pool.query(deleteUserPlanQuery, [email], (deleteError) => {
        if (deleteError) {
          return handleDatabaseError(res, deleteError);
        }

        res.status(200).json({ message: 'ok' });
      });
    } else {
      res.status(200).json({ message: 'UserPlan is still valid' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
