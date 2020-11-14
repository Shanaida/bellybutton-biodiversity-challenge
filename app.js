function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
      var metadata = data.metadata;

      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
     
      var metapanel = d3.select("#sample-metadata");
  
      // Use .html("") to clear any existing metadata
      metapanel.html("");

      Object.entries(result).forEach(([key, value]) => {
        metapanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  function drawchart(sample) {
    d3.json("data/samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Build Bubble Chart
      var bubblelayout = {
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbledata = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbledata, bubblelayout);
  
      // Build Bar Chart
      var tickers = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var bardata = [
        {
          y: tickers,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barlayout = {
        title: "Top 10 10 OTUs Found in Specific Individual",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", bardata, barlayout);
    });
  }
  
  function init() {
    // Dropdown values for selecting names
    var selection = d3.select("#selDataset");
  
    d3.json("data/samples.json").then((data) => {
      var names = data.names;
  
      names.forEach((sample) => {
        selection
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Begin ploting
      var sampleone = names[0];
      drawchart(sampleone);
      buildMetadata(sampleone);
    });
  }
  
  function optionChanged(samplenew) {
    // Fetch new data each time a new sample is selected
    drawchart(samplenew);
    buildMetadata(samplenew);
  }
  
  // Initialize the dashboard
  init();