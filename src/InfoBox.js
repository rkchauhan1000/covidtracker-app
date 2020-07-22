import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
export default function InfoBox({
  title,
  cases,
  isRed,
  active,
  total,
  ...props
}) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography className="infoBox_title" color="textSecondary">
          {title}
        </Typography>
        <h3 className={`infoBox_cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h3>
        <Typography className="infoBox_total" color="textSecondary">
          Total :{total}
        </Typography>
      </CardContent>
    </Card>
  );
}
