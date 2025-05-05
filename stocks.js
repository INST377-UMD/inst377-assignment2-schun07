// stocks.js
const apiKey = "gTfMXXJqmtK9plU0FZnNw0qIy35Z7HLP";
let chart;

// Convert EPOCH to readable date
function formatDate(epochMillis) {
  return new Date(epochMillis).toLocaleDateString();
}

// Fetch stock chart data
async function fetchStockData(ticker = null) {
  const input = document.getElementById("tickerInput");
  const days = document.getElementById("daysSelect").value;
  const symbol = ticker || input.value.trim().toUpperCase();

  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - parseInt(days));
  const fromDate = from.toISOString().split("T")[0];
  const toDate = to.toISOString().split("T")[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results) throw new Error("Invalid ticker");

    const labels = data.results.map(d => formatDate(d.t));
    const prices = data.results.map(d => d.c); // Closing price

    if (chart) chart.destroy();
    chart = new Chart(document.getElementById('stockChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${symbol} Closing Prices`,
          data: prices,
          borderWidth: 2,
          fill: false
        }]
      }
    });
  } catch (err) {
    alert("Error fetching stock data. Please check ticker symbol.");
  }
}

async function fetchRedditStocks() {
  const url = "https://tradestie.com/api/v1/apps/reddit?date=2022-04-03";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const top5 = data.slice(0, 5);
    const table = document.getElementById("redditTable");
    table.innerHTML = "";
    top5.forEach(stock => {
      const tr = document.createElement("tr");
      const link = `https://finance.yahoo.com/quote/${stock.ticker}`;
      tr.innerHTML = `
        <td><a href="${link}" target="_blank">${stock.ticker}</a></td>
        <td>${stock.no_of_comments}</td>
        <td>${stock.sentiment === "Bullish" ? '<img src = "Bullish-market.jpg" style = "width:80px;height:80px;vertical-align:middle;"> 📈 Bullish' : '<img src = "bear-market(html).jpg 📉 Bearish'}</td>
      `;
      table.appendChild(tr);
    });
  } catch {
    document.getElementById("redditTable").innerHTML = "<tr><td colspan='3'>Error loading data</td></tr>";
  }
}

fetchRedditStocks();
if (annyang) {
  annyang.addCommands({
    'lookup *ticker': function(ticker) {
      document.getElementById("tickerInput").value = ticker.toUpperCase();
      fetchStockData(ticker);
    }
  });
}
