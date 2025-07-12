"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./Asgore.module.css"

const FLAME_SIZE = 32 // Increased from 15
const HEART_SIZE = 24 // Increased from 20
const BOX_SIZE = 280 // Reduced from 320
const MID_ATTACK_WIDTH = 80 // Increased from 64
const MID_ATTACK_HEIGHT = 80 // Increased from 64
const STAR_SIZE = 48 // Increased from 40
const FLAME_ATTACK_DURATION = 12000 // Reduced from 15000
const STAR_ATTACK_DURATION = 10000 // Reduced from 15000
const TRANSITION_DURATION = 2000 // New transition period

const narratorLines = [
  "A strange light fills the room.",
  "Twilight is shining through the barrier.",
  "It seems your journey is finally over.",
  "You're filled with DETERMINATION.",
]

// Improved flame patterns with varied speeds and directions
const createFlameWave = (waveType) => {
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
      // Cerchi di fiamme che si espandono dal centro con warning
      const centerX = BOX_SIZE / 2
      const centerY = BOX_SIZE / 2
      const flames = []

      // Primo cerchio (6 fiamme) - più prevedibile
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        flames.push({
          id: 19 + i,
          x: centerX - FLAME_SIZE / 2,
          y: centerY - FLAME_SIZE / 2,
          dx: Math.cos(angle) * 1.2, // Velocità ridotta
          dy: Math.sin(angle) * 1.2,
          isCircle: true,
          startRadius: 0,
          currentRadius: 0,
          maxRadius: 120,
          angle: angle,
          warningTime: 2000, // 2 secondi di warning
          showWarning: true,
        })
      }

      // Secondo cerchio (8 fiamme) - ritardato e più lento
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + Math.PI / 8 // Offset per alternare
        flames.push({
          id: 25 + i,
          x: centerX - FLAME_SIZE / 2,
          y: centerY - FLAME_SIZE / 2,
          dx: Math.cos(angle) * 1.0, // Ancora più lento
          dy: Math.sin(angle) * 1.0,
          isCircle: true,
          startRadius: 0,
          currentRadius: 0,
          maxRadius: 120,
          angle: angle,
          delay: 2500, // Ritardo di 2.5 secondi
          warningTime: 2000,
          showWarning: true,
        })
      }

      return flames
    default:
      return []
  }
}

