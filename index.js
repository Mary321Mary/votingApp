/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
import "./src/i18n";
import { decode as atob, encode as btoa } from "base-64";

if (!global.atob) global.atob = atob;
if (!global.btoa) global.btoa = btoa;

AppRegistry.registerComponent(appName, () => App);
