/* eslint-disable */
//@ts-nocheck

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('chart-market-segments');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'pie',
    data: {
      labels: [
        'Development\nTools',
        'Customer Relationship\nManagement',
        'Enterprise Resource\nPlanning',
        'Supply Chain\nManagement',
        'Business Intelligence',
        'Content Management',
        'Other',
      ],
      datasets: [
        {
          data: [4.5, 70.9, 45.9, 18.0, 24.0, 19.4, 34.5],
          backgroundColor: [
            COLORS.primary,
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
      aspectRatio: 2,
      cutout: '60%',
      rotation: -2.5,
      borderColor: COLORS.graylight,
      borderWidth: 4,
      plugins: {
        datalabels: {
          labels: {
            value: {
              color: COLORS.foreground,
              backgroundColor: COLORS.background,
              borderRadius: 4,
              font: { size: '12px' },
              anchor: 'center',
              align: 'bottom',
              formatter: (value, context) => {
                // Retrieve percentage
                let total = 0;
                context.chart.data.datasets[0].data.forEach((data) => {
                  total += data;
                });
                const percentage = `${((100 * value) / total).toFixed(0)}%`;
                // Retrieve amount
                const amount = `$${value.toFixed(0)}bn`;
                return `${amount} / ${percentage}`;
              },
            },
            name: {
              color: COLORS.background,
              backgroundColor: COLORS.foreground,
              borderRadius: 4,
              font: { size: '16px', weight: 'bold' },
              anchor: 'center',
              align: 'top',
              textAlign: 'center',
              formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            },
          },
        },
        legend: { display: false },
      },
    },
  });
});