// Enhanced star patterns with more complex movements
const createStarFormation = (formationType) => {
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

const Asgore = () => {
  const [position, setPosition] = useState({ x: 128, y: 128 }) // Centered in 280px box
  const keys = useRef({ w: false, a: false, s: false, d: false })
  const [gameState, setGameState] = useState("loading")
  const [countdown, setCountdown] = useState(3)
  const [zoneActive, setZoneActive] = useState(false)
  const [zoneCountdown, setZoneCountdown] = useState(3)
  const [redZoneOnRight, setRedZoneOnRight] = useState(true)
  const [redZoneDeadly, setRedZoneDeadly] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [currentNarratorLine, setCurrentNarratorLine] = useState(0)
  const [midAttack, setMidAttack] = useState({
    active: false,
    x: -MID_ATTACK_WIDTH,
    y: BOX_SIZE / 2 - MID_ATTACK_HEIGHT / 2,
    speed: 1.5, // Molto più lento
    direction: 1,
  })
  const [showAngryAsgore, setShowAngryAsgore] = useState(false)
  const [showWarningAsgore, setShowWarningAsgore] = useState(false) // Nuovo state per warning
  const [isStarAttack, setIsStarAttack] = useState(false)
  const [attackCountdown, setAttackCountdown] = useState(FLAME_ATTACK_DURATION / 1000)
  const [starAttackCountdown, setStarAttackCountdown] = useState(STAR_ATTACK_DURATION / 1000)
  const [visibleFlames, setVisibleFlames] = useState([])
  const [visibleStars, setVisibleStars] = useState([])
  const [currentFlameWave, setCurrentFlameWave] = useState(0)
  const [currentStarFormation, setCurrentStarFormation] = useState(0)
  const [attackPhase, setAttackPhase] = useState("transition") // 'flame', 'star', 'transition'
  const [difficultyLevel, setDifficultyLevel] = useState(1)
  // Aggiungi questo nuovo state per i warning circles
  const [circleWarnings, setCircleWarnings] = useState([])

  // Refs
  const intervalRef = useRef(null)
  const zoneIntervalRef = useRef(null)
  const zoneTimerRef = useRef(null)
  const narratorIntervalRef = useRef(null)
  const midAttackIntervalRef = useRef(null)
  const angryAsgoreTimeoutRef = useRef(null)
  const warningAsgoreTimeoutRef = useRef(null) // Nuovo ref per warning timeout
  const attackCycleRef = useRef(null)
  const starAttackCycleRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const waveChangeRef = useRef(null)
  const ostRef = useRef(null)
  const deathRef = useRef(null)
  const dangerRef = useRef(null)
  const attackRef = useRef(null)
  const videoRef = useRef(null)

  const flameWaveTypes = ["horizontal", "vertical", "diagonal", "circle"]
  const starFormationTypes = ["straight", "vertical", "diagonal"]

  // Clear all timers function
  const clearAllTimers = () => {
    clearTimeout(attackCycleRef.current)
    clearTimeout(starAttackCycleRef.current)
    clearTimeout(waveChangeRef.current)
    clearInterval(countdownIntervalRef.current)
  }

  // Start flame attack cycle with wave changes
  const startFlameAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("flame")
    setIsStarAttack(false)
    setCurrentFlameWave(0)
    setVisibleFlames(createFlameWave(flameWaveTypes[0]))
    setVisibleStars([])
    setAttackCountdown(FLAME_ATTACK_DURATION / 1000)

    // Change flame waves during the attack
    const changeWave = (waveIndex) => {
      if (waveIndex < flameWaveTypes.length) {
        setCurrentFlameWave(waveIndex)
        setVisibleFlames(createFlameWave(flameWaveTypes[waveIndex]))

        waveChangeRef.current = setTimeout(() => {
          changeWave(waveIndex + 1)
        }, FLAME_ATTACK_DURATION / flameWaveTypes.length)
      }
    }

    // Start wave changes after initial wave
    waveChangeRef.current = setTimeout(() => {
      changeWave(1)
    }, FLAME_ATTACK_DURATION / flameWaveTypes.length)

    attackCycleRef.current = setTimeout(() => {
      startTransition(() => startStarAttackCycle())
    }, FLAME_ATTACK_DURATION)

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

  // Start star attack cycle with formation changes
  const startStarAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("star")
    setIsStarAttack(true)
    setCurrentStarFormation(0)
    setVisibleFlames([])
    setVisibleStars(createStarFormation(starFormationTypes[0]))
    setMidAttack((prev) => ({ ...prev, active: false }))
    setStarAttackCountdown(STAR_ATTACK_DURATION / 1000)

    // Change star formations during the attack
    const changeFormation = (formationIndex) => {
      if (formationIndex < starFormationTypes.length) {
        setCurrentStarFormation(formationIndex)
        setVisibleStars(createStarFormation(starFormationTypes[formationIndex]))

        waveChangeRef.current = setTimeout(() => {
          changeFormation(formationIndex + 1)
        }, STAR_ATTACK_DURATION / starFormationTypes.length)
      }
    }

    // Start formation changes
    waveChangeRef.current = setTimeout(() => {
      changeFormation(1)
    }, STAR_ATTACK_DURATION / starFormationTypes.length)

    starAttackCycleRef.current = setTimeout(() => {
      setDifficultyLevel((prev) => prev + 1) // Increase difficulty
      startTransition(() => startFlameAttackCycle())
    }, STAR_ATTACK_DURATION)

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

  // Transition period between attacks
  const startTransition = (nextAttack) => {
    setAttackPhase("transition")
    setVisibleFlames([])
    setVisibleStars([])

    setTimeout(() => {
      nextAttack()
    }, TRANSITION_DURATION)
  }

  // Enhanced star movement with different patterns
  const updateStars = (stars) => {
    return stars.map((star) => {
      let newX = star.x + star.dx
      let newY = star.y + star.dy
      const newAngle = star.angle + star.rotationSpeed

      // Simple wraparound when stars go off screen
      if (newX > BOX_SIZE + 100) newX = -100 - STAR_SIZE
      if (newX < -100 - STAR_SIZE) newX = BOX_SIZE + 100
      if (newY > BOX_SIZE + 100) newY = -100 - STAR_SIZE
      if (newY < -100 - STAR_SIZE) newY = BOX_SIZE + 100

      return {
        ...star,
        x: newX,
        y: newY,
        angle: newAngle,
      }
    })
  }

  // Enhanced flame movement with circle pattern
  const updateFlames = (flames) => {
    const waveType = flameWaveTypes[currentFlameWave]

    return flames.map((flame) => {
      let newX = flame.x
      let newY = flame.y

      if (waveType === "circle" && flame.isCircle) {
        // Gestione warning
        if (flame.warningTime > 0) {
          flame.warningTime -= 16
          return flame
        }

        // Gestione ritardo
        if (flame.delay && flame.delay > 0) {
          flame.delay -= 16
          return flame
        }

        // Espansione graduale più lenta
        if (flame.currentRadius < flame.maxRadius) {
          flame.currentRadius += 1.5 // Velocità di espansione ridotta
          const centerX = BOX_SIZE / 2
          const centerY = BOX_SIZE / 2
          newX = centerX + Math.cos(flame.angle) * flame.currentRadius - FLAME_SIZE / 2
          newY = centerY + Math.sin(flame.angle) * flame.currentRadius - FLAME_SIZE / 2
        } else {
          // Continua a muoversi verso l'esterno più lentamente
          newX = flame.x + flame.dx * 0.8 // Rallentato
          newY = flame.y + flame.dy * 0.8
        }
      } else {
        newX = flame.x + flame.dx
        newY = flame.y + flame.dy
      }

      // Reset position when off screen
      if (flame.dx > 0 && newX > BOX_SIZE + 100) newX = -100 - FLAME_SIZE
      if (flame.dx < 0 && newX < -100 - FLAME_SIZE) newX = BOX_SIZE + 100
      if (flame.dy > 0 && newY > BOX_SIZE + 100) newY = -100 - FLAME_SIZE
      if (flame.dy < 0 && newY < -100 - FLAME_SIZE) newY = BOX_SIZE + 100

      return { ...flame, x: newX, y: newY }
    })
  }

  // Narrator effect
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

  // Game state management
  useEffect(() => {
    if (gameState === "loading") {
      const timer = setTimeout(() => setGameState("menu"), 1500)
      return () => clearTimeout(timer)
    }
  }, [gameState])

  // Input handling and movement
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
        const speed = 3 // Constant speed, remove difficulty scaling
        let { x, y } = prev

        if (keys.current.w) y -= speed
        if (keys.current.s) y += speed
        if (keys.current.a) x -= speed
        if (keys.current.d) x += speed

        x = Math.max(0, Math.min(BOX_SIZE - HEART_SIZE, x))
        y = Math.max(0, Math.min(BOX_SIZE - HEART_SIZE, y))

        return { x, y }
      })

      // Update flames during flame attack
      if (attackPhase === "flame") {
        setVisibleFlames((prevFlames) => {
          const newFlames = updateFlames(prevFlames)

          // Collision detection with flames
          for (const flame of newFlames) {
            if (
              flame.x < position.x + HEART_SIZE &&
              flame.x + FLAME_SIZE > position.x &&
              flame.y < position.y + HEART_SIZE &&
              flame.y + FLAME_SIZE > position.y
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

          // Collision detection with stars
          for (const star of newStars) {
            if (
              star.x < position.x + HEART_SIZE &&
              star.x + STAR_SIZE > position.x &&
              star.y < position.y + HEART_SIZE &&
              star.y + STAR_SIZE > position.y
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
        const inRedZone = redZoneOnRight ? position.x > BOX_SIZE / 2 : position.x < BOX_SIZE / 2

        if (inRedZone) {
          setGameState("gameover")
        }
      }

      // Mid attack movement and collision
      if (midAttack.active) {
        setMidAttack((prev) => {
          const newX = prev.x + prev.speed * prev.direction

          if ((prev.direction === 1 && newX > BOX_SIZE) || (prev.direction === -1 && newX < -MID_ATTACK_WIDTH)) {
            return { ...prev, active: false }
          }

          if (
            newX < position.x + HEART_SIZE &&
            newX + MID_ATTACK_WIDTH > position.x &&
            prev.y < position.y + HEART_SIZE &&
            prev.y + MID_ATTACK_HEIGHT > position.y
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

  // Countdown management
  const startCountdown = () => {
    setCountdown(3)
    setGameState("countdown")
  }

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

  // Zone attack management with improved timing
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
      setShowWarningAsgore(true) // Mostra warning Asgore

      if (dangerRef.current) {
        dangerRef.current.currentTime = 0
        dangerRef.current.play().catch((e) => console.log("Audio play error:", e))
      }

      // Nascondi warning Asgore dopo 2.5 secondi
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
      }, 4000) // Slightly longer deadly period

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

    // More frequent zone attacks with difficulty scaling
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

  // Mid attack management with better timing
  useEffect(() => {
    if (gameState !== "fight") {
      setMidAttack((prev) => ({ ...prev, active: false }))
      clearInterval(midAttackIntervalRef.current)
      return
    }

    const activateMidAttack = () => {
      if (attackPhase === "star") return // No mid attacks during star phase

      const fromRight = Math.random() > 0.5
      setMidAttack({
        active: true,
        x: fromRight ? BOX_SIZE : -MID_ATTACK_WIDTH,
        y: Math.random() * (BOX_SIZE - MID_ATTACK_HEIGHT),
        speed: 1.5, // Molto più lento
        direction: fromRight ? -1 : 1,
      })
    }

    // More frequent mid attacks with difficulty scaling
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
      setDifficultyLevel(1) // Reset difficulty
      startFlameAttackCycle()
    }

    return () => {
      clearAllTimers()
    }
  }, [gameState])

  // Video management
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
        x: -MID_ATTACK_WIDTH,
        y: BOX_SIZE / 2 - MID_ATTACK_HEIGHT / 2,
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

  // Menu functions
  const startFight = () => {
    if (deathRef.current) {
      deathRef.current.pause()
      deathRef.current.currentTime = 0
    }
    setShowVideo(true)
  }

  const skipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.dispatchEvent(new Event("ended"))
    }
  }

  // Determina quale immagine di Asgore mostrare
  const getAsgoreImage = () => {
    if (showAngryAsgore) return "asgore-angry.gif"
    if (showWarningAsgore) return "asgore.gif"
    return "asgore.gif"
  }

  return (
    <div className={styles.container}>
      <audio ref={ostRef} src="ost.mp3" />
      <audio ref={deathRef} src="death.mp3" />
      <audio ref={dangerRef} src="danger.mp3" />
      <audio ref={attackRef} src="attack.mp3" />

      {showVideo && (
        <div className={styles.videoContainer}>
          <video ref={videoRef} src="start.mp4" className={styles.videoPlayer} autoPlay playsInline />
          <div className={styles.videoTitle}>{narratorLines[currentNarratorLine]}</div>
          <button onClick={skipVideo} className={styles.skipButton}>
            Skip
          </button>
        </div>
      )}

      {gameState === "loading" && <div className={styles.countdownText} style={{ userSelect: "none" }}></div>}

      {(gameState === "menu" || gameState === "gameover") && !showVideo && (
        <div className={gameState === "menu" ? styles.menu : styles.retryMenu}>
          {gameState === "gameover" && <div className={styles.retryText}>You cannot give up just yet...</div>}

          <img src="start.png" alt="Start Image" className={styles.startImage} />

          <button onClick={startFight} className={styles.menuButton}>
            <img src="heart.png" alt="Heart" className={styles.menuHeart} />
            Determination
          </button>

          <div className={styles.controlsHint}>Use WASD keys to move</div>
        </div>
      )}

      {(gameState === "fight" || gameState === "countdown") && !showVideo && (
        <div className={styles.gameWrapper}>
          <div className={styles.battleLayout}>
            <img src={getAsgoreImage() || "/placeholder.svg"} alt="Asgore" className={styles.asgore} />
            <div className={styles.box}>
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
              <img src="heart.png" alt="Heart" className={styles.heart} style={{ top: position.y, left: position.x }} />
              {attackPhase === "flame" &&
                visibleFlames.map((flame) => (
                  <img
                    key={flame.id}
                    src="flames.png"
                    alt="Flame"
                    className={styles.flame}
                    style={{ top: flame.y, left: flame.x }}
                    draggable={false}
                  />
                ))}
              {attackPhase === "flame" &&
                currentFlameWave === 3 && // Solo durante circle attack
                visibleFlames
                  .filter((flame) => flame.isCircle && flame.warningTime > 0)
                  .map((flame) => (
                    <div
                      key={`warning-${flame.id}`}
                      className={styles.circleWarning}
                      style={{
                        top: BOX_SIZE / 2 - 60,
                        left: BOX_SIZE / 2 - 60,
                        width: "120px",
                        height: "120px",
                        transform: `rotate(${flame.angle}rad)`,
                      }}
                    />
                  ))}
              {attackPhase === "star" &&
                visibleStars.map((star) => (
                  <img
                    key={star.id}
                    src="/star.png" // Replace with your star.png path, e.g., "/star.png"
                    alt="Star"
                    className={styles.star}
                    style={{
                      top: star.y,
                      left: star.x,
                      transform: `rotate(${star.angle}rad)`,
                      width: `${STAR_SIZE}px`,
                      height: `${STAR_SIZE}px`,
                    }}
                    draggable={false}
                  />
                ))}
              {attackPhase === "flame" && midAttack.active && (
                <img
                  src="mid.png"
                  alt="Mid Attack"
                  className={styles.midAttack}
                  style={{
                    top: midAttack.y,
                    left: midAttack.x,
                    width: `${MID_ATTACK_WIDTH}px`,
                    height: `${MID_ATTACK_HEIGHT}px`,
                  }}
                  draggable={false}
                />
              )}
              {gameState === "countdown" && (
                <div className={styles.countdownText}>{countdown === 0 ? "" : countdown}</div>
              )}
              <div className={styles.attackInfo}>
                {attackPhase === "star" ? (
                  <div className={styles.starAttackText}>
                    ★ Star Attack: {starAttackCountdown}s | Level {difficultyLevel}
                  </div>
                ) : attackPhase === "flame" ? (
                  <div className={styles.flameAttackText}>
                    🔥 Flame Attack: {attackCountdown}s | Level {difficultyLevel}
                  </div>
                ) : (
                  <div className={styles.transitionText}>⚡ Preparing next attack...</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.controlsHint}>Use WASD keys to move</div>
        </div>
      )}
    </div>
  )
}

export default Asgore
