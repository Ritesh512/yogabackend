const express = require("express");
const mysqlConnection = require("./models/config");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ? LIMIT 1";
    mysqlConnection.query(
      query,
      [email],
      async function (error, results, fields) {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0 || results[0].password !== password) {
          return res.status(401).json({ error: "Invalid Credentials" });
        }

        res.status(200).json({ message: "ok", user: results[0] });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }finally{
    mysqlConnection.connect();
  }
});


app.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobileNumber, age } = req.body;

    // Check if the email is already registered
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    mysqlConnection.query(
      checkEmailQuery,
      [email],
      function (error, results, fields) {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
          return res.status(400).json({ error: "Email is already registered" });
        }

        // Insert a new user into the 'users' table
        const insertUserQuery =
          "INSERT INTO users (name, email, password, mobileNumber, age) VALUES (?, ?, ?, ?, ?)";
        mysqlConnection.query(
          insertUserQuery,
          [name, email, password, mobileNumber, age],
          function (error, results, fields) {
            if (error) {
              return res.status(500).json({ error: "Internal Server Error" });
            }

            const insertedUserId = results.insertId;

            const getUserQuery = "SELECT * FROM users WHERE id = ?";
            mysqlConnection.query(
              getUserQuery,
              [insertedUserId],
              function (error, userResults, userFields) {
                if (error) {
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                const insertedUser = userResults[0];
                res.status(200).json({ message: "ok", user: insertedUser });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }finally{
    mysqlConnection.connect();
  }
});

app.post("/userPlan", async (req, res) => {
  try {
    const { email, upiId, batchId } = req.body;

    // Check if the user plan already exists for the given email
    const checkUserPlanQuery = "SELECT * FROM userPlans WHERE email = ?";
    mysqlConnection.query(
      checkUserPlanQuery,
      [email],
      function (error, results, fields) {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "User plan already exists for the given email" });
        }

        // Calculate validTill and refNo based on curDate
        const curDate = new Date();
        const lastDayOfMonth = new Date(
          curDate.getFullYear(),
          curDate.getMonth() + 1,
          0
        );
        const validTill = lastDayOfMonth;

        // Generate a random alphanumeric refNo
        const alphanumeric =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let refNo = "";
        for (let i = 0; i < 12; i++) {
          refNo += alphanumeric.charAt(
            Math.floor(Math.random() * alphanumeric.length)
          );
        }

        // Insert a new user plan into the 'user_plans' table
        const insertUserPlanQuery =
          "INSERT INTO userPlans (email, registrationDate, validTill, refNo, isActive, upiId, batchId) VALUES (?, ?, ?, ?, ?, ?, ?)";
        mysqlConnection.query(
          insertUserPlanQuery,
          [email, curDate, validTill, refNo, true, upiId, batchId],
          function (error, results, fields) {
            if (error) {
              return res.status(500).json({ error: "Internal Server Error" });
            }

            const insertedUserPlanId = results.insertId;
            const getUserQuery = "SELECT * FROM userPlans WHERE id = ?";
            mysqlConnection.query(
              getUserQuery,
              [insertedUserPlanId],
              function (error, userResults, userFields) {
                if (error) {
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                const insertedUser = userResults[0];

                res.status(200).json({ message: "ok", user: insertedUser });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }finally{
    mysqlConnection.connect();
  }
});

app.post("/getUserPlan", async (req, res) => {
  try {
    const { email } = req.body;

    // Query to get user plan details based on email
    const getUserPlanQuery = "SELECT * FROM userPlans WHERE email = ?";
    mysqlConnection.query(
      getUserPlanQuery,
      [email],
      function (error, results, fields) {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Subscribe Your Plan" });
        }

        const userPlan = results[0];

        res.status(200).json({ message: "ok", userPlan });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }finally{
    mysqlConnection.connect();
  }
});

app.post('/checkAndDeleteUserPlan', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Query to get user plan details based on email
      const getUserPlanQuery = 'SELECT * FROM userPlans WHERE email = ?';
      mysqlConnection.query(getUserPlanQuery, [email], async function (error, results, fields) {
        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
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
          // Query to delete user plan based on email
          const deleteUserPlanQuery = 'DELETE FROM user_plans WHERE email = ?';
          mysqlConnection.query(deleteUserPlanQuery, [email], function (deleteError, deleteResults, deleteFields) {
            if (deleteError) {
              return res.status(500).json({ error: 'Internal Server Error' });
            }
  
            res.status(200).json({ message: 'ok' });
          });
        } else {
          res.status(200).json({ message: 'UserPlan is still valid' });
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }finally{
        mysqlConnection.connect();
      }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
