var BLUE_CANVAS_SETUP = {
    connectorUrl: "https://harvard.bluera.com/harvardBlueConnector/",
    canvasAPI: "https://canvas.harvard.edu",
    domainName: "com.explorance",
    consumerID: "uneAb3wY2QaWRG4D4S117w==",
    defaultLanguage: "en-us"
  },
  BlueCanvasJS = document.createElement("script");
BlueCanvasJS.setAttribute("type", "text/javascript");
BlueCanvasJS.setAttribute("src", "https://harvard.bluera.com/harvardBlueConnector//Scripts/Canvas/BlueCanvas.min.js?" + (new Date).getTime());
document.getElementsByTagName("head")[0].appendChild(BlueCanvasJS);
