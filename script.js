const canvas = document.getElementById("space")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let centerX = canvas.width / 2
let centerY = canvas.height / 2

let satellites = []
let stars = []
let galaxyAngle = 0

/* STARFIELD */

for (let i = 0; i < 500; i++) {

stars.push({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
size: Math.random() * 2
})

}

/* EARTH TEXTURE */

const earthImg = new Image()
earthImg.src = "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"

let earthRotation = 0

/* SATELLITE CLASS */

class Satellite {

constructor(radius) {

this.radius = radius
this.angle = Math.random() * Math.PI * 2
this.speed = 0.01 + Math.random() * 0.02
this.trail = []

}

update(globalSpeed) {

this.angle += this.speed * globalSpeed

let x = centerX + Math.cos(this.angle) * this.radius
let y = centerY + Math.sin(this.angle) * this.radius

this.trail.push({ x, y })

if (this.trail.length > 40) this.trail.shift()

}

draw() {

let x = centerX + Math.cos(this.angle) * this.radius
let y = centerY + Math.sin(this.angle) * this.radius

/* TRAIL */

ctx.strokeStyle = "rgba(0,255,255,0.35)"
ctx.beginPath()

this.trail.forEach((p, i) => {

if (i === 0) ctx.moveTo(p.x, p.y)
else ctx.lineTo(p.x, p.y)

})

ctx.stroke()

/* SOLAR PANELS */

ctx.fillStyle = "#1fa3ff"

ctx.fillRect(x - 22, y - 3, 16, 6)
ctx.fillRect(x + 6, y - 3, 16, 6)

/* PANEL GRID */

ctx.strokeStyle = "rgba(255,255,255,0.2)"

ctx.beginPath()

ctx.moveTo(x - 14, y - 3)
ctx.lineTo(x - 14, y + 3)

ctx.moveTo(x + 14, y - 3)
ctx.lineTo(x + 14, y + 3)

ctx.stroke()

/* MAIN BODY */

ctx.fillStyle = "#d9d9d9"
ctx.fillRect(x - 6, y - 6, 12, 12)

/* BODY SHADOW */

ctx.fillStyle = "rgba(0,0,0,0.25)"
ctx.fillRect(x - 6, y, 12, 6)

/* ANTENNA DISH */

ctx.strokeStyle = "#cfd8dc"

ctx.beginPath()
ctx.arc(x, y - 10, 4, 0, Math.PI)
ctx.stroke()

ctx.beginPath()
ctx.moveTo(x, y - 6)
ctx.lineTo(x, y - 10)
ctx.stroke()

/* BLINKING LIGHT */

if (Math.floor(Date.now() / 500) % 2 === 0) {

ctx.fillStyle = "#ff3b3b"

ctx.beginPath()
ctx.arc(x + 2, y - 2, 1.5, 0, Math.PI * 2)
ctx.fill()

}

}

}

/* CREATE SATELLITE */

function createSatellite() {

let radius = 150 + satellites.length * 50
satellites.push(new Satellite(radius))
updateCount()

}

function addSatellite() {

createSatellite()

}

function removeSatellite() {

satellites.pop()
updateCount()

}

function updateCount() {

document.getElementById("count").innerText = satellites.length

}

createSatellite()

/* STARS */

function drawStars() {

stars.forEach(s => {

ctx.fillStyle = "white"
ctx.fillRect(s.x, s.y, s.size, s.size)

})

}

/* GALAXY BACKGROUND */

function drawGalaxy() {

galaxyAngle += 0.0005

for (let i = 0; i < 6; i++) {

ctx.strokeStyle = "rgba(120,120,255,0.04)"

ctx.beginPath()

ctx.arc(
centerX,
centerY,
500 + i * 40,
galaxyAngle,
Math.PI * 2 + galaxyAngle
)

ctx.stroke()

}

}

/* EARTH ROTATION */

function drawEarth() {

earthRotation += 0.001

ctx.save()

ctx.beginPath()
ctx.arc(centerX, centerY, 60, 0, Math.PI * 2)
ctx.clip()

ctx.translate(centerX, centerY)
ctx.rotate(earthRotation)

ctx.drawImage(earthImg, -60, -60, 120, 120)

ctx.restore()

}

/* SATURN */

function drawSaturn() {

let x = 150
let y = 200

ctx.fillStyle = "#d2b48c"

ctx.beginPath()
ctx.arc(x, y, 20, 0, Math.PI * 2)
ctx.fill()

ctx.strokeStyle = "#caa56c"
ctx.lineWidth = 4

ctx.beginPath()
ctx.ellipse(x, y, 35, 12, 0, 0, Math.PI * 2)
ctx.stroke()

}

/* JUPITER */

function drawJupiter() {

let x = canvas.width - 180
let y = 160

ctx.fillStyle = "#d9a066"

ctx.beginPath()
ctx.arc(x, y, 30, 0, Math.PI * 2)
ctx.fill()

}

/* ORBIT RINGS */

function drawOrbit(r) {

ctx.strokeStyle = "rgba(255,255,255,0.08)"

ctx.beginPath()
ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
ctx.stroke()

}

/* MAIN ANIMATION */

function animate() {

ctx.clearRect(0, 0, canvas.width, canvas.height)

drawStars()

drawGalaxy()

drawSaturn()

drawJupiter()

drawEarth()

let speed = document.getElementById("speed").value

satellites.forEach(s => {

drawOrbit(s.radius)

s.update(speed)
s.draw()

})

requestAnimationFrame(animate)

}

animate()

/* RESIZE */

window.addEventListener("resize", () => {

canvas.width = window.innerWidth
canvas.height = window.innerHeight

centerX = canvas.width / 2
centerY = canvas.height / 2

})