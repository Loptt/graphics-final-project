const KEYS = {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    RIGHT: "ArrowRight",
    LEFT: "ArrowLeft",
}

const SHIPCONSTANTS = {
    acceleration: 0.002,
    steerRate: Math.PI / 500,
    maxSpeed: 0.75,
    minRotationSpeed: 0.004
}

const ISLANDCONSTANTS = {
    maxRadius: 70,
    minRadius: 15,
    minX: -120,
    maxX: 120,
    minZ: -120,
    maxZ: 120,
    maxVegetation: 5
}

export {KEYS, SHIPCONSTANTS, ISLANDCONSTANTS}
