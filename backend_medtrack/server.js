require('dotenv').config();
const app = require('./app');

app.use("/",(req,res,next)=>{
  res.send("Home page")
})
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});