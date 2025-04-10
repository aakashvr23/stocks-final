const API_KEY = "9df96cb4d6fb414eb59a380c372f1aac";

function toggleCalculator() {
  const calculator = document.getElementById('mfCalculator');
  calculator.classList.toggle('hidden');
}

function calculateMaturity() {
  const P = parseFloat(document.getElementById('investment').value);
  const r = parseFloat(document.getElementById('rate').value) / 100;
  const t = parseFloat(document.getElementById('years').value);

  if (isNaN(P) || isNaN(r) || isNaN(t)) {
    document.getElementById('result').innerText = "Please fill in all fields.";
    return;
  }

  const A = P * Math.pow(1 + r, t);
  document.getElementById('result').innerText = `Estimated Maturity Amount: ₹${A.toFixed(2)}`;
}

async function searchStock() {
  const symbol = document.getElementById('stockSymbol').value.toUpperCase();
  if (!symbol) return;

  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || data.status === "error") {
      alert("Invalid symbol or API error.");
      return;
    }

    const labels = data.values.map(entry => entry.datetime).reverse();
    const prices = data.values.map(entry => parseFloat(entry.close)).reverse();

    const ctx = document.getElementById('stockGraph');
    ctx.innerHTML = `<canvas id="myChart"></canvas>`;

    new Chart(document.getElementById('myChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${symbol} Closing Price`,
          data: prices,
          fill: false,
          borderColor: 'rgb(255, 193, 7)',
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  } catch (error) {
    console.error("API fetch error:", error);
    alert("Something went wrong. Please try again.");
  }
}
