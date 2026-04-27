const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const contactsRouter = require("./routes/contacts");
const callsRouter = require("./routes/calls");
const webhookRouter = require("./routes/webhook");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/contacts", contactsRouter);
app.use("/api/calls", callsRouter);
app.use("/api/webhook", webhookRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
