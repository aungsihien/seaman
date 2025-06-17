const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const paymentRouter = require('./routes/payment');

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to convert numbers to Myanmar numerals and format as currency
const myanmarNumbers = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
app.locals.toMyanmarNumber = function(numStr) {
    return numStr.toString().split('').map(char => {
        if (char === ',') return ',';
        const digit = parseInt(char);
        return !isNaN(digit) ? myanmarNumbers[digit] : char;
    }).join('');
};

app.locals.formatCurrency = function(num) {
    const formattedNum = num.toLocaleString();
    return app.locals.toMyanmarNumber(formattedNum) + ' ကျပ်';
};

// Body parser middleware (Express built-in)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/', indexRouter);
app.use('/payment', paymentRouter);

// Catch 404 and forward to error handler (basic)
app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found.');
});

// Error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
