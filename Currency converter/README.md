# 💱 Currency Converter

A simple, responsive, and dynamic web-based **Currency Converter** that allows users to instantly convert amounts between different global currencies. This project fetches real-time exchange rates from a live API and displays corresponding country flags dynamically based on the selected currencies.

---

## ✨ Features

- **Live Exchange Rates**: Fetches real-time exchange rates dynamically using the [Currency API](https://github.com/vcapis/currency-api).
- **Dynamic Flag Display**: Automatically updates and displays country flags using [Flags API](https://flagsapi.com/) as the user switches currencies.
- **Comprehensive Currency Support**: Supports over 150+ global currencies mapped via a robust country-code dataset (`c_codes.js`).
- **Input Validation**: Automatically validates inputs to prevent empty or negative values, defaulting gracefully to `1`.
- **Clean UI**: Built with a clean, responsive layout utilizing modern CSS styling.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome v4.7
- **APIs**:
  - Exchange Rates: [Currency API](https://latest.currency-api.pages.dev/)
  - Country Flags: [Flags API](https://flagsapi.com/)

---

## 📂 Project Structure

```
├── index.html       # Structure of the web application
├── Style.css        # Custom styles and layouts
├── Script.js        # Core currency conversion logic & API interaction
└── c_codes.js       # Mapping database of currency codes to country codes
```

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd "Currency converter"
   ```
3. **Open the App**:
   Simply open `index.html` in any modern web browser.

---

## ⚙️ How It Works

1. **Populating Dropdowns**: The dropdown selections are populated dynamically from `c_codes.js` during page load.
2. **Flag Updates**: An event listener on the select element calls `updateFlag()`, which maps the currency code to its country code and fetches the flag image.
3. **Fetching Conversion**: On clicking **Get Exchange Rate**, the application issues a `fetch` request to the Currency API endpoint using the code of the source currency, parses the JSON payload, multiplies the rate by the input amount, and prints the result inside the `#msg` placeholder.
