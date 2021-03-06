import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { useHistory, useLocation } from "react-router-dom";
import { formatNumber } from "../../helpers/number";
import { useState, useRef } from "react";
import { useEffect, useCallback } from "react";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RangeSlider({ max }) {
  const classes = useStyles();
  let query = useQuery();
  let history = useHistory();

  const firstRange = useRef([+query.get("from") ?? 0, +query.get("to") ?? max]);

  const [range, setRange] = useState([0, max]);

  // const queryFrom = query.get("from");
  // const queryTo = query.get("to");

  const handleChange = function (e, newValue) {
    query.set("from", newValue[0]);
    query.set("to", newValue[1]);
    setRange([+newValue[0], +newValue[1]]);
    if (newValue[0] === 0 && newValue[1] === max) {
      query.delete("from");
      query.delete("to");
    }
    history.replace({
      search: query.toString(),
    });
  };
  // let defaultFrom = 0;
  // let defaultTo = max;

  useEffect(() => {
    setRange(firstRange.current);
  }, [firstRange]);

  useEffect(() => {
    if (!query.get("from")) {
      setRange([0, max]);
    }
  }, [query.get("from")]);

  useEffect(() => {
    if (!query.get("from")) setRange([0, max]);
  }, [max]);

  return (
    <div className={classes.root}>
      <Slider
        key={`slider-${max}`}
        max={max}
        marks={[
          { value: 0, label: `0` },
          { value: max / 2, label: `${formatNumber(max / 2)} VND` },
          { value: max, label: `${formatNumber(max)} VND` },
        ]}
        value={range}
        // defaultValue={[defaultFrom, defaultTo]}
        valueLabelDisplay="auto"
        onChangeCommitted={handleChange}
        aria-labelledby="range-slider"
      />
    </div>
  );
}
