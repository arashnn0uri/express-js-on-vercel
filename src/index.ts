import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));

const formatRedirectUrl = (redirectUrl, isPaymentSuccess, isPaymentRecordSuccess) => {
  const errorMessageCode = !isPaymentSuccess
    ? "sol.error.paymentFailed"
    : !isPaymentRecordSuccess
    ? "sol.error.paymentRecordFailed"
    : "";

  const query = `?payment=${isPaymentSuccess}&record=${isPaymentRecordSuccess}&error=${errorMessageCode}`;
  return `${redirectUrl}${query}`;
};

// 1️⃣ Show index page with buttons
app.get("/payment", (req, res) => {
  const redirectUrl = req.query.redirectUrl;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Result</title>
      </head>
      <body>
        <h2>Select payment outcome</h2>

        <form method="POST" action="/payment/decision">
          <input type="hidden" name="redirectUrl" value="${redirectUrl}" />

          <button type="submit" name="result" value="success">
            Success
          </button>

          <button type="submit" name="result" value="fail">
            Fail
          </button>
        </form>
      </body>
    </html>
  `);
});

// 2️⃣ Handle user choice and redirect
app.post("/payment/decision", async (req, res) => {
  const { redirectUrl, result } = req.body;

  // simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 5000));

  if (result === "success") {
    return res.redirect(formatRedirectUrl(redirectUrl, true, true));
  }

  return res.redirect(formatRedirectUrl(redirectUrl, false, false));
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
