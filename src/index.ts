import express from "express";
const app = express();

app.get("/payment-success", (req, res) => {
  const redirectUrl = req.query.redirectUrl || "sinergassolapp://payment";
  res.redirect(redirectUrl as string); // sends HTTP 302 to your app deep link
});

app.get("/payment-failed", (req, res) => {
  const redirectUrl = req.query.redirectUrl || "sinergassolapp://payment";
  res.redirect(redirectUrl as string);
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
