"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Game.module.css"

// Asset imports
import ostAudio from "../../assets/game/ost.mp3"
import deathAudio from "../../assets/game/death.mp3"
import dangerAudio from "../../assets/game/danger.mp3"
import attackAudio from "../../assets/game/attack.mp3"
import startVideo from "../../assets/game/start.mp4"
import startImage from "../../assets/game/start.png"
import heartImage from "../../assets/game/heart.png"
import asgoreAngryGif from "../../assets/game/asgore-angry.gif"
import asgoreGif from "../../assets/game/asgore.gif"
import flamesImage from "../../assets/game/flames.png"
import starImage from "../../assets/game/star.png"
import midImage from "../../assets/game/mid.png"

// GAME CONFIGURATION CONSTANTS
const GAME_CONFIG = {
  FLAME_SIZE: 24,
  HEART_SIZE: 24,
  BOX_SIZE: 280,
  MID_ATTACK_WIDTH: 80,
  MID_ATTACK_HEIGHT: 80,
  STAR_SIZE: 32,
  FLAME_ATTACK_DURATION: 12000,
  STAR_ATTACK_DURATION: 10000,
  TRANSITION_DURATION: 2000,
}

// NARRATOR LINES FOR INTRO
const narratorLines = [
  "Una strana luce riempie la stanza.",
  "Il crepuscolo splende attraverso la barriera.",
  "Sembra che il tuo viaggio sia finalmente finito.",
  "Sei pieno di DETERMINAZIONE.",
]

// CREATE FLAME WAVE PATTERNS
const createFlameWave = (waveType) => {
  const { BOX_SIZE, FLAME_SIZE } = GAME_CONFIG
  switch (waveType) {
    case "horizontal":
      return [
        { id: 1, x: -80, y: 60, dx: 2.0, dy: 0 },
        { id: 2, x: BOX_SIZE + 80, y: 120, dx: -2.3, dy: 0 },
        { id: 3, x: -100, y: 180, dx: 1.8, dy: 0 },
        { id: 4, x: BOX_SIZE + 100, y: 240, dx: -2.1, dy: 0 },
        { id: 5, x: -60, y: 30, dx: 2.5, dy: 0 },
        { id: 6, x: BOX_SIZE + 60, y: 90, dx: -2.7, dy: 0 },
      ]
    case "vertical":
      return [
        { id: 7, x: 60, y: -80, dx: 0, dy: 2.0 },
        { id: 8, x: 120, y: BOX_SIZE + 80, dx: 0, dy: -2.3 },
        { id: 9, x: 180, y: -100, dx: 0, dy: 1.8 },
        { id: 10, x: 240, y: BOX_SIZE + 100, dx: 0, dy: -2.1 },
        { id: 11, x: 30, y: -60, dx: 0, dy: 2.5 },
        { id: 12, x: 90, y: BOX_SIZE + 60, dx: 0, dy: -2.7 },
      ]
    case "diagonal":
      return [
        { id: 13, x: -80, y: -80, dx: 1.6, dy: 1.6 },
        { id: 14, x: BOX_SIZE + 80, y: BOX_SIZE + 80, dx: -1.8, dy: -1.8 },
        { id: 15, x: -100, y: BOX_SIZE + 100, dx: 2.0, dy: -2.0 },
        { id: 16, x: BOX_SIZE + 100, y: -100, dx: -2.2, dy: 2.2 },
        { id: 17, x: -60, y: -60, dx: 1.4, dy: 1.4 },
        { id: 18, x: BOX_SIZE + 60, y: BOX_SIZE + 60, dx: -1.6, dy: -1.6 },
      ]
    case "circle":
      const centerX = BOX_SIZE / 2
      const centerY = BOX_SIZE / 2
      const flames = []
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        flames.push({
          id: 19 + i,
          x: centerX - FLAME_SIZE / 2,
          y: centerY - FLAME_SIZE / 2,
          dx: Math.cos(angle) * 1.2,
          dy: Math.sin(angle) * 1.2,
          isCircle: true,
          startRadius: 0,
          currentRadius: 0,
          maxRadius: 120,
          angle: angle,
          warningTime: 2000,
          showWarning: true,
        })
      }
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + Math.PI / 8
        flames.push({
          id: 25 + i,
          x: centerX - FLAME_SIZE / 2,
          y: centerY - FLAME_SIZE / 2,
          dx: Math.cos(angle) * 1.0,
          dy: Math.sin(angle) * 1.0,
          isCircle: true,
          startRadius: 0,
          currentRadius: 0,
          maxRadius: 120,
          angle: angle,
          delay: 2500,
          warningTime: 2000,
          showWarning: true,
        })
      }
      return flames
    default:
      return []
  }
}

