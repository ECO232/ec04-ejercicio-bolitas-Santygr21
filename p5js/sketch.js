const apiUrlForGet = "http://localhost:3000/points";
const apiUrlForPost = "http://localhost:3000/points";
const apiUrlForClear = "http://localhost:3000/clear";

class Points{
  constructor(x, y, r, g, b){
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  show(){
    fill(this.r, this.g, this.b);
    ellipse(this.x, this.y, 20, 20);
  }
}

async function fetchPoints() {
  try {
    const response = await fetch(apiUrlForGet);    
    if (!response.ok) {
      throw new Error(`HTTP error : Status: ${response.status}`);
    }    
    const points = await response.json();
    return points;
  } catch (error) {
    console.error('Error fetching points:', error);
    return [];
  }
}

let points = []

function setup() {
const canvas = createCanvas(400, 400);
canvas.id('myCanvas')

  fetchPoints().then(onServerPoints => {
    console.log('Fetched points:', onServerPoints.points);
    onServerPoints.points.forEach(eachPoint => {
      const {x,y,r,g,b} = eachPoint;
      points.push(new Item(x, y, r, g, b))
    });
  }).catch(error => {
    console.error('Error:', error);
  });
}

function draw() {
background(220);
points.forEach(point=>{
  point.show();
});
}

function mousePressed(){
const newPoint = new Point(mouseX, mouseY, random(255),random(255),random(255))
points.push(newItem);

postNewPoint(newPoint).then(responseData => {
  if (responseData) {
    console.log('Point posted successfully:', responseData);
  }
}).catch(error => {
  console.error('Error:', error);
}); 

}

async function postNewPoint(data) {
try {
  
  const response = await fetch( apiUrlForPost, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error : Status : ${response.status}`);
  }

  const responseData = await response.json();    
  
  return responseData;

} catch (error) {
  console.error('Error posting point:', error);
  return null;
}
}

async function clearCanvas() {
try {
  const canvas = document.getElementById('myCanvas'); 
  const context = canvas.getContext('2d'); 

  const response = await fetch(apiUrlForClear, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error: Status: ${response.status}`);
  }

  points = [];
  context.clearRect(0, 0, canvas.width, canvas.height);

} catch (error) {
  console.error('Error clearing points:', error);
}
}