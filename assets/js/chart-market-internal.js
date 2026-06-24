/* eslint-disable */
//@ts-nocheck

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('chart-market-internal');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'bubble',
    data: {
      labels: ['Airtable', 'Retool', 'Superblocks', 'Unqork', 'Webflow', 'Zapier'],
      datasets: [
        {
          data: [
            { x: 120, y: 80, z: 11.7 },
            { x: 30, y: 200, z: 3.2 },
            { x: 5, y: 80, z: 3.2 },
            { x: 80, y: 270, z: 2 },
            { x: 100, y: 150, z: 4 },
            { x: 130, y: 50, z: 5 },
          ],
          radius: (context) => {
            var value = context.dataset.data[context.dataIndex];
            return Math.abs(value.z) * document.getElementById('slides').clientWidth * (window.devicePixelRatio / 150);
          },
          backgroundColor: [
            COLORS.gradient1,
            COLORS.gradient2,
            COLORS.gradient3,
            COLORS.gradient4,
            COLORS.gradient5,
            COLORS.gradient6,
          ],
        },
      ],
    },
    options: {
      layout: { autoPadding: false },
      plugins: {
        datalabels: {
          labels: {
            value: {
              font: { size: '12px' },
              anchor: (context) => {
                const value = context.dataset.data[context.dataIndex];
                return value.z < 3 ? 'start' : 'center';
              },
              align: (context) => {
                const value = context.dataset.data[context.dataIndex];
                return value.z < 3 ? 'start' : 'center';
              },
              color: (context) => {
                const value = context.dataset.data[context.dataIndex];
                return value.z < 3 ? COLORS.graydark : COLORS.graylight;
              },
              formatter: (value, _) => `$${value.z.toFixed(0)}bn`,
            },
            name: {
              color: COLORS.background,
              backgroundColor: COLORS.foreground,
              borderRadius: 4,
              font: { size: '16px', weight: 'bold' },
              anchor: 'end',
              align: 'end',
              offset: 10,
              formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            },
          },
        },
        legend: { display: false },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Revenue 2021 ($m)',
            font: { size: '18px' },
            color: COLORS.background,
            padding: 10,
          },
          beginAtZero: true,
          max: 200,
        },
        y: {
          title: {
            display: true,
            text: 'Revenue growth 2021 (%)',
            font: { size: '18px' },
            color: COLORS.background,
            padding: 10,
          },
          beginAtZero: true,
          max: 300,
        },
      },
    },
  });
});
