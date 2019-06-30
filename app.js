const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!!');
})
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server Started. App Running on port ${PORT}`));