/* eslint-disable */
//@ts-nocheck

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('chart-market-revenue');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'bar',
    data: {
      labels: ['2021', '2022', '2023', '...', '2030'],
      datasets: [
        {
          // Line chart dataset
          type: 'line',
          data: [194.3, 216.7, 238.9, 350.2, 517.3],
          borderColor: COLORS.background,
          borderWidth: 5,
          fill: false,
          tension: 0.4,
          datalabels: { display: false },
          pointStyle: false,
          borderCapStyle: 'round',
        },
        {
          // Bar chart
          data: [194.3, 216.7, 238.9, 0, 517.3],
          backgroundColor: [
            hexToRgba(COLORS.primary, 0.7),
            hexToRgba(COLORS.primary, 0.7),
            hexToRgba(COLORS.primary, 0.7),
            hexToRgba(COLORS.black, 0.7),
            hexToRgba(COLORS.gradient4, 0.7),
          ],
          borderColor: [COLORS.primary, COLORS.primary, COLORS.primary, COLORS.black, COLORS.gradient4],
          borderWidth: 1,
        },
      ],
    },
    options: {
      layout: { autoPadding: false },
      plugins: {
        datalabels: {
          color: COLORS.foreground,
          backgroundColor: COLORS.background,
          borderRadius: 4,
          font: { size: '16px' },
          anchor: 'end',
          align: 'end',
          offset: 10,
        },
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { display: false },
          title: {
            display: true,
            text: 'Market total revenue ($bn)',
            font: { size: '18px' },
            color: COLORS.background,
            padding: 10,
          },
          beginAtZero: false,
          min: 100,
          max: 600,
        },
      },
    },
  });
});
