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

app.get("/payment", (req, res) => {
  const redirectUrl = req.query.redirectUrl;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Result</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
          }
          h2 {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            text-align: center;
          }
          form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 80%;
            max-width: 300px;
          }
          button {
            padding: 1rem;
            font-size: 1.2rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          button[name="result"][value="success"] {
            background-color: #4CAF50;
            color: white;
          }
          button[name="result"][value="success"]:hover {
            background-color: #45a049;
          }
          button[name="result"][value="fail"] {
            background-color: #f44336;
            color: white;
          }
          button[name="result"][value="fail"]:hover {
            background-color: #da190b;
          }

          /* Loading overlay */
          #loadingOverlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            color: white;
            font-size: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          @media (max-width: 600px) {
            h2 {
              font-size: 2rem;
            }
            button {
              font-size: 1.5rem;
              padding: 1.5rem;
            }
            #loadingOverlay {
              font-size: 2rem;
            }
          }
        </style>
      </head>
      <body>
        <h2>Select payment outcome</h2>
        <form id="paymentForm" method="POST" action="/payment/decision">
          <input type="hidden" name="redirectUrl" value="${redirectUrl}" />
          <button type="submit" name="result" value="success">Success</button>
          <button type="submit" name="result" value="fail">Fail</button>
        </form>

        <div id="loadingOverlay">Processing payment...</div>

        <script>
          const form = document.getElementById('paymentForm');
          const overlay = document.getElementById('loadingOverlay');

          form.addEventListener('submit', () => {
            overlay.style.display = 'flex';
          });
        </script>
      </body>
    </html>
  `);
});


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
