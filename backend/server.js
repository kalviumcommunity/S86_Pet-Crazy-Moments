const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/userRouter'); // ✅ Fixed import

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // ✅ Important for JSON request bodies

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // ✅ Fixed env var name
  .then(() => console.log('MongoDB is connected'))
  .catch((err) => console.error("MongoDB connection failed", err));

app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
