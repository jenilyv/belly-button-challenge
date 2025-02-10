// Load and initialize dashboard
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let sampleNames = data.names;

      // Select dropdown menu and add sample options
      let dropdown = d3.select("#selDataset");
      sampleNames.forEach((id) => {
          dropdown.append("option").text(id).property("value", id);
      });

      // Load first sample
      let firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);
  });
}

// Update dashboard when a new sample is selected
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let metadata = data.metadata;
      let filteredMetadata = metadata.find(obj => obj.id == sample);

      // Select metadata panel and clear existing content
      let metadataPanel = d3.select("#sample-metadata");
      metadataPanel.html("");

      // Append key-value pairs
      Object.entries(filteredMetadata).forEach(([key, value]) => {
          metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  });
}

// Build the bar and bubble charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let samples = data.samples;
      let filteredSample = samples.find(obj => obj.id === sample);

      let otu_ids = filteredSample.otu_ids;
      let otu_labels = filteredSample.otu_labels;
      let sample_values = filteredSample.sample_values;

      // ✅ Bar Chart (Top 10 OTUs)
      let barTrace = {
          x: sample_values.slice(0, 10).reverse(),
          y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h"
      };

      let barLayout = {
          title: "Top 10 OTUs Found",
          margin: { t: 30, l: 150 }
      };

      Plotly.newPlot("bar", [barTrace], barLayout);

      // ✅ Bubble Chart
      let bubbleTrace = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          }
      };

      let bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          xaxis: { title: "OTU ID" },
          yaxis: { title: "Sample Values" },
          margin: { t: 30 }
      };

      Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  });
}

// Initialize dashboard
init();
