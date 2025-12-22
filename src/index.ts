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

app.get("/payment-success", (req, res) => {
      console.log("PagoPA TEST SUCCESS CALLBACK INVOKED");
      const redirectUrl = req.query.redirectUrl;
      console.log("Request Query:", req.query);
      console.log("Redirect URL:", redirectUrl);
    try {
      console.log(formatRedirectUrl(redirectUrl, true, true))
        return res.redirect(formatRedirectUrl(redirectUrl, true, true));
      
    } catch (e) {
      return res.redirect(formatRedirectUrl(redirectUrl, true, false));
    }
});

app.get("/payment-failed", (req, res) => {
      console.log("PagoPA TEST FAILED CALLBACK INVOKED");
      const redirectUrl = req.query.redirectUrl;
      console.log("Request Query:", req.query);
      console.log("Redirect URL:", redirectUrl);
    try {
      console.log(formatRedirectUrl(redirectUrl, false, true))
        return res.redirect(formatRedirectUrl(redirectUrl, false, true));
      
    } catch (e) {
      return res.redirect(formatRedirectUrl(redirectUrl, false, false));
    }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
