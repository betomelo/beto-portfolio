
// A STUDY IN FRAMES
// D3.js visualization of the photography archive

// Replace these counts with your actual photo counts.

const photoData = [
  { category: "Editorial", count: 41},
  { category: "Portraiture", count: 22 },
  { category: "Fashion", count: 34 },
  { category: "Experimental", count: 18 }
];

const width = 900;
const height = 380;

const margin = {
  top: 30,
  right: 30,
  bottom: 65,
  left: 50
};

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = d3.select("#photo-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("width", "100%")
  .style("height", "auto");

const chart = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand()
  .domain(photoData.map(d => d.category))
  .range([0, innerWidth])
  .padding(0.3);

const y = d3.scaleLinear()
  .domain([0, d3.max(photoData, d => d.count)])
  .nice()
  .range([innerHeight, 0]);

chart.append("g")
  .attr("transform", `translate(0,${innerHeight})`)
  .call(d3.axisBottom(x));

chart.append("g")
  .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

chart.selectAll(".photo-bar")
  .data(photoData)
  .join("rect")
  .attr("class", "photo-bar")
  .attr("x", d => x(d.category))
  .attr("y", d => y(d.count))
  .attr("width", x.bandwidth())
  .attr("height", d => innerHeight - y(d.count))
  .attr("fill", "#020887")
  .attr("tabindex", 0)
  .attr("aria-label", d => `${d.category}: ${d.count} photographs`)
  .on("mouseenter focus", function(event, d) {
    d3.select(this).attr("fill", "#FF6B35");

    d3.select("#photo-chart-detail")
      .text(`${d.category.toUpperCase()} / ${d.count} photographs`);
  })
  .on("mouseleave blur", function() {
    d3.select(this).attr("fill", "#020887");

    d3.select("#photo-chart-detail")
      .text("Hover over a bar to explore the archive.");
  });

