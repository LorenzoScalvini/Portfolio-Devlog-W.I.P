import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./Game.module.css"

// Asset imports
import ostAudio from "../../assets/game/ost.mp3"
import deathAudio from "../../assets/game/death.mp3"
import dangerAudio from "../../assets/game/danger.mp3"
import attackAudio from "../../assets/game/attack.mp3"
import flamecastAudio from "../../assets/game/flamecast.mp3"
import victoryAudio from "../../assets/game/victory.mp3"
import startVideo from "../../assets/game/start.mp4"
import startImage from "../../assets/game/start.png"
import heartImage from "../../assets/game/heart.png"
import asgoreAngryGif from "../../assets/game/asgore-angry.gif"
import asgoreGif from "../../assets/game/asgore.gif"
import flamesImage from "../../assets/game/flames.png"
import midImage from "../../assets/game/mid.png"
import winImage from "../../assets/game/win.png"

// Asgore voice audio imports
import asgoreTalk1 from "../../assets/game/asgoretalk1.mp3"
import asgoreTalk2 from "../../assets/game/asgoretalk2.mp3"
import asgoreTalk3 from "../../assets/game/asgoretalk3.mp3"

// GAME CONFIGURATION CONSTANTS
const GAME_CONFIG = {
  FLAME_SIZE: 24,
  HEART_SIZE: 24,
  BOX_SIZE: 280,
  MID_ATTACK_WIDTH: 80,
  MID_ATTACK_HEIGHT: 80,
  FLAME_ATTACK_DURATION: 12000,
  SPECIAL_ATTACK_DURATION: 5000,
  TRANSITION_DURATION: 2000,
  VICTORY_TIME: 154000,
}

// NARRATOR LINES FOR INTRO
const narratorLines = [
  "Una strana luce riempie la stanza.",
  "Il crepuscolo splende attraverso la barriera.",
  "Sembra che il tuo viaggio sia finalmente finito.",
  "Sei pieno di DETERMINAZIONE.",
]

// ASGORE DIALOGUE LINES - 10 lines
const asgoreLines = [
  "Sei determinato... ma non abbastanza!",
  "Il destino di tutti i mostri è sulle mie spalle!",
  "La tua ANIMA brucerà come fuoco ardente!",
  "Mostrami cosa sai fare, piccolo umano!",
  "Non posso permettermi di perdere!",
  "Il peso delle mie azioni mi schiaccia...",
  "Ogni mostro conta su di me!",
  "La barriera deve cadere!",
  "La tua DETERMINAZIONE è ammirevole!",
  "Dammi tutto ciò che hai!",
]

// Asgore voice audio array
const asgoreTalkAudios = [asgoreTalk1, asgoreTalk2, asgoreTalk3]

// FLAME WAVE TYPES
const flameWaveTypes = ["horizontal", "vertical", "diagonal", "circle_spiral", "circle_burst"]

