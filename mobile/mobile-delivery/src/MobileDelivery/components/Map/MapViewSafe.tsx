import { Platform } from "react-native";

let MapView: any;
let Marker: any;

if (Platform.OS === "web") {
  MapView = require("./MapView.web").default;
  Marker = () => null; // web no usa Marker nativo
} else {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export { MapView, Marker };
