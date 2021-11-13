const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let coordinates = [];

const mouseMoveFunction = (event) => {
  const { pageX, pageY } = event;
  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.strokeStyle = "red";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(coordinates[0], coordinates[1], pageX - coordinates[0], pageY - coordinates[1]);
};

canvas.addEventListener('mousedown', (event) => {
  const { pageX, pageY } = event;
  canvas.addEventListener('mousemove', mouseMoveFunction);
  coordinates.push(pageX, pageY);
});

canvas.addEventListener('mouseup', (event) => {
  const { pageX, pageY } = event;
  canvas.removeEventListener('mousemove', mouseMoveFunction);
  coordinates.splice(0, coordinates.length);
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

    var canvaspdf = document.getElementById('pdf');
    var context = canvaspdf.getContext('2d');
    canvaspdf.height = viewport.height;
    canvaspdf.width = viewport.width;
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