// CREATE FLAME WAVE PATTERNS
const createFlameWave = (waveType) => {
  const { BOX_SIZE, FLAME_SIZE } = GAME_CONFIG
  const centerX = BOX_SIZE / 2
  const centerY = BOX_SIZE / 2
  
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
    case "circle_spiral":
      // 6 fiamme, più lente
      const spiralFlames = []
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        spiralFlames.push({
          id: 19 + i,
          x: centerX - FLAME_SIZE / 2,
          y: centerY - FLAME_SIZE / 2,
          dx: Math.cos(angle) * 0.8,
          dy: Math.sin(angle) * 0.8,
          isExpanding: true,
          currentRadius: 0,
          maxRadius: 140,
          angle: angle,
          speed: 1.2,
        })
      }
      return spiralFlames
    case "circle_burst":
      // 8 fiamme, più lente
      const burstFlames = []
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const speed = 1.0 + Math.random() * 0.6
        burstFlames.push({
          id: 31 + i,
          x: centerX - FLAME_SIZE / 2,
          y: centerY - FLAME_SIZE / 2,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          isBurst: true,
        })
      }
      return burstFlames
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
  const [attackCountdown, setAttackCountdown] = useState(GAME_CONFIG.FLAME_ATTACK_DURATION / 1000)
  const [flameCycleCount, setFlameCycleCount] = useState(0)

  // Projectile states
  const [visibleFlames, setVisibleFlames] = useState([])
  const [currentFlameWave, setCurrentFlameWave] = useState(0)

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

  // Victory and dialogue states
  const [gameWin, setGameWin] = useState(false)
  const [currentAsgoreLine, setCurrentAsgoreLine] = useState("")
  const [showAsgoreDialogue, setShowAsgoreDialogue] = useState(true)

  // Refs for input and timers
  const keys = useRef({ w: false, a: false, s: false, d: false })
  const intervalRef = useRef(null)
  const narratorIntervalRef = useRef(null)
  const angryAsgoreTimeoutRef = useRef(null)
  const warningAsgoreTimeoutRef = useRef(null)
  const attackCycleRef = useRef(null)
  const specialAttackCycleRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const waveChangeRef = useRef(null)
  const midAttackMoveIntervalRef = useRef(null)
  const redZoneTimeoutRef = useRef(null)
  const redZoneCountdownRef = useRef(null)
  const asgoreDialogueIntervalRef = useRef(null)
  const victoryTimeoutRef = useRef(null)
  const flameAttackTimeoutRef = useRef(null)

  // Audio refs
  const ostRef = useRef(null)
  const deathRef = useRef(null)
  const dangerRef = useRef(null)
  const attackRef = useRef(null)
  const flamecastRef = useRef(null)
  const victoryAudioRef = useRef(null)
  const videoRef = useRef(null)
  const asgoreTalkRefs = useRef([null, null, null])

  // Play flamecast audio when flame wave starts
  const playFlamecast = () => {
    if (flamecastRef.current) {
      flamecastRef.current.currentTime = 0
      flamecastRef.current.play().catch(e => console.log("Flamecast audio play error:", e))
    }
  }

  // Play random Asgore voice audio
  const playRandomAsgoreTalk = () => {
    const randomIndex = Math.floor(Math.random() * asgoreTalkAudios.length)
    const audio = asgoreTalkRefs.current[randomIndex]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(e => console.log("Asgore talk audio play error:", e))
    }
  }

  // Clear all timers function
  const clearAllTimers = () => {
    clearTimeout(attackCycleRef.current)
    clearTimeout(specialAttackCycleRef.current)
    clearTimeout(waveChangeRef.current)
    clearTimeout(redZoneTimeoutRef.current)
    clearTimeout(flameAttackTimeoutRef.current)
    clearInterval(countdownIntervalRef.current)
    clearInterval(midAttackMoveIntervalRef.current)
    clearInterval(redZoneCountdownRef.current)
  }

  // Start cycling Asgore dialogues
  const startAsgoreDialogueCycle = () => {
    const dialogueInterval = GAME_CONFIG.VICTORY_TIME / asgoreLines.length
    
    let dialogueIndex = 0
    setCurrentAsgoreLine(asgoreLines[dialogueIndex])
    playRandomAsgoreTalk()
    
    asgoreDialogueIntervalRef.current = setInterval(() => {
      if (gameState === "fight" && !gameWin) {
        dialogueIndex = (dialogueIndex + 1) % asgoreLines.length
        setCurrentAsgoreLine(asgoreLines[dialogueIndex])
        playRandomAsgoreTalk()
      }
    }, dialogueInterval)
  }

  // Trigger victory
  const triggerVictory = () => {
    if (gameWin || gameState !== "fight") return
    
    setGameWin(true)
    
    clearAllTimers()
    clearInterval(intervalRef.current)
    clearTimeout(victoryTimeoutRef.current)
    clearInterval(asgoreDialogueIntervalRef.current)
    clearInterval(midAttackMoveIntervalRef.current)
    
    setVisibleFlames([])
    setZoneActive(false)
    setMidAttack(prev => ({ ...prev, active: false }))
    
    setGameState("victory")
    
    if (ostRef.current) {
      ostRef.current.pause()
    }
    if (victoryAudioRef.current) {
      victoryAudioRef.current.currentTime = 0
      victoryAudioRef.current.play().catch(e => console.log("Victory audio play error:", e))
    }
  }

  // Update flames
  const updateFlames = (flames) => {
    const waveType = flameWaveTypes[currentFlameWave]
    return flames.map((flame) => {
      let newX = flame.x
      let newY = flame.y

      if (waveType === "circle_spiral" && flame.isExpanding) {
        if (flame.currentRadius < flame.maxRadius) {
          flame.currentRadius += flame.speed
          const centerX = GAME_CONFIG.BOX_SIZE / 2
          const centerY = GAME_CONFIG.BOX_SIZE / 2
          newX = centerX + Math.cos(flame.angle) * flame.currentRadius - GAME_CONFIG.FLAME_SIZE / 2
          newY = centerY + Math.sin(flame.angle) * flame.currentRadius - GAME_CONFIG.FLAME_SIZE / 2
        } else {
          newX = flame.x + flame.dx
          newY = flame.y + flame.dy
        }
      }
      else if (waveType === "circle_burst" && flame.isBurst) {
        newX = flame.x + flame.dx
        newY = flame.y + flame.dy
      }
      else {
        newX = flame.x + flame.dx
        newY = flame.y + flame.dy
      }

      if (newX > GAME_CONFIG.BOX_SIZE + 100) newX = -100 - GAME_CONFIG.FLAME_SIZE
      if (newX < -100 - GAME_CONFIG.FLAME_SIZE) newX = GAME_CONFIG.BOX_SIZE + 100
      if (newY > GAME_CONFIG.BOX_SIZE + 100) newY = -100 - GAME_CONFIG.FLAME_SIZE
      if (newY < -100 - GAME_CONFIG.FLAME_SIZE) newY = GAME_CONFIG.BOX_SIZE + 100

      return { ...flame, x: newX, y: newY }
    })
  }

  // Activate red zone for special attack
  const activateRedZoneForSpecial = () => {
    setRedZoneOnRight(Math.random() > 0.5)
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
    }, 2000)
    
    redZoneTimeoutRef.current = setTimeout(() => {
      setRedZoneDeadly(true)
      setShowAngryAsgore(true)
      angryAsgoreTimeoutRef.current = setTimeout(() => {
        setShowAngryAsgore(false)
      }, 500)
      
      if (attackRef.current) {
        attackRef.current.currentTime = 0
        attackRef.current.play().catch((e) => console.log("Audio play error:", e))
      }
    }, 2500)
    
    redZoneCountdownRef.current = setInterval(() => {
      setZoneCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(redZoneCountdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    setTimeout(() => {
      setZoneActive(false)
      setRedZoneDeadly(false)
      clearInterval(redZoneCountdownRef.current)
    }, 4500)
  }

  // Activate mid attack for special attack
  const activateMidAttackForSpecial = () => {
    const fromRight = Math.random() > 0.5
    setMidAttack({
      active: true,
      x: fromRight ? GAME_CONFIG.BOX_SIZE : -GAME_CONFIG.MID_ATTACK_WIDTH,
      y: Math.random() * (GAME_CONFIG.BOX_SIZE - GAME_CONFIG.MID_ATTACK_HEIGHT),
      speed: 2.0,
      direction: fromRight ? -1 : 1,
    })
    
    midAttackMoveIntervalRef.current = setInterval(() => {
      setMidAttack(prev => {
        if (!prev.active) {
          clearInterval(midAttackMoveIntervalRef.current)
          return prev
        }
        let newDirection = prev.direction
        let newX = prev.x + prev.speed * prev.direction
        
        if (newX > GAME_CONFIG.BOX_SIZE) {
          newDirection = -1
          newX = GAME_CONFIG.BOX_SIZE
        } else if (newX < -GAME_CONFIG.MID_ATTACK_WIDTH) {
          newDirection = 1
          newX = -GAME_CONFIG.MID_ATTACK_WIDTH
        }
        
        return { ...prev, x: newX, direction: newDirection }
      })
    }, 16)
    
    setTimeout(() => {
      clearInterval(midAttackMoveIntervalRef.current)
    }, GAME_CONFIG.SPECIAL_ATTACK_DURATION)
  }

  // Start special attack cycle
  const startSpecialAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("special")
    setVisibleFlames([])
    setAttackCountdown(GAME_CONFIG.SPECIAL_ATTACK_DURATION / 1000)
    
    activateRedZoneForSpecial()
    activateMidAttackForSpecial()
    
    specialAttackCycleRef.current = setTimeout(() => {
      setZoneActive(false)
      setRedZoneDeadly(false)
      setMidAttack(prev => ({ ...prev, active: false }))
      setShowAngryAsgore(false)
      setShowWarningAsgore(false)
      clearInterval(midAttackMoveIntervalRef.current)
      clearInterval(redZoneCountdownRef.current)
      clearTimeout(redZoneTimeoutRef.current)
      
      startFlameAttackCycle()
    }, GAME_CONFIG.SPECIAL_ATTACK_DURATION)
    
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

  // Change flame wave
  const changeFlameWave = (waveIndex) => {
    if (waveIndex < flameWaveTypes.length) {
      setCurrentFlameWave(waveIndex)
      setVisibleFlames(createFlameWave(flameWaveTypes[waveIndex]))
      playFlamecast()
      waveChangeRef.current = setTimeout(() => {
        changeFlameWave(waveIndex + 1)
      }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length)
    }
  }

  // Start flame attack cycle
  const startFlameAttackCycle = () => {
    clearAllTimers()
    setAttackPhase("flame")
    setCurrentFlameWave(0)
    setVisibleFlames(createFlameWave(flameWaveTypes[0]))
    setMidAttack(prev => ({ ...prev, active: false }))
    setZoneActive(false)
    setRedZoneDeadly(false)
    setAttackCountdown(GAME_CONFIG.FLAME_ATTACK_DURATION / 1000)
    
    playFlamecast()
    
    waveChangeRef.current = setTimeout(() => {
      changeFlameWave(1)
    }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length)
    
    flameAttackTimeoutRef.current = setTimeout(() => {
      setFlameCycleCount(prev => {
        const newCount = prev + 1
        if (newCount >= 2) {
          setFlameCycleCount(0)
          startTransitionToSpecial()
        } else {
          startTransitionToFlame()
        }
        return newCount
      })
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

  // Transition to next flame attack
  const startTransitionToFlame = () => {
    setAttackPhase("transition")
    setVisibleFlames([])
    setMidAttack(prev => ({ ...prev, active: false }))
    setZoneActive(false)
    setRedZoneDeadly(false)
    setTimeout(() => {
      startFlameAttackCycle()
    }, GAME_CONFIG.TRANSITION_DURATION)
  }

  // Transition to special attack
  const startTransitionToSpecial = () => {
    setAttackPhase("transition")
    setVisibleFlames([])
    setMidAttack(prev => ({ ...prev, active: false }))
    setZoneActive(false)
    setRedZoneDeadly(false)
    setTimeout(() => {
      startSpecialAttackCycle()
    }, GAME_CONFIG.TRANSITION_DURATION)
  }

  // Get Asgore image
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

  useEffect(() => {
    if (gameState === "loading") {
      const timer = setTimeout(() => setGameState("menu"), 1500)
      return () => clearTimeout(timer)
    }
  }, [gameState])

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

      if (redZoneDeadly) {
        const inRedZone = redZoneOnRight ? position.x > GAME_CONFIG.BOX_SIZE / 2 : position.x < GAME_CONFIG.BOX_SIZE / 2
        if (inRedZone) {
          setGameState("gameover")
        }
      }

      if (midAttack.active) {
        if (
          midAttack.x < position.x + GAME_CONFIG.HEART_SIZE &&
          midAttack.x + GAME_CONFIG.MID_ATTACK_WIDTH > position.x &&
          midAttack.y < position.y + GAME_CONFIG.HEART_SIZE &&
          midAttack.y + GAME_CONFIG.MID_ATTACK_HEIGHT > position.y
        ) {
          setGameState("gameover")
        }
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

  useEffect(() => {
    if (gameState === "fight") {
      setGameWin(false)
      setShowAsgoreDialogue(true)
      setFlameCycleCount(0)
      startFlameAttackCycle()
      startAsgoreDialogueCycle()
      
      victoryTimeoutRef.current = setTimeout(() => {
        triggerVictory()
      }, GAME_CONFIG.VICTORY_TIME)
    }
    return () => {
      clearAllTimers()
      clearInterval(midAttackMoveIntervalRef.current)
      clearTimeout(victoryTimeoutRef.current)
      clearInterval(asgoreDialogueIntervalRef.current)
    }
  }, [gameState])

  useEffect(() => {
    if (!showVideo) return
    const video = videoRef.current
    if (!video) return

    let fadeOutStarted = false
    const titleElement = document.querySelector(`.${styles.videoTitle}`)

    const handleTimeUpdate = () => {
      if (video.currentTime >= 19.0 && !fadeOutStarted) {
        fadeOutStarted = true
        if (titleElement) {
          titleElement.style.transition = 'opacity 1s ease-out'
          titleElement.style.opacity = '0'
        }
      }
    }

    const handleVideoEnd = () => {
      setShowVideo(false)
      setPosition({ x: 128, y: 128 })
      keys.current = { w: false, a: false, s: false, d: false }
      setVisibleFlames([])
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
      setFlameCycleCount(0)
      if (ostRef.current) {
        ostRef.current.currentTime = 0
      }
      startCountdown()
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleVideoEnd)

    const playVideo = async () => {
      try {
        video.volume = 0.2
        video.preload = "auto"
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
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleVideoEnd)
      if (titleElement) {
        titleElement.style.transition = ''
        titleElement.style.opacity = ''
      }
    }
  }, [showVideo])

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
      <audio ref={flamecastRef} src={flamecastAudio} />
      <audio ref={victoryAudioRef} src={victoryAudio} />
      
      {/* Asgore Talk Audio Elements */}
      <audio ref={el => asgoreTalkRefs.current[0] = el} src={asgoreTalk1} />
      <audio ref={el => asgoreTalkRefs.current[1] = el} src={asgoreTalk2} />
      <audio ref={el => asgoreTalkRefs.current[2] = el} src={asgoreTalk3} />

      {/* Intro Video */}
      {showVideo && (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            src={startVideo}
            className={styles.videoPlayer}
            autoPlay
            playsInline
            webkit-playsinline="true"
            preload="auto"
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          />
          <div className={styles.videoTitle}>{narratorLines[currentNarratorLine]}</div>
          <button onClick={skipVideo} className={styles.skipButton}>
            Salta
          </button>
        </div>
      )}

      {/* Loading Screen */}
      {gameState === "loading" && <div className={styles.countdownText} style={{ userSelect: "none" }}></div>}

      {/* Victory Screen */}
      {gameState === "victory" && !showVideo && (
        <div className={styles.victoryContainer}>
          <img src={winImage} alt="Victory" className={styles.victoryImage} />
          <div className={styles.victoryTextRainbow}>mi hai sconfitto...<br />la tua DETERMINAZIONE era troppa</div>
          <button onClick={goHome} className={styles.victoryHomeButton}>
            Torna alla Home
          </button>
        </div>
      )}

      {/* Menu and Game Over */}
      {(gameState === "menu" || gameState === "gameover") && !showVideo && gameState !== "victory" && (
        <div className={gameState === "menu" ? styles.menu : styles.retryMenu}>
          {gameState === "gameover" && (
            <>
              <div className={styles.retryText}>Non puoi arrenderti proprio ora...</div>
            </>
          )}
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
        </div>
      )}

      {/* Fight Screen */}
      {(gameState === "fight" || gameState === "countdown") && !showVideo && !gameWin && (
        <div className={styles.gameWrapper}>
          <div className={styles.attackNameDisplay}>
            {attackPhase === "flame" ? (
              <span className={styles.flameAttackName}>FLAMES</span>
            ) : attackPhase === "special" ? (
              <span className={styles.specialAttackName}>SPECIAL ATTACK</span>
            ) : (
              <span className={styles.transitionAttackName}>PROSSIMO ATTACCO</span>
            )}
          </div>
          
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

              <img
                src={heartImage || "/placeholder.svg"}
                alt="Heart"
                className={styles.heart}
                style={{ top: position.y, left: position.x }}
              />

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

              {attackPhase === "special" && midAttack.active && (
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

              {gameState === "countdown" && (
                <div className={styles.countdownText}>{countdown === 0 ? "" : countdown}</div>
              )}
            </div>
          </div>
          
          {showAsgoreDialogue && (
            <div className={styles.asgoreDialogue}>
              <span className={styles.asgoreName}>ASGORE:</span>
              <span className={styles.dialogueText}>"{currentAsgoreLine}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}