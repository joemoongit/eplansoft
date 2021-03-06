const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvaspdf = document.getElementById('pdf');
const context = canvaspdf.getContext('2d');

let coordinates = [];

const mouseMoveFunction = ({ pageX, pageY }) => {
  ctx.lineWidth = "6";
  ctx.strokeStyle = "red";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(coordinates[0], coordinates[1], pageX - coordinates[0], pageY - coordinates[1]);
};

canvas.addEventListener('mousedown', ({ pageX, pageY }) => {
  canvas.addEventListener('mousemove', mouseMoveFunction);
  coordinates.push(pageX, pageY);
});

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', mouseMoveFunction);
  coordinates.splice(0, coordinates.length);
});

const printButton = document.getElementById('print');
printButton.addEventListener('click', () => {
  window.print();
});

const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
  const width = canvaspdf.width;
  const height = canvaspdf.height;
  const pdf = new jsPDF('l', 'px', [width, height]);
  pdf.addImage(canvaspdf, 'png', 0, 0, width, height);
  pdf.addImage(canvas, 'png', 0, 0, width, height);
  pdf.save('final.pdf');
});

var url = './sample.pdf';
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');

  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    var scale = 1.0;
    var viewport = page.getViewport({scale: scale});

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