// CREATE STAR FORMATIONS
const createStarFormation = (formationType) => {
  const { BOX_SIZE } = GAME_CONFIG
  switch (formationType) {
    case "straight":
      return [
        { id: 1, x: -100, y: 70, dx: 1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
        { id: 2, x: -100, y: 140, dx: 1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
        { id: 3, x: -100, y: 210, dx: 1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
        { id: 4, x: BOX_SIZE + 100, y: 100, dx: -1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
        { id: 5, x: BOX_SIZE + 100, y: 170, dx: -1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
      ]
    case "vertical":
      return [
        { id: 6, x: 70, y: -100, dx: 0, dy: 1.4, angle: 0, rotationSpeed: 0.05 },
        { id: 7, x: 140, y: -100, dx: 0, dy: 1.4, angle: 0, rotationSpeed: 0.05 },
        { id: 8, x: 210, y: -100, dx: 0, dy: 1.4, angle: 0, rotationSpeed: 0.05 },
        { id: 9, x: 100, y: BOX_SIZE + 100, dx: 0, dy: -1.4, angle: 0, rotationSpeed: 0.05 },
        { id: 10, x: 170, y: BOX_SIZE + 100, dx: 0, dy: -1.4, angle: 0, rotationSpeed: 0.05 },
      ]
    case "diagonal":
      return [
        { id: 11, x: -100, y: -100, dx: 1.3, dy: 1.3, angle: 0, rotationSpeed: 0.05 },
        { id: 12, x: -80, y: -80, dx: 1.3, dy: 1.3, angle: 0, rotationSpeed: 0.05 },
        { id: 13, x: BOX_SIZE + 100, y: BOX_SIZE + 100, dx: -1.3, dy: -1.3, angle: 0, rotationSpeed: 0.05 },
        { id: 14, x: BOX_SIZE + 80, y: BOX_SIZE + 80, dx: -1.3, dy: -1.3, angle: 0, rotationSpeed: 0.05 },
        { id: 15, x: -100, y: BOX_SIZE + 100, dx: 1.3, dy: -1.3, angle: 0, rotationSpeed: 0.05 },
        { id: 16, x: BOX_SIZE + 100, y: -100, dx: -1.3, dy: 1.3, angle: 0, rotationSpeed: 0.05 },
      ]
    default:
      return []
  }
}

// MAIN ASGORE COMPONENT
export default function Game() {
  const navigate = useNavigate()

  // Main game states
  const [gameState, setGameState] = useState("loading")
  const [position, setPosition] = useState({ x: 128, y: 128 })
  const [countdown, setCountdown] = useState(3)

  // Intro video and narrator states
  const [showVideo, setShowVideo] = useState(false)
  const [currentNarratorLine, setCurrentNarratorLine] = useState(0)

  // Red zone attack states
  const [zoneActive, setZoneActive] = useState(false)
  const [zoneCountdown, setZoneCountdown] = useState(3)
  const [redZoneOnRight, setRedZoneOnRight] = useState(true)
  const [redZoneDeadly, setRedZoneDeadly] = useState(false)

  // Attack phase states
  const [attackPhase, setAttackPhase] = useState("transition")
  const [isStarAttack, setIsStarAttack] = useState(false)
  const [attackCountdown, setAttackCountdown] = useState(GAME_CONFIG.FLAME_ATTACK_DURATION / 1000)
  const [starAttackCountdown, setStarAttackCountdown] = useState(GAME_CONFIG.STAR_ATTACK_DURATION / 1000)
  const [difficultyLevel, setDifficultyLevel] = useState(1)

  // Projectile states
  const [visibleFlames, setVisibleFlames] = useState([])
  const [visibleStars, setVisibleStars] = useState([])
  const [currentFlameWave, setCurrentFlameWave] = useState(0)
  const [currentStarFormation, setCurrentStarFormation] = useState(0)

  // Mid attack states
  const [midAttack, setMidAttack] = useState({
    active: false,
    x: -GAME_CONFIG.MID_ATTACK_WIDTH,
    y: GAME_CONFIG.BOX_SIZE / 2 - GAME_CONFIG.MID_ATTACK_HEIGHT / 2,
    speed: 1.5,
    direction: 1,
  })

  // Asgore visual states
  const [showAngryAsgore, setShowAngryAsgore] = useState(false)
  const [showWarningAsgore, setShowWarningAsgore] = useState(false)

  // Refs for input and timers
  const keys = useRef({ w: false, a: false, s: false, d: false })
  const intervalRef = useRef(null)
  const zoneIntervalRef = useRef(null)
  const zoneTimerRef = useRef(null)
  const narratorIntervalRef = useRef(null)
  const midAttackIntervalRef = useRef(null)
  const angryAsgoreTimeoutRef = useRef(null)
  const warningAsgoreTimeoutRef = useRef(null)
  const attackCycleRef = useRef(null)
  const starAttackCycleRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const waveChangeRef = useRef(null)

  // Audio refs
  const ostRef = useRef(null)
  const deathRef = useRef(null)
  const dangerRef = useRef(null)
  const attackRef = useRef(null)
  const videoRef = useRef(null)

  // Attack patterns
  const flameWaveTypes = ["horizontal", "vertical", "diagonal", "circle"]
  const starFormationTypes = ["straight", "vertical", "diagonal"]

  const handleTouchButton = (direction, isPressed) => {
    keys.current[direction] = isPressed
  }

  // Clear all timers function
  const clearAllTimers = () => {
    clearTimeout(attackCycleRef.current)
    clearTimeout(starAttackCycleRef.current)
    clearTimeout(waveChangeRef.current)
    clearInterval(countdownIntervalRef.current)
  }

  // Update stars animation
  const updateStars = (stars) => {
    return stars.map((star) => {
      let newX = star.x + star.dx
      let newY = star.y + star.dy
      const newAngle = star.angle + star.rotationSpeed

      if (newX > GAME_CONFIG.BOX_SIZE + 100) newX = -100 - GAME_CONFIG.STAR_SIZE
      if (newX < -100 - GAME_CONFIG.STAR_SIZE) newX = GAME_CONFIG.BOX_SIZE + 100
      if (newY > GAME_CONFIG.BOX_SIZE + 100) newY = -100 - GAME_CONFIG.STAR_SIZE
      if (newY < -100 - GAME_CONFIG.STAR_SIZE) newY = GAME_CONFIG.BOX_SIZE + 100

      return { ...star, x: newX, y: newY, angle: newAngle }
    })
  }

  // Update flames with special patterns
  const updateFlames = (flames) => {
    const waveType = flameWaveTypes[currentFlameWave]
    return flames.map((flame) => {
      let newX = flame.x
      let newY = flame.y

      if (waveType === "circle" && flame.isCircle) {
        if (flame.warningTime > 0) {
          flame.warningTime -= 16
          return flame
        }

        if (flame.delay && flame.delay > 0) {
          flame.delay -= 16
          return flame
        }

        if (flame.currentRadius < flame.maxRadius) {
          flame.currentRadius += 1.5
          const centerX = GAME_CONFIG.BOX_SIZE / 2
          const centerY = GAME_CONFIG.BOX_SIZE / 2
          newX = centerX + Math.cos(flame.angle) * flame.currentRadius - GAME_CONFIG.FLAME_SIZE / 2
          newY = centerY + Math.sin(flame.angle) * flame.currentRadius - GAME_CONFIG.FLAME_SIZE / 2
        } else {
          newX = flame.x + flame.dx * 0.8
          newY = flame.y + flame.dy * 0.8
        }
      } else {
        newX = flame.x + flame.dx
        newY = flame.y + flame.dy
      }

      if (flame.dx > 0 && newX > GAME_CONFIG.BOX_SIZE + 100) newX = -100 - GAME_CONFIG.FLAME_SIZE
      if (flame.dx < 0 && newX < -100 - GAME_CONFIG.FLAME_SIZE) newX = GAME_CONFIG.BOX_SIZE + 100
      if (flame.dy > 0 && newY > GAME_CONFIG.BOX_SIZE + 100) newY = -100 - GAME_CONFIG.FLAME_SIZE
      if (flame.dy < 0 && newY < -100 - GAME_CONFIG.FLAME_SIZE) newY = GAME_CONFIG.BOX_SIZE + 100

      return { ...flame, x: newX, y: newY }
    })
  }

  // Start flame attack cycle
  const startFlameAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("flame")
    setIsStarAttack(false)
    setCurrentFlameWave(0)
    setVisibleFlames(createFlameWave(flameWaveTypes[0]))
    setVisibleStars([])
    setAttackCountdown(GAME_CONFIG.FLAME_ATTACK_DURATION / 1000)

    const changeWave = (waveIndex) => {
      if (waveIndex < flameWaveTypes.length) {
        setCurrentFlameWave(waveIndex)
        setVisibleFlames(createFlameWave(flameWaveTypes[waveIndex]))
        waveChangeRef.current = setTimeout(() => {
          changeWave(waveIndex + 1)
        }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length)
      }
    }

    waveChangeRef.current = setTimeout(() => {
      changeWave(1)
    }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length)

    attackCycleRef.current = setTimeout(() => {
      startTransition(() => startStarAttackCycle())
    }, GAME_CONFIG.FLAME_ATTACK_DURATION)

    countdownIntervalRef.current = setInterval(() => {
      setAttackCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Start star attack cycle
  const startStarAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("star")
    setIsStarAttack(true)
    setCurrentStarFormation(0)
    setVisibleFlames([])
    setVisibleStars(createStarFormation(starFormationTypes[0]))
    setMidAttack((prev) => ({ ...prev, active: false }))
    setStarAttackCountdown(GAME_CONFIG.STAR_ATTACK_DURATION / 1000)

    const changeFormation = (formationIndex) => {
      if (formationIndex < starFormationTypes.length) {
        setCurrentStarFormation(formationIndex)
        setVisibleStars(createStarFormation(starFormationTypes[formationIndex]))
        waveChangeRef.current = setTimeout(() => {
          changeFormation(formationIndex + 1)
        }, GAME_CONFIG.STAR_ATTACK_DURATION / starFormationTypes.length)
      }
    }

    waveChangeRef.current = setTimeout(() => {
      changeFormation(1)
    }, GAME_CONFIG.STAR_ATTACK_DURATION / starFormationTypes.length)

    starAttackCycleRef.current = setTimeout(() => {
      setDifficultyLevel((prev) => prev + 1)
      startTransition(() => startFlameAttackCycle())
    }, GAME_CONFIG.STAR_ATTACK_DURATION)

    countdownIntervalRef.current = setInterval(() => {
      setStarAttackCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Transition between attacks
  const startTransition = (nextAttack) => {
    setAttackPhase("transition")
    setVisibleFlames([])
    setVisibleStars([])
    setTimeout(() => {
      nextAttack()
    }, GAME_CONFIG.TRANSITION_DURATION)
  }

  // Get Asgore image based on state
  const getAsgoreImage = () => {
    if (showAngryAsgore) return asgoreAngryGif
    if (showWarningAsgore) return asgoreGif
    return asgoreGif
  }

  // Menu functions
  const startFight = () => {
    if (deathRef.current) {
      deathRef.current.pause()
      deathRef.current.currentTime = 0
    }
    setShowVideo(true)
  }

  const goHome = () => {
    navigate("/")
  }

  const skipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.dispatchEvent(new Event("ended"))
    }
  }

  const startCountdown = () => {
    setCountdown(3)
    setGameState("countdown")
  }

  // EFFECTS

  // Initial loading state
  useEffect(() => {
    if (gameState === "loading") {
      const timer = setTimeout(() => setGameState("menu"), 1500)
      return () => clearTimeout(timer)
    }
  }, [gameState])

  // Countdown before fight
  useEffect(() => {
    if (gameState !== "countdown") return
    if (countdown === 0) {
      setGameState("fight")
      return
    }
    const timeout = setTimeout(() => {
      setCountdown((c) => c - 1)
    }, 500)
    return () => clearTimeout(timeout)
  }, [countdown, gameState])

  // Audio management
  useEffect(() => {
    if (!ostRef.current || !deathRef.current || !dangerRef.current || !attackRef.current) return

    if (gameState === "fight" || gameState === "countdown") {
      ostRef.current.volume = 0.5
      ostRef.current.loop = true
      ostRef.current.play().catch(() => {})
      deathRef.current.pause()
      deathRef.current.currentTime = 0
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
    }

    if (gameState === "gameover") {
      ostRef.current.pause()
      deathRef.current.currentTime = 0
      deathRef.current.play().catch(() => {})
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
    }

    if (gameState === "menu" || gameState === "loading") {
      ostRef.current.pause()
      ostRef.current.currentTime = 0
      deathRef.current.pause()
      deathRef.current.currentTime = 0
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
    }
  }, [gameState])

  // Input handling and player movement
  useEffect(() => {
    if (gameState !== "fight") return

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = true
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = false
    }

    const move = () => {
      setPosition((prev) => {
        const speed = 3
        let { x, y } = prev

        if (keys.current.w) y -= speed
        if (keys.current.s) y += speed
        if (keys.current.a) x -= speed
        if (keys.current.d) x += speed

        x = Math.max(0, Math.min(GAME_CONFIG.BOX_SIZE - GAME_CONFIG.HEART_SIZE, x))
        y = Math.max(0, Math.min(GAME_CONFIG.BOX_SIZE - GAME_CONFIG.HEART_SIZE, y))

        return { x, y }
      })

      // Update flames during flame attack
      if (attackPhase === "flame") {
        setVisibleFlames((prevFlames) => {
          const newFlames = updateFlames(prevFlames)
          for (const flame of newFlames) {
            if (
              flame.x < position.x + GAME_CONFIG.HEART_SIZE &&
              flame.x + GAME_CONFIG.FLAME_SIZE > position.x &&
              flame.y < position.y + GAME_CONFIG.HEART_SIZE &&
              flame.y + GAME_CONFIG.FLAME_SIZE > position.y
            ) {
              setGameState("gameover")
              break
            }
          }
          return newFlames
        })
      }
      // Update stars during star attack
      else if (attackPhase === "star") {
        setVisibleStars((prevStars) => {
          const newStars = updateStars(prevStars)
          for (const star of newStars) {
            if (
              star.x < position.x + GAME_CONFIG.HEART_SIZE &&
              star.x + GAME_CONFIG.STAR_SIZE > position.x &&
              star.y < position.y + GAME_CONFIG.HEART_SIZE &&
              star.y + GAME_CONFIG.STAR_SIZE > position.y
            ) {
              setGameState("gameover")
              break
            }
          }
          return newStars
        })
      }

      // Red zone collision
      if (redZoneDeadly) {
        const inRedZone = redZoneOnRight ? position.x > GAME_CONFIG.BOX_SIZE / 2 : position.x < GAME_CONFIG.BOX_SIZE / 2
        if (inRedZone) {
          setGameState("gameover")
        }
      }

      // Mid attack movement and collision
      if (midAttack.active) {
        setMidAttack((prev) => {
          const newX = prev.x + prev.speed * prev.direction
          if (
            (prev.direction === 1 && newX > GAME_CONFIG.BOX_SIZE) ||
            (prev.direction === -1 && newX < -GAME_CONFIG.MID_ATTACK_WIDTH)
          ) {
            return { ...prev, active: false }
          }

          if (
            newX < position.x + GAME_CONFIG.HEART_SIZE &&
            newX + GAME_CONFIG.MID_ATTACK_WIDTH > position.x &&
            prev.y < position.y + GAME_CONFIG.HEART_SIZE &&
            prev.y + GAME_CONFIG.MID_ATTACK_HEIGHT > position.y
          ) {
            setGameState("gameover")
            return { ...prev, active: false }
          }

          return { ...prev, x: newX }
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    intervalRef.current = setInterval(move, 16)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      clearInterval(intervalRef.current)
    }
  }, [gameState, position, redZoneDeadly, redZoneOnRight, midAttack.active, attackPhase])

  // Red zone attacks
  useEffect(() => {
    if (gameState !== "fight") {
      clearInterval(zoneIntervalRef.current)
      clearTimeout(zoneTimerRef.current)
      clearTimeout(angryAsgoreTimeoutRef.current)
      clearTimeout(warningAsgoreTimeoutRef.current)
      clearAllTimers()
      setZoneActive(false)
      setRedZoneDeadly(false)
      setShowAngryAsgore(false)
      setShowWarningAsgore(false)
      setAttackPhase("transition")
      setVisibleFlames([])
      setVisibleStars([])
      if (dangerRef.current) {
        dangerRef.current.pause()
        dangerRef.current.currentTime = 0
      }
      if (attackRef.current) {
        attackRef.current.pause()
        attackRef.current.currentTime = 0
      }
      return
    }

    const activateZone = () => {
      setRedZoneOnRight((prev) => !prev)
      setZoneActive(true)
      setRedZoneDeadly(false)
      setZoneCountdown(3)
      setShowWarningAsgore(true)

      if (dangerRef.current) {
        dangerRef.current.currentTime = 0
        dangerRef.current.play().catch((e) => console.log("Audio play error:", e))
      }

      warningAsgoreTimeoutRef.current = setTimeout(() => {
        setShowWarningAsgore(false)
      }, 2500)

      setTimeout(() => {
        setRedZoneDeadly(true)
        setShowAngryAsgore(true)
        angryAsgoreTimeoutRef.current = setTimeout(() => {
          setShowAngryAsgore(false)
        }, 500)

        if (attackRef.current) {
          attackRef.current.currentTime = 0
          attackRef.current.play().catch((e) => console.log("Audio play error:", e))
        }
      }, 3000)

      zoneTimerRef.current = setTimeout(() => {
        setZoneActive(false)
        setRedZoneDeadly(false)
        setShowAngryAsgore(false)
        setShowWarningAsgore(false)
      }, 4000)

      const countdownInterval = setInterval(() => {
        setZoneCountdown((prev) => {
          if (prev <= 0) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    const zoneInterval = Math.max(4000, 6000 - difficultyLevel * 200)
    const initialDelay = setTimeout(() => {
      activateZone()
      zoneIntervalRef.current = setInterval(activateZone, zoneInterval)
    }, 3000)

    return () => {
      clearInterval(zoneIntervalRef.current)
      clearTimeout(zoneTimerRef.current)
      clearTimeout(angryAsgoreTimeoutRef.current)
      clearTimeout(warningAsgoreTimeoutRef.current)
      clearTimeout(initialDelay)
    }
  }, [gameState, difficultyLevel])

  // Mid attacks
  useEffect(() => {
    if (gameState !== "fight") {
      setMidAttack((prev) => ({ ...prev, active: false }))
      clearInterval(midAttackIntervalRef.current)
      return
    }

    const activateMidAttack = () => {
      if (attackPhase === "star") return
      const fromRight = Math.random() > 0.5
      setMidAttack({
        active: true,
        x: fromRight ? GAME_CONFIG.BOX_SIZE : -GAME_CONFIG.MID_ATTACK_WIDTH,
        y: Math.random() * (GAME_CONFIG.BOX_SIZE - GAME_CONFIG.MID_ATTACK_HEIGHT),
        speed: 1.5,
        direction: fromRight ? -1 : 1,
      })
    }

    const midAttackInterval = Math.max(3000, 5000 - difficultyLevel * 150)
    const initialDelay = setTimeout(() => {
      activateMidAttack()
      midAttackIntervalRef.current = setInterval(activateMidAttack, midAttackInterval)
    }, 4000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(midAttackIntervalRef.current)
    }
  }, [gameState, attackPhase, difficultyLevel])

  // Start attack cycle when fight begins
  useEffect(() => {
    if (gameState === "fight") {
      setDifficultyLevel(1)
      startFlameAttackCycle()
    }
    return () => {
      clearAllTimers()
    }
  }, [gameState])

  // Video intro handling
  useEffect(() => {
    if (!showVideo) return
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setShowVideo(false)
      setPosition({ x: 128, y: 128 })
      keys.current = { w: false, a: false, s: false, d: false }
      setVisibleFlames([])
      setVisibleStars([])
      setZoneActive(false)
      setRedZoneDeadly(false)
      setRedZoneOnRight(true)
      setShowAngryAsgore(false)
      setShowWarningAsgore(false)
      setMidAttack({
        active: false,
        x: -GAME_CONFIG.MID_ATTACK_WIDTH,
        y: GAME_CONFIG.BOX_SIZE / 2 - GAME_CONFIG.MID_ATTACK_HEIGHT / 2,
        speed: 1.5,
        direction: 1,
      })
      setAttackPhase("transition")
      setCurrentFlameWave(0)
      setCurrentStarFormation(0)
      if (ostRef.current) {
        ostRef.current.currentTime = 0
      }
      startCountdown()
    }

    video.addEventListener("ended", handleVideoEnd)

    const playVideo = async () => {
      try {
        video.volume = 0.2
        await video.play()
      } catch (err) {
        console.error("Video play failed:", err)
        video.muted = true
        try {
          await video.play()
        } catch (mutedErr) {
          console.error("Muted video play failed:", mutedErr)
          handleVideoEnd()
        }
      }
    }

    playVideo()

    return () => {
      video.removeEventListener("ended", handleVideoEnd)
    }
  }, [showVideo])

  // Narrator text during video
  useEffect(() => {
    if (!showVideo) return
    let lineIndex = 0
    setCurrentNarratorLine(0)

    narratorIntervalRef.current = setInterval(() => {
      lineIndex++
      if (lineIndex < narratorLines.length) {
        setCurrentNarratorLine(lineIndex)
      } else {
        clearInterval(narratorIntervalRef.current)
      }
    }, 6000)

    return () => {
      clearInterval(narratorIntervalRef.current)
    }
  }, [showVideo])

  // MAIN RENDER
  return (
    <div className={styles.container}>
      {/* Audio Elements */}
      <audio ref={ostRef} src={ostAudio} />
      <audio ref={deathRef} src={deathAudio} />
      <audio ref={dangerRef} src={dangerAudio} />
      <audio ref={attackRef} src={attackAudio} />

      {/* Intro Video */}
      {showVideo && (
        <div className={styles.videoContainer}>
          <video ref={videoRef} src={startVideo} className={styles.videoPlayer} autoPlay playsInline />
          <div className={styles.videoTitle}>{narratorLines[currentNarratorLine]}</div>
          <button onClick={skipVideo} className={styles.skipButton}>
            Salta
          </button>
        </div>
      )}

      {/* Loading Screen */}
      {gameState === "loading" && <div className={styles.countdownText} style={{ userSelect: "none" }}></div>}

      {/* Menu and Game Over */}
      {(gameState === "menu" || gameState === "gameover") && !showVideo && (
        <div className={gameState === "menu" ? styles.menu : styles.retryMenu}>
          {gameState === "gameover" && <div className={styles.retryText}>Non puoi arrenderti proprio ora...</div>}
          <img src={startImage || "/placeholder.svg"} alt="Start Image" className={styles.startImage} />
          <div className={styles.menuButtons}>
            <button onClick={startFight} className={styles.menuButton}>
              <img src={heartImage || "/placeholder.svg"} alt="Heart" className={styles.menuHeart} />
              Determinazione
            </button>
            <button onClick={goHome} className={styles.homeButton}>
              <span className={styles.homeIcon}></span>
              Torna alla Home
            </button>
          </div>
          <div className={styles.controlsHint}>Usa i tasti WASD per muoverti</div>
        </div>
      )}

      {/* Fight Screen */}
      {(gameState === "fight" || gameState === "countdown") && !showVideo && (
        <div className={styles.gameWrapper}>
          <div className={styles.battleLayout}>
            <img src={getAsgoreImage() || "/placeholder.svg"} alt="Asgore" className={styles.asgore} />
            <div className={styles.box}>
              {/* Red Zone Attacks */}
              {zoneActive && (
                <>
                  <div
                    className={styles.greenZone}
                    style={{
                      left: redZoneOnRight ? 0 : "50%",
                      right: redZoneOnRight ? "50%" : 0,
                    }}
                  ></div>
                  <div
                    className={`${styles.redZone} ${redZoneDeadly ? styles.deadly : ""}`}
                    style={{
                      left: redZoneOnRight ? "50%" : 0,
                      right: redZoneOnRight ? 0 : "50%",
                    }}
                  >
                    {zoneCountdown > 0 && <div className={styles.zoneCountdown}>{zoneCountdown}</div>}
                  </div>
                </>
              )}

              {/* Player Heart */}
              <img
                src={heartImage || "/placeholder.svg"}
                alt="Heart"
                className={styles.heart}
                style={{ top: position.y, left: position.x }}
              />

              {/* Flames during Flame Attack */}
              {attackPhase === "flame" &&
                visibleFlames.map((flame) => (
                  <img
                    key={flame.id}
                    src={flamesImage || "/placeholder.svg"}
                    alt="Flame"
                    className={styles.flame}
                    style={{ top: flame.y, left: flame.x }}
                    draggable={false}
                  />
                ))}

              {/* Warning Circles for Circle Attack */}
              {attackPhase === "flame" &&
                currentFlameWave === 3 &&
                visibleFlames
                  .filter((flame) => flame.isCircle && flame.warningTime > 0)
                  .map((flame) => (
                    <div
                      key={`warning-${flame.id}`}
                      className={styles.circleWarning}
                      style={{
                        top: GAME_CONFIG.BOX_SIZE / 2 - 60,
                        left: GAME_CONFIG.BOX_SIZE / 2 - 60,
                        width: "120px",
                        height: "120px",
                        transform: `rotate(${flame.angle}rad)`,
                      }}
                    />
                  ))}

              {/* Stars during Star Attack */}
              {attackPhase === "star" &&
                visibleStars.map((star) => (
                  <img
                    key={star.id}
                    src={starImage || "/placeholder.svg"}
                    alt="Star"
                    className={styles.star}
                    style={{
                      top: star.y,
                      left: star.x,
                      transform: `rotate(${star.angle}rad)`,
                      width: `${GAME_CONFIG.STAR_SIZE}px`,
                      height: `${GAME_CONFIG.STAR_SIZE}px`,
                    }}
                    draggable={false}
                  />
                ))}

              {/* Mid Attack */}
              {attackPhase === "flame" && midAttack.active && (
                <img
                  src={midImage || "/placeholder.svg"}
                  alt="Mid Attack"
                  className={styles.midAttack}
                  style={{
                    top: midAttack.y,
                    left: midAttack.x,
                    width: `${GAME_CONFIG.MID_ATTACK_WIDTH}px`,
                    height: `${GAME_CONFIG.MID_ATTACK_HEIGHT}px`,
                  }}
                  draggable={false}
                />
              )}

              {/* Initial Countdown */}
              {gameState === "countdown" && (
                <div className={styles.countdownText}>{countdown === 0 ? "" : countdown}</div>
              )}

              {/* Attack Info */}
              <div className={styles.attackInfo}>
                {attackPhase === "star" ? (
                  <div className={styles.starAttackText}>
                    Stars: {starAttackCountdown}s | Livello {difficultyLevel}
                  </div>
                ) : attackPhase === "flame" ? (
                  <div className={styles.flameAttackText}>
                    Flames: {attackCountdown}s | Livello {difficultyLevel}
                  </div>
                ) : (
                  <div className={styles.transitionText}>⚡ Prossimo attacco? </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.controlsHint}>Usa i tasti WASD per muoverti</div>

          <div className={styles.mobileControls}>
            <div className={styles.controlsGrid}>
              <div className={styles.controlsRow}>
                <button
                  className={styles.controlButton}
                  onTouchStart={() => handleTouchButton("w", true)}
                  onTouchEnd={() => handleTouchButton("w", false)}
                  onMouseDown={() => handleTouchButton("w", true)}
                  onMouseUp={() => handleTouchButton("w", false)}
                  onMouseLeave={() => handleTouchButton("w", false)}
                >
                  ▲
                </button>
              </div>
              <div className={styles.controlsRow}>
                <button
                  className={styles.controlButton}
                  onTouchStart={() => handleTouchButton("a", true)}
                  onTouchEnd={() => handleTouchButton("a", false)}
                  onMouseDown={() => handleTouchButton("a", true)}
                  onMouseUp={() => handleTouchButton("a", false)}
                  onMouseLeave={() => handleTouchButton("a", false)}
                >
                  ◄
                </button>
                <button
                  className={styles.controlButton}
                  onTouchStart={() => handleTouchButton("s", true)}
                  onTouchEnd={() => handleTouchButton("s", false)}
                  onMouseDown={() => handleTouchButton("s", true)}
                  onMouseUp={() => handleTouchButton("s", false)}
                  onMouseLeave={() => handleTouchButton("s", false)}
                >
                  ▼
                </button>
                <button
                  className={styles.controlButton}
                  onTouchStart={() => handleTouchButton("d", true)}
                  onTouchEnd={() => handleTouchButton("d", false)}
                  onMouseDown={() => handleTouchButton("d", true)}
                  onMouseUp={() => handleTouchButton("d", false)}
                  onMouseLeave={() => handleTouchButton("d", false)}
                >
                  ►
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
