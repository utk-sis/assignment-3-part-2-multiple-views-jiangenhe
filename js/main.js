
// Global objects
let data, scatterplot, barchart;

// Initialize dispatcher
const dispatcher = d3.dispatch('filterRegions');

/**
 * Load data from CSV file asynchronously and render charts
 */
d3.csv('africa_country_profile_variables.csv')
  .then(_data => {
    data = _data;
    data.forEach(d => {
      d.population = +d.population;
      d.density = +d.density;
      d.area = +d.area;
      d.GDP = +d.GDP;
    });

    // Initialize scales
    const colorScale = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
      .domain(d3.groups(data, d => d.Region).map(d => d[0]));

    scatterplot = new Scatterplot({
      parentElement: '#scatterplot',
      colorScale: colorScale
    }, data);
    scatterplot.updateVis();

    barchart = new Barchart({
      parentElement: '#barchart',
      colorScale: colorScale
    }, dispatcher, data);
    barchart.updateVis();
  })
  .catch(error => console.error(error));


/**
 * Dispatcher waits for 'filterCategory' event
 * We filter data based on the selected categories and update the scatterplot
 */
dispatcher.on('filterRegions', selectedRegions => {
  console.log(selectedRegions)
  if (selectedRegions.length == 0) {
    scatterplot.data = data;
  } else {
    scatterplot.data = data.filter(d => selectedRegions.includes(d.Region));
  }
  scatterplot.updateVis();
});
