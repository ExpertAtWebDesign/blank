// Imports

import * as $ from 'jquery';
import { sayHello } from "./greeter";

// Functions

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript!");
