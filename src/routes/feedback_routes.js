import express from "express";
const router = express.Router();

router.post('/submit', function (req, res) {
  res.send({
    message: "submit, API is Under Dev."
  })
});

router.get("/feedbacks", function (req, res) {
  res.send({
    message: "submit, API is Under Dev."
  })
});

export default router;