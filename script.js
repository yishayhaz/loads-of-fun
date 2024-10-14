class Rocket {
  speed = 0.5 // pixels per ms
  rocket

  constructor() {
    this.rocket = document.createElement("div")
    this.rocket.setAttribute("class", "rocket")
    document.body.append(this.rocket)
  }

  destroy() {
    this.rocket?.remove()
  }

  shoot(toX, toY, distance) {
    this.rocket.style.left = toX + "px"
    this.rocket.style.top = toY + "px"

    const time = distance / this.speed

    this.rocket.style.setProperty("--duration", time + "ms")

    setTimeout(() => {
      this.destroy()
    }, time)
  }
}

class Tank {
  tank

  constructor(tank) {
    this.tank = tank
  }

  aim(mouseX, mouseY) {
    const { x, y } = normalizeBounds(mouseX, mouseY, this.tank)

    // Intentially flipping the x and y to avoid doing * -1 + 90
    const angle = Math.atan2(x, y) * (180 / Math.PI)

    this.tank.style.rotate = `${angle}deg`
  }

  shoot(mouseX, mouseY) {
    const rocket = new Rocket()

    const size = rocket.rocket.clientHeight / 2

    const { x, y } = normalizeBounds(mouseX, mouseY, this.tank)

    const { x: pageX, y: pageY } = normalizeBounds(
      document.body.clientWidth,
      y < 0 ? document.body.clientHeight : -size,
      this.tank
    )

    const xFromY = getPointOnGraph(x, y, pageY)
    const yFromX = getPointOnGraph(y, x, pageX)

    let newX, newY

    // check which way hits the walls first
    if (xFromY > -pageX && xFromY < pageX) {
      newX = xFromY
      newY = pageY
    } else {
      newX = pageX * (x < 0 ? -1 : 1)
      newY = yFromX * (x < 0 ? -1 : 1)
    }

    const { x: inverseX, y: inverseY } = inverseBounds(newX, newY, this.tank)

    const d = Math.sqrt(newX ** 2 + newY ** 2)

    rocket.shoot(inverseX, inverseY, d)
  }
}

class Enemy {}

function normalizeBounds(x, y, element) {
  return {
    x: x - (element.offsetLeft + element.clientWidth / 2),
    y: -(y - (element.offsetTop + element.clientHeight / 2)),
  }
}

function inverseBounds(x, y, element) {
  return {
    x: x + element.offsetLeft + element.clientWidth / 2,
    y: -(y - element.offsetTop - element.clientHeight / 2),
  }
}

function getPointOnGraph(x, y, newY) {
  const m = y / x

  return newY / m
}

const loaderWrapper = document.querySelector(".loader-wrapper")
const loader = loaderWrapper.querySelector(".loader")

const tank = new Tank(loader)

function handleMouseMove(e) {
  tank.aim(e.pageX, e.pageY)
}

function handleMouseDown(e) {
  tank.shoot(e.pageX, e.pageY)
}

loaderWrapper.addEventListener("mousemove", handleMouseMove)
loaderWrapper.addEventListener("mousedown", handleMouseDown)
