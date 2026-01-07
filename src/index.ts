import express from "express";
const app = express();

const formatRedirectUrl = (redirectUrl, isPaymentSuccess, isPaymentRecordSuccess) => {
  const errorMessageCode = !isPaymentSuccess
    ? 'sol.error.paymentFailed'
    : !isPaymentRecordSuccess
    ? 'sol.error.paymentRecordFailed'
    : '';

  const query = `?payment=${isPaymentSuccess}&record=${isPaymentRecordSuccess}&error=${errorMessageCode}`;

  return `${redirectUrl}${query}`;
};

app.get("/payment", async (req, res) => {
      const redirectUrl = req.query.redirectUrl;
    try {
        // add a delay of 10 seconds to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 5000));
        // based on math.random(), decide if the payment is successful or not
        const isPaymentSuccess = Math.random() < 0.5;
        const isPaymentRecordSuccess = Math.random() < 0.5;
        return res.redirect(formatRedirectUrl(redirectUrl, isPaymentSuccess, isPaymentRecordSuccess));        
      
    } catch (e) {
      return res.redirect(formatRedirectUrl(redirectUrl, true, false));
    }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
