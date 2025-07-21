import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import trendlinePlugin from 'chartjs-plugin-trendline';


Chart.register(trendlinePlugin);

const translations = {
  fr: {
    chartTitle: "Écarts annuels de température (1948–2023)",
    datasetLabel: "Écart de température (°C)"
  },
  en: {
    chartTitle: "Annual Temperature Deviations (1948–2023)",
    datasetLabel: "Temperature Deviation (°C)"
  }
};

function Dashboard({ lang }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [unit, setUnit] = useState('C');
  const [activeTab, setActiveTab] = useState('graph');


  const data = [
    { year: 1948, value: -0.2 }, { year: 1949, value: -0.2 }, { year: 1950, value: -1.2 },
    { year: 1951, value: -0.6 }, { year: 1952, value: 0.8 }, { year: 1953, value: 0.8 },
    { year: 1954, value: 0.0 }, { year: 1955, value: -0.2 }, { year: 1956, value: -0.8 },
    { year: 1957, value: -0.3 }, { year: 1958, value: 0.5 }, { year: 1959, value: -0.4 },
    { year: 1960, value: 0.4 }, { year: 1961, value: -0.2 }, { year: 1962, value: 0.0 },
    { year: 1963, value: 0.2 }, { year: 1964, value: -0.6 }, { year: 1965, value: -0.6 },
    { year: 1966, value: -0.3 }, { year: 1967, value: -0.4 }, { year: 1968, value: 0.2 },
    { year: 1969, value: 0.4 }, { year: 1970, value: -0.2 }, { year: 1971, value: 0.0 },
    { year: 1972, value: -2.0 }, { year: 1973, value: 0.6 }, { year: 1974, value: -0.8 },
    { year: 1975, value: -0.1 }, { year: 1976, value: 0.0 }, { year: 1977, value: 1.0 },
    { year: 1978, value: -0.5 }, { year: 1979, value: -0.2 }, { year: 1980, value: 0.4 },
    { year: 1981, value: 2.0 }, { year: 1982, value: -1.0 }, { year: 1983, value: 0.1 },
    { year: 1984, value: 0.2 }, { year: 1985, value: 0.0 }, { year: 1986, value: 0.0 },
    { year: 1987, value: 1.5 }, { year: 1988, value: 0.8 }, { year: 1989, value: -0.2 },
    { year: 1990, value: -0.1 }, { year: 1991, value: 0.4 }, { year: 1992, value: -0.1 },
    { year: 1993, value: 0.4 }, { year: 1994, value: 0.5 }, { year: 1995, value: 0.5 },
    { year: 1996, value: -0.1 }, { year: 1997, value: 0.6 }, { year: 1998, value: 2.3 },
    { year: 1999, value: 1.7 }, { year: 2000, value: 0.8 }, { year: 2001, value: 1.8 },
    { year: 2002, value: 0.5 }, { year: 2003, value: 1.0 }, { year: 2004, value: 0.0 },
    { year: 2005, value: 1.6 }, { year: 2006, value: 2.4 }, { year: 2007, value: 0.8 },
    { year: 2008, value: 0.6 }, { year: 2009, value: 0.7 }, { year: 2010, value: 3.0 },
    { year: 2011, value: 1.3 }, { year: 2012, value: 1.8 }, { year: 2013, value: 0.7 },
    { year: 2014, value: 0.6 }, { year: 2015, value: 1.3 }, { year: 2016, value: 2.1 },
    { year: 2017, value: 1.5 }, { year: 2018, value: 0.6 }, { year: 2019, value: 1.1 },
    { year: 2020, value: 1.2 }, { year: 2021, value: 2.1 }, { year: 2022, value: 1.2 },
    { year: 2023, value: 2.8 }
  ];

  const labels = data.map(d => d.year);
  
  const convertToFahrenheit = celsius => (celsius * 9/5) + 32;
  
  const values = data.map(d => unit === 'C' ? d.value : convertToFahrenheit(d.value));
  

const datasetPoints = data.map(d => {
  const y = unit === 'C' ? d.value : convertToFahrenheit(d.value);
  const color = d.value >= 0 ? '#d32f2f' : '#388e3c';
  return { x: d.year, y, color };
});

  function getDecadeAverages(data, unit) {
  const decadeGroups = {};

  data.forEach(d => {
    const decade = Math.floor(d.year / 10) * 10;
    const y = unit === 'C' ? d.value : convertToFahrenheit(d.value);

    if (!decadeGroups[decade]) {
      decadeGroups[decade] = { total: 0, count: 0 };
    }

    decadeGroups[decade].total += y;
    decadeGroups[decade].count += 1;
  });

  return Object.keys(decadeGroups).sort().map(decade => ({
    decade: decade,
    average: (decadeGroups[decade].total / decadeGroups[decade].count).toFixed(2)
  }));
}

useEffect(() => {
  const ctx = chartRef.current.getContext('2d');
  if (chartInstance.current) {
    chartInstance.current.destroy();
  }

  chartInstance.current = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels,
        datasets: [{
      label: translations[lang].datasetLabel,
      data: datasetPoints.map(p => ({ x: p.x, y: p.y })),
      pointBackgroundColor: datasetPoints.map(p => p.color),
      parsing: false,
      trendlineLinear: {
        style: "rgba(33, 150, 243, 0.7)",
        lineStyle: "solid",
        width: 3
      },
      showLine: false
    }]
     
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#d32f2f' }
        },
        title: {
          display: true,
          text: translations[lang].chartTitle
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const year = context.raw.x;
              const value = context.raw.y.toFixed(2);
              const suffix = unit === 'C' ? '°C' : '°F';
              return `${year} : ${value} ${suffix}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: lang === "fr" ? "Année" : "Year"
          }
        },
        y: {
          title: {
            display: true,
            text: lang === "fr"
              ? (unit === 'C' ? "Écart (°C)" : "Écart (°F)")
              : (unit === 'C' ? "Deviation (°C)" : "Deviation (°F)")
          }
        }
      }
    }
  });
}, [lang, unit]);

  useEffect(() => {
  const canvas = document.getElementById('decadeChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const chartExists = Chart.getChart(canvas);
  if (chartExists) chartExists.destroy();

  const averages = getDecadeAverages(data, unit);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: averages.map(d => `${d.decade}s`),
      datasets: [{
        label: lang === 'fr' ? 'Moyenne par décennie' : 'Average per Decade',
        data: averages.map(d => d.average),
        backgroundColor: '#d32f2f'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: lang === 'fr'
            ? 'Évolution des moyennes par décennie'
            : 'Decade-Averaged Temperature Deviations'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: lang === 'fr' ? 'Décennie' : 'Decade'
          }
        },
        y: {
          title: {
            display: true,
            text: unit === 'C'
              ? (lang === 'fr' ? 'Écart (°C)' : 'Deviation (°C)')
              : (lang === 'fr' ? 'Écart (°F)' : 'Deviation (°F)')
          }
        }
      }
    }
  });
}, [unit, lang]);

  return (
    
    <div className="dashboard">
      <div style={{
  maxWidth: '800px',
  margin: '40px auto',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  fontSize: '16px',
  lineHeight: '1.6'
}}>
 <h2 style={{ marginTop: 0 }}>
  {lang === 'fr' ? 'Tableau de bord climatique du Canada' : 'Canada Climate Dashboard'}
</h2>

<p>
  {lang === 'fr' ? (
    <>
      Les données en Celsius proviennent de{' '}
      <a
        href="https://www.canada.ca/fr/environnement-changement-climatique/services/indicateurs-environnementaux/changements-temperature.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Environnement et Changement climatique Canada
      </a>. Les données en Fahrenheit ont été généré à l'aide de l'IA et peuvent contenir des erreurs.
    </>
  ) : (
    <>
      The data in Celsius comes from{' '}
      <a
        href="https://www.canada.ca/en/environment-climate-change/services/environmental-indicators/temperature-change.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Environment and Climate Change Canada
      </a>. The data in Fahrenheit was generated with the help of AI and may contain mistakes.
    </>
  )}
</p>
</div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <button onClick={() => setUnit(unit === 'C' ? 'F' : 'C')} style={{
      backgroundColor: '#d32f2f',
      color: 'white',
      border: 'none',
      padding: '10px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}>
      {lang === 'fr'
        ? (unit === 'C' ? 'Afficher en Fahrenheit (°F)' : 'Afficher en Celsius (°C)')
        : (unit === 'C' ? 'Show in Fahrenheit (°F)' : 'Show in Celsius (°C)')}
      
    </button>
  </div>
      <canvas ref={chartRef}></canvas>
      <div style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'left' }}>
  <h4>{lang === 'fr' ? 'Légende' : 'Legend'}</h4>
  <ul style={{ listStyle: 'none', padding: 0 }}>
    <li><span style={{ display: 'inline-block', width: 20, height: 20, backgroundColor: '#d32f2f', marginRight: 10 }}></span>
      {lang === 'fr' ? 'Année plus chaude que la valeur de référence' : 'Year warmer than reference'}
    </li>
    <li><span style={{ display: 'inline-block', width: 20, height: 20, backgroundColor: '#388e3c', marginRight: 10 }}></span>
      {lang === 'fr' ? 'Année plus froide que la valeur de référence' : 'Year colder than reference'}
    </li>
    <li><span style={{ display: 'inline-block', width: 20, height: 3, backgroundColor: 'rgba(33, 150, 243, 0.7)', marginRight: 10, verticalAlign: 'middle' }}></span>
      {lang === 'fr' ? 'Ligne de tendance linéaire' : 'Linear trend line'}
    </li>
  </ul>
</div>
      <canvas id="decadeChart" style={{ marginTop: '60px' }}></canvas>
    </div>
    
  );
}

export default Dashboard;