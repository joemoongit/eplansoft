const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let bool = false;
let coordinates = [];

canvas.addEventListener('click', (event) => {
  if (!bool) {
    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = "red";
    coordinates.push(event.pageX, event.pageY);
    bool = !bool;
  } else {
    ctx.rect(coordinates[0], coordinates[1], event.pageX - coordinates[0], event.pageY - coordinates[1]);
    ctx.stroke();
    coordinates.splice(0, coordinates.length);
    bool = !bool;
  }
});

var url = './sample.pdf';
var pdfjsLib = window['pdfjs-dist/build/pdf'];

var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');

  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});
