const loaderWrapper = document.querySelector(".loader-wrapper")
const loader = loaderWrapper.querySelector(".loader")
const gun = loader.querySelector("div:first-child")

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

function handleMouseMove(e) {
  const { x, y } = normalizeBounds(e.pageX, e.pageY, loader)

  // Intentially flipping the x and y to avoid doing * -1 + 90
  const angle = Math.atan2(x, y) * (180 / Math.PI)

  loader.style.rotate = `${angle}deg`
}

function getSlopeX(x, y, newY) {
  const m = y / x

  return newY / m
}

function handleMouseDown(e) {
  // create bullet
  const bullet = document.createElement("div")
  bullet.setAttribute("class", "bullet")
  document.body.append(bullet)

  const size = bullet.clientHeight / 2

  const { x, y } = normalizeBounds(e.pageX, e.pageY, loader)

  const { x: pageX, y: pageY } = normalizeBounds(
    document.body.clientWidth,
    y < 0 ? document.body.clientHeight : -size,
    loader
  )

  const xFromY = getSlopeX(x, y, pageY)
  const yFromX = getSlopeX(y, x, pageX)

  let newX, newY

  // check which way hits the walls first
  if (xFromY > -pageX && xFromY < pageX) {
    newX = xFromY
    newY = pageY
  } else {
    newX = pageX * (x < 0 ? -1 : 1)
    newY = yFromX * (x < 0 ? -1 : 1)
  }

  const { x: inverseX, y: inverseY } = inverseBounds(newX, newY, loader)

  bullet.style.left = inverseX + "px"
  bullet.style.top = inverseY + "px"

  // set fixed duration so all bullets travel at the same speed, and remove bullet form DOM once it's out of sight

  const d = Math.sqrt(newX ** 2 + newY ** 2)
  const s = 0.5 // pixels per ms
  const t = d / s

  bullet.style.setProperty("--duration", t + "ms")

  setTimeout(() => {
    bullet.remove()
  }, t)
}

loaderWrapper.addEventListener("mousemove", handleMouseMove)
loaderWrapper.addEventListener("mousedown", handleMouseDown)
