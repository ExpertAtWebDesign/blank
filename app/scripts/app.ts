// Imports

import { sayHello } from "./greeter";
import * as $ from 'jquery';

// Functions

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript!");
