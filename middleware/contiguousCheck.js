const contiguousCheck = (req, res, next) => {
  try {
    // list of contiguous states
    const contiguousStates = [
      "WA",
      "OR",
      "CA",
      "NV",
      "AZ",
      "UT",
      "ID",
      "MT",
      "WY",
      "CO",
      "NM",
      "ND",
      "SD",
      "NE",
      "KS",
      "OK",
      "TX",
      "MN",
      "IA",
      "MO",
      "AR",
      "LA",
      "WI",
      "IL",
      "MS",
      "MI",
      "IN",
      "KY",
      "TN",
      "AL",
      "OH",
      "WV",
      "VA",
      "NC",
      "SC",
      "GA",
      "FL",
      "ME",
      "NH",
      "VT",
      "MA",
      "RI",
      "CT",
      "NY",
      "PA",
      "NJ",
      "DE",
      "MD",
    ];

    let filteredStates = [];

    // if the query parameter true
    if (req.query.contig === "true") {
      // Filter only contiguous states
      filteredStates = contiguousStates;
      // if the query parameter false
    } else if (req.query.contig === "false") {
      filteredStates = ["HI", "AK"];
      // if the query parameter not provided
    } else {
      filteredStates = contiguousStates.concat(["HI", "AK"]);
    }

    req.filteredStates = filteredStates;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = contiguousCheck;
