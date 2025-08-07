import { useEffect, useRef, useState } from "react" // Importa hook React per gestione stato, riferimenti e effetti collaterali
import { useNavigate } from "react-router-dom" // Hook per la navigazione programmatica (presuppone l'uso di react-router-dom)
import styles from "./Games.module.css" // Importa i moduli CSS per lo styling

// CONFIGURAZIONE DELLE COSTANTI DI GIOCO
// Questo oggetto contiene tutte le dimensioni e durate fisse utilizzate nel gioco.
const GAME_CONFIG = {
  FLAME_SIZE: 24, // Dimensione (larghezza/altezza) delle fiamme
  HEART_SIZE: 24, // Dimensione del cuore del giocatore
  BOX_SIZE: 280, // Dimensione del riquadro di gioco (area di battaglia)
  MID_ATTACK_WIDTH: 80, // Larghezza dell'attacco centrale (il "doggo")
  MID_ATTACK_HEIGHT: 80, // Altezza dell'attacco centrale
  STAR_SIZE: 32, // Dimensione delle stelle
  FLAME_ATTACK_DURATION: 12000, // Durata totale di un ciclo di attacchi di fiamme (in ms)
  STAR_ATTACK_DURATION: 10000, // Durata totale di un ciclo di attacchi di stelle (in ms)
  TRANSITION_DURATION: 2000, // Durata della transizione tra un tipo di attacco e l'altro (in ms)
}

// ARRAY TESTI NARRATORE / INTRODUZIONE
// Queste frasi vengono mostrate durante il video introduttivo.
const narratorLines = [
  "Una strana luce riempie la stanza.",
  "Il crepuscolo splende attraverso la barriera.",
  "Sembra che il tuo viaggio sia finalmente finito.",
  "Sei pieno di DETERMINAZIONE.",
]

// CREAZIONE FORMAZIONI DI FIAMME PER ATTACCHI & PATTERN
// Questa funzione genera un array di oggetti "fiamma" con le loro proprietà iniziali
// (posizione x, y, velocità dx, dy) in base al tipo di onda specificato.
const createFlameWave = (waveType) => {
  const { BOX_SIZE, FLAME_SIZE } = GAME_CONFIG // Destruttura le costanti necessarie

  switch (waveType) {
    // FORMAZIONE ATTACCHI FIAMME ORIZZONTALI: fiamme che si muovono solo orizzontalmente
    case "horizontal":
      return [
        { id: 1, x: -80, y: 60, dx: 2.0, dy: 0 }, // dx > 0: si muove da sinistra a destra
        { id: 2, x: BOX_SIZE + 80, y: 120, dx: -2.3, dy: 0 }, // dx < 0: si muove da destra a sinistra
        { id: 3, x: -100, y: 180, dx: 1.8, dy: 0 },
        { id: 4, x: BOX_SIZE + 100, y: 240, dx: -2.1, dy: 0 },
        { id: 5, x: -60, y: 30, dx: 2.5, dy: 0 },
        { id: 6, x: BOX_SIZE + 60, y: 90, dx: -2.7, dy: 0 },
      ]
    // FORMAZIONE ATTACCHI FIAMME VERTICALI: fiamme che si muovono solo verticalmente
    case "vertical":
      return [
        { id: 7, x: 60, y: -80, dx: 0, dy: 2.0 }, // dy > 0: si muove dall'alto verso il basso
        { id: 8, x: 120, y: BOX_SIZE + 80, dx: 0, dy: -2.3 }, // dy < 0: si muove dal basso verso l'alto
        { id: 9, x: 180, y: -100, dx: 0, dy: 1.8 },
        { id: 10, x: 240, y: BOX_SIZE + 100, dx: 0, dy: -2.1 },
        { id: 11, x: 30, y: -60, dx: 0, dy: 2.5 },
        { id: 12, x: 90, y: BOX_SIZE + 60, dx: 0, dy: -2.7 },
      ]
    // FORMAZIONE ATTACCHI FIAMME DIAGONALI: fiamme che si muovono in diagonale
    case "diagonal":
      return [
        { id: 13, x: -80, y: -80, dx: 1.6, dy: 1.6 }, // Diagonale in basso a destra
        { id: 14, x: BOX_SIZE + 80, y: BOX_SIZE + 80, dx: -1.8, dy: -1.8 }, // Diagonale in alto a sinistra
        { id: 15, x: -100, y: BOX_SIZE + 100, dx: 2.0, dy: -2.0 }, // Diagonale in alto a destra
        { id: 16, x: BOX_SIZE + 100, y: -100, dx: -2.2, dy: 2.2 }, // Diagonale in basso a sinistra
        { id: 17, x: -60, y: -60, dx: 1.4, dy: 1.4 },
        { id: 18, x: BOX_SIZE + 60, y: BOX_SIZE + 60, dx: -1.6, dy: -1.6 },
      ]

    case "circle":
      // FORMAZIONE ATTACCHI FIAMME CENTRALE (circolare): fiamme che partono dal centro e si espandono
      const centerX = BOX_SIZE / 2
      const centerY = BOX_SIZE / 2
      const flames = []

      // Prima fase: 6 fiamme che si espandono dal centro
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6 // Calcola l'angolo per distribuire le fiamme in un cerchio
        flames.push({
          id: 19 + i,
          x: centerX - FLAME_SIZE / 2, // Posizione iniziale al centro
          y: centerY - FLAME_SIZE / 2,
          dx: Math.cos(angle) * 1.2, // Componente X della velocità basata sull'angolo
          dy: Math.sin(angle) * 1.2, // Componente Y della velocità basata sull'angolo
          isCircle: true, // Flag per indicare che è un attacco circolare
          startRadius: 0, // Raggio iniziale
          currentRadius: 0, // Raggio corrente (per l'espansione)
          maxRadius: 120, // Raggio massimo di espansione iniziale
          angle: angle, // Angolo per il movimento circolare
          warningTime: 2000, // Tempo di avviso prima che la fiamma diventi attiva (in ms)
          showWarning: true, // Flag per mostrare l'avviso visivo
        })
      }

      // Seconda fase: 8 fiamme con un leggero ritardo, per un secondo cerchio
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + Math.PI / 8 // Angolo sfalsato per il secondo cerchio
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
          delay: 2500, // Ritardo prima che questa fiamma inizi a muoversi
          warningTime: 2000,
          showWarning: true,
        })
      }

      return flames

    default:
      return [] // Ritorna un array vuoto se il tipo non è riconosciuto
  }
}

// CREAZIONE FORMAZIONI DI ATTACCHI STELLLARI & PATTERN
// Simile a createFlameWave, ma per gli attacchi a forma di stella.
const createStarFormation = (formationType) => {
  const { BOX_SIZE } = GAME_CONFIG

  switch (formationType) {
    // FORMAZIONE ATTACCHI STELLE ORIZZONTALI
    case "straight":
      return [
        { id: 1, x: -100, y: 70, dx: 1.4, dy: 0, angle: 0, rotationSpeed: 0.05 }, // dx > 0: si muove da sinistra a destra
        { id: 2, x: -100, y: 140, dx: 1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
        { id: 3, x: -100, y: 210, dx: 1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
        { id: 4, x: BOX_SIZE + 100, y: 100, dx: -1.4, dy: 0, angle: 0, rotationSpeed: 0.05 }, // dx < 0: si muove da destra a sinistra
        { id: 5, x: BOX_SIZE + 100, y: 170, dx: -1.4, dy: 0, angle: 0, rotationSpeed: 0.05 },
      ]
    // FORMAZIONE ATTACCHI STELLE VERTICALI
    case "vertical":
      return [
        { id: 6, x: 70, y: -100, dx: 0, dy: 1.4, angle: 0, rotationSpeed: 0.05 }, // dy > 0: si muove dall'alto verso il basso
        { id: 7, x: 140, y: -100, dx: 0, dy: 1.4, angle: 0, rotationSpeed: 0.05 },
        { id: 8, x: 210, y: -100, dx: 0, dy: 1.4, angle: 0, rotationSpeed: 0.05 },
        { id: 9, x: 100, y: BOX_SIZE + 100, dx: 0, dy: -1.4, angle: 0, rotationSpeed: 0.05 }, // dy < 0: si muove dal basso verso l'alto
        { id: 10, x: 170, y: BOX_SIZE + 100, dx: 0, dy: -1.4, angle: 0, rotationSpeed: 0.05 },
      ]
    // FORMAZIONE ATTACCHI STELLE DIAGONALI
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

// COMPONENTE PRINCIPALE DI RITORNO "ASGORE"
export default function Games() {
  const navigate = useNavigate() // Inizializza l'hook per la navigazione

  // Stati principali del gioco
  const [gameState, setGameState] = useState("loading") // Stato attuale del gioco: "loading", "menu", "countdown", "fight", "gameover"
  const [position, setPosition] = useState({ x: 128, y: 128 }) // Posizione (x, y) del cuore del giocatore all'interno del riquadro di gioco
  const [countdown, setCountdown] = useState(3) // Conto alla rovescia prima dell'inizio del combattimento

  // Stati introduttivi / start video e narratore
  const [showVideo, setShowVideo] = useState(false) // Controlla la visibilità del video introduttivo
  const [currentNarratorLine, setCurrentNarratorLine] = useState(0) // Indice della riga corrente del narratore

  // Stati attacco ad area (zona rossa) deadly & non deadly
  const [zoneActive, setZoneActive] = useState(false) // Indica se la zona rossa è attiva
  const [zoneCountdown, setZoneCountdown] = useState(3) // Conto alla rovescia per la zona rossa
  const [redZoneOnRight, setRedZoneOnRight] = useState(true) // Determina se la zona rossa è a destra o a sinistra
  const [redZoneDeadly, setRedZoneDeadly] = useState(false) // Indica se la zona rossa è letale (causa game over)

  // Stati per attacchi star & flames
  const [attackPhase, setAttackPhase] = useState("transition") // Fase attuale dell'attacco: "flame", "star", "transition"
  const [isStarAttack, setIsStarAttack] = useState(false) // Flag per indicare se l'attacco corrente è di stelle
  const [attackCountdown, setAttackCountdown] = useState(GAME_CONFIG.FLAME_ATTACK_DURATION / 1000) // Countdown per l'attacco di fiamme
  const [starAttackCountdown, setStarAttackCountdown] = useState(GAME_CONFIG.STAR_ATTACK_DURATION / 1000) // Countdown per l'attacco di stelle
  const [difficultyLevel, setDifficultyLevel] = useState(1) // Livello di difficoltà attuale, aumenta nel tempo

  // Stati per la gestione delle fiamme e stelle visibili & (projectiles)
  const [visibleFlames, setVisibleFlames] = useState([]) // Array delle fiamme attualmente visibili e attive
  const [visibleStars, setVisibleStars] = useState([]) // Array delle stelle attualmente visibili e attive
  const [currentFlameWave, setCurrentFlameWave] = useState(0) // Indice dell'onda di fiamme corrente
  const [currentStarFormation, setCurrentStarFormation] = useState(0) // Indice della formazione di stelle corrente

  // Stati per l'attacco centrale ovvero il doggo!!!
  const [midAttack, setMidAttack] = useState({
    active: false, // Indica se l'attacco centrale è attivo
    x: -GAME_CONFIG.MID_ATTACK_WIDTH, // Posizione X iniziale (fuori schermo)
    y: GAME_CONFIG.BOX_SIZE / 2 - GAME_CONFIG.MID_ATTACK_HEIGHT / 2, // Posizione Y (centrata verticalmente)
    speed: 1.5, // Velocità dell'attacco centrale
    direction: 1, // Direzione (1 per destra, -1 per sinistra)
  })

  // Stati asgore WARNING & ANGRY attacco ad area
  const [showAngryAsgore, setShowAngryAsgore] = useState(false) // Controlla la visibilità di Asgore arrabbiato
  const [showWarningAsgore, setShowWarningAsgore] = useState(false) // Controlla la visibilità di Asgore in avviso

  // Riferimenti per controllo input e timer
  // Usiamo useRef per mantenere i valori persistenti tra i render senza causare re-render
  const keys = useRef({ w: false, a: false, s: false, d: false }) // Stato dei tasti WASD premuti
  const intervalRef = useRef(null) // Riferimento all'intervallo principale di gioco (movimento, collisioni)
  const zoneIntervalRef = useRef(null) // Riferimento all'intervallo per l'attivazione delle zone rosse
  const zoneTimerRef = useRef(null) // Riferimento al timeout per la durata della zona rossa
  const narratorIntervalRef = useRef(null) // Riferimento all'intervallo per i testi del narratore
  const midAttackIntervalRef = useRef(null) // Riferimento all'intervallo per l'attacco centrale
  const angryAsgoreTimeoutRef = useRef(null) // Riferimento al timeout per l'immagine di Asgore arrabbiato
  const warningAsgoreTimeoutRef = useRef(null) // Riferimento al timeout per l'immagine di Asgore in avviso
  const attackCycleRef = useRef(null) // Riferimento al timeout per il cambio di ciclo di attacco (fiamme/stelle)
  const starAttackCycleRef = useRef(null) // Riferimento al timeout per il ciclo di attacco delle stelle
  const countdownIntervalRef = useRef(null) // Riferimento all'intervallo per il countdown degli attacchi
  const waveChangeRef = useRef(null) // Riferimento al timeout per il cambio di onda/formazione all'interno di un ciclo di attacco

  // Riferimenti audio
  const ostRef = useRef(null) // Riferimento all'audio della colonna sonora (OST)
  const deathRef = useRef(null) // Riferimento all'audio di morte
  const dangerRef = useRef(null) // Riferimento all'audio di pericolo (per la zona rossa)
  const attackRef = useRef(null) // Riferimento all'audio di attacco (per la zona rossa letale)
  const videoRef = useRef(null) // Riferimento all'elemento video

  // Array Pattern di attacco
  const flameWaveTypes = ["horizontal", "vertical", "diagonal", "circle"] // Tipi di onde di fiamme disponibili
  const starFormationTypes = ["straight", "vertical", "diagonal"] // Tipi di formazioni di stelle disponibili

  // Funzione per pulire tutti i timer e intervalli attivi
  const clearAllTimers = () => {
    clearTimeout(attackCycleRef.current)
    clearTimeout(starAttackCycleRef.current)
    clearTimeout(waveChangeRef.current)
    clearInterval(countdownIntervalRef.current)
  }

  // Animazione e movimento stelle
  // Aggiorna la posizione e la rotazione di ogni stella.
  const updateStars = (stars) => {
    return stars.map((star) => {
      let newX = star.x + star.dx // Aggiorna posizione X
      let newY = star.y + star.dy // Aggiorna posizione Y
      const newAngle = star.angle + star.rotationSpeed // Aggiorna angolo di rotazione

      // Riposiziona le stelle quando escono dallo schermo per creare un effetto continuo
      if (newX > GAME_CONFIG.BOX_SIZE + 100) newX = -100 - GAME_CONFIG.STAR_SIZE
      if (newX < -100 - GAME_CONFIG.STAR_SIZE) newX = GAME_CONFIG.BOX_SIZE + 100
      if (newY > GAME_CONFIG.BOX_SIZE + 100) newY = -100 - GAME_CONFIG.STAR_SIZE
      if (newY < -100 - GAME_CONFIG.STAR_SIZE) newY = GAME_CONFIG.BOX_SIZE + 100

      return { ...star, x: newX, y: newY, angle: newAngle } // Ritorna la stella aggiornata
    })
  }

  // Gestione movimento fiamme con pattern speciali
  // Aggiorna la posizione di ogni fiamma, con logica speciale per l'attacco circolare.
  const updateFlames = (flames) => {
    const waveType = flameWaveTypes[currentFlameWave] // Ottiene il tipo di onda corrente

    return flames.map((flame) => {
      let newX = flame.x
      let newY = flame.y

      if (waveType === "circle" && flame.isCircle) {
        // Gestione warning per attacco circolare: riduce il tempo di avviso
        if (flame.warningTime > 0) {
          flame.warningTime -= 16 // Riduce il tempo di avviso (16ms è circa un frame a 60fps)
          return flame // Non muove la fiamma finché il warning è attivo
        }

        // Gestione ritardo per secondo cerchio: riduce il ritardo
        if (flame.delay && flame.delay > 0) {
          flame.delay -= 16
          return flame // Non muove la fiamma finché il ritardo è attivo
        }

        // Espansione graduale del cerchio: la fiamma si muove verso l'esterno dal centro
        if (flame.currentRadius < flame.maxRadius) {
          flame.currentRadius += 1.5 // Aumenta il raggio
          const centerX = GAME_CONFIG.BOX_SIZE / 2
          const centerY = GAME_CONFIG.BOX_SIZE / 2
          // Calcola la nuova posizione basata sul raggio e sull'angolo
          newX = centerX + Math.cos(flame.angle) * flame.currentRadius - GAME_CONFIG.FLAME_SIZE / 2
          newY = centerY + Math.sin(flame.angle) * flame.currentRadius - GAME_CONFIG.FLAME_SIZE / 2
        } else {
          // Continua movimento verso esterno una volta raggiunto il raggio massimo
          newX = flame.x + flame.dx * 0.8
          newY = flame.y + flame.dy * 0.8
        }
      } else {
        // Movimento normale per altri pattern (orizzontale, verticale, diagonale)
        newX = flame.x + flame.dx
        newY = flame.y + flame.dy
      }

      // Riposiziona fiamme quando escono dallo schermo per un effetto continuo
      if (flame.dx > 0 && newX > GAME_CONFIG.BOX_SIZE + 100) newX = -100 - GAME_CONFIG.FLAME_SIZE
      if (flame.dx < 0 && newX < -100 - GAME_CONFIG.FLAME_SIZE) newX = GAME_CONFIG.BOX_SIZE + 100
      if (flame.dy > 0 && newY > GAME_CONFIG.BOX_SIZE + 100) newY = -100 - GAME_CONFIG.FLAME_SIZE
      if (flame.dy < 0 && newY < -100 - GAME_CONFIG.FLAME_SIZE) newY = GAME_CONFIG.BOX_SIZE + 100

      return { ...flame, x: newX, y: newY } // Ritorna la fiamma aggiornata
    })
  }

  // FUNZIONE AVVIO ATTACCO FLAMES
  // Inizia il ciclo di attacchi basati sulle fiamme.
  const startFlameAttackCycle = () => {
    clearAllTimers() // Pulisce tutti i timer precedenti
    setAttackPhase("flame") // Imposta la fase di attacco a "flame"
    setIsStarAttack(false) // Indica che non è un attacco di stelle
    setCurrentFlameWave(0) // Inizia dalla prima onda di fiamme
    setVisibleFlames(createFlameWave(flameWaveTypes[0])) // Crea le fiamme per la prima onda
    setVisibleStars([]) // Assicura che le stelle non siano visibili
    setAttackCountdown(GAME_CONFIG.FLAME_ATTACK_DURATION / 1000) // Imposta il countdown visivo

    // Funzione interna per cambiare l'onda di fiamme
    const changeWave = (waveIndex) => {
      if (waveIndex < flameWaveTypes.length) {
        // Se ci sono ancora onde da mostrare
        setCurrentFlameWave(waveIndex) // Aggiorna l'indice dell'onda corrente
        setVisibleFlames(createFlameWave(flameWaveTypes[waveIndex])) // Crea le fiamme per la nuova onda

        // Imposta un timeout per cambiare alla prossima onda
        waveChangeRef.current = setTimeout(() => {
          changeWave(waveIndex + 1)
        }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length) // Durata divisa per il numero di onde
      }
    }

    // Avvia il cambio pattern delle fiamme dopo il primo segmento di tempo
    waveChangeRef.current = setTimeout(() => {
      changeWave(1) // Inizia dalla seconda onda (indice 1)
    }, GAME_CONFIG.FLAME_ATTACK_DURATION / flameWaveTypes.length)

    // Passa ad attacco da stelle a fiamme dopo la durata totale dell'attacco fiamme
    attackCycleRef.current = setTimeout(() => {
      startTransition(() => startStarAttackCycle()) // Inizia la transizione e poi il ciclo di stelle
    }, GAME_CONFIG.FLAME_ATTACK_DURATION)

    // Countdown visivo: aggiorna il countdown ogni secondo
    countdownIntervalRef.current = setInterval(() => {
      setAttackCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current) // Ferma l'intervallo quando il countdown finisce
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Avvio ciclo attacco stelle
  // Inizia il ciclo di attacchi basati sulle stelle.
  const startStarAttackCycle = () => {
    clearAllTimers() // Pulisce tutti i timer precedenti
    setAttackPhase("star") // Imposta la fase di attacco a "star"
    setIsStarAttack(true) // Indica che è un attacco di stelle
    setCurrentStarFormation(0) // Inizia dalla prima formazione di stelle
    setVisibleFlames([]) // Assicura che le fiamme non siano visibili
    setVisibleStars(createStarFormation(starFormationTypes[0])) // Crea le stelle per la prima formazione
    setMidAttack((prev) => ({ ...prev, active: false })) // Disattiva l'attacco centrale durante le stelle
    setStarAttackCountdown(GAME_CONFIG.STAR_ATTACK_DURATION / 1000) // Imposta il countdown visivo

    // Funzione interna per cambiare la formazione di stelle
    const changeFormation = (formationIndex) => {
      if (formationIndex < starFormationTypes.length) {
        // Se ci sono ancora formazioni da mostrare
        setCurrentStarFormation(formationIndex) // Aggiorna l'indice della formazione corrente
        setVisibleStars(createStarFormation(starFormationTypes[formationIndex])) // Crea le stelle per la nuova formazione

        // Imposta un timeout per cambiare alla prossima formazione
        waveChangeRef.current = setTimeout(() => {
          changeFormation(formationIndex + 1)
        }, GAME_CONFIG.STAR_ATTACK_DURATION / starFormationTypes.length) // Durata divisa per il numero di formazioni
      }
    }

    // Avvia il cambio formazioni delle stelle dopo il primo segmento di tempo
    waveChangeRef.current = setTimeout(() => {
      changeFormation(1) // Inizia dalla seconda formazione (indice 1)
    }, GAME_CONFIG.STAR_ATTACK_DURATION / starFormationTypes.length)

    // Torna ad attacco fiamme e aumenta difficoltà dopo la durata totale dell'attacco stelle
    starAttackCycleRef.current = setTimeout(() => {
      setDifficultyLevel((prev) => prev + 1) // Aumenta il livello di difficoltà
      startTransition(() => startFlameAttackCycle()) // Inizia la transizione e poi il ciclo di fiamme
    }, GAME_CONFIG.STAR_ATTACK_DURATION)

    // Countdown visivo: aggiorna il countdown ogni secondo
    countdownIntervalRef.current = setInterval(() => {
      setStarAttackCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current) // Ferma l'intervallo quando il countdown finisce
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Periodo di transizione tra attacchi
  // Imposta la fase di transizione e poi avvia il prossimo attacco dopo un ritardo.
  const startTransition = (nextAttack) => {
    setAttackPhase("transition") // Imposta la fase a "transition"
    setVisibleFlames([]) // Nasconde fiamme
    setVisibleStars([]) // Nasconde stelle

    setTimeout(() => {
      nextAttack() // Esegue la funzione del prossimo attacco
    }, GAME_CONFIG.TRANSITION_DURATION)
  }

  // Determina immagine Asgore da mostrare
  // Restituisce il percorso dell'immagine di Asgore in base allo stato.
  const getAsgoreImage = () => {
    if (showAngryAsgore) return "/asgore-angry.gif" // Se Asgore è arrabbiato
    if (showWarningAsgore) return "/asgore.gif" // Se Asgore sta avvisando (stessa immagine per ora)
    return "/asgore.gif" // Immagine predefinita
  }

  // Funzioni menu
  const startFight = () => {
    if (deathRef.current) {
      // Se l'audio di morte è in riproduzione, lo ferma
      deathRef.current.pause()
      deathRef.current.currentTime = 0
    }
    setShowVideo(true) // Mostra il video introduttivo
  }

  const skipVideo = () => {
    if (videoRef.current) {
      // Se il video è presente, lo ferma e simula la fine
      videoRef.current.pause()
      videoRef.current.dispatchEvent(new Event("ended")) // Triggera l'evento 'ended' per passare al countdown
    }
  }

  const startCountdown = () => {
    setCountdown(3) // Imposta il countdown a 3
    setGameState("countdown") // Cambia lo stato del gioco a "countdown"
  }

  //GO HOME - Fixed navigation function
  const goToHome = () => {
    navigate("/") // Naviga alla pagina principale
  }

  // EFFETTI (useEffect)

  // Gestione stato loading iniziale
  // Passa dallo stato "loading" a "menu" dopo un breve ritardo.
  useEffect(() => {
    if (gameState === "loading") {
      const timer = setTimeout(() => setGameState("menu"), 1500) // Dopo 1.5 secondi, mostra il menu
      return () => clearTimeout(timer) // Pulisce il timer se il componente si smonta o lo stato cambia
    }
  }, [gameState]) // Dipende da gameState

  // Gestione countdown prima del combattimento
  // Gestisce il conto alla rovescia prima che inizi il combattimento.
  useEffect(() => {
    if (gameState !== "countdown") return // Esegue solo se lo stato è "countdown"

    if (countdown === 0) {
      setGameState("fight") // Quando il countdown arriva a 0, inizia il combattimento
      return
    }

    const timeout = setTimeout(() => {
      setCountdown((c) => c - 1) // Decrementa il countdown ogni 0.5 secondi
    }, 500)

    return () => clearTimeout(timeout) // Pulisce il timeout
  }, [countdown, gameState]) // Dipende da countdown e gameState

  // Gestione audio in base allo stato
  // Controlla la riproduzione degli audio in base allo stato del gioco.
  useEffect(() => {
    // Controlla che tutti i riferimenti audio siano disponibili
    if (!ostRef.current || !deathRef.current || !dangerRef.current || !attackRef.current) return

    if (gameState === "fight" || gameState === "countdown") {
      ostRef.current.volume = 0.5 // Imposta il volume della OST
      ostRef.current.loop = true // Fa in modo che la OST si ripeta
      ostRef.current.play().catch(() => {}) // Avvia la OST, gestendo eventuali errori di riproduzione
      // Ferma e resetta gli altri audio
      deathRef.current.pause()
      deathRef.current.currentTime = 0
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
    }

    if (gameState === "gameover") {
      ostRef.current.pause() // Ferma la OST
      deathRef.current.currentTime = 0 // Resetta l'audio di morte
      deathRef.current.play().catch(() => {}) // Avvia l'audio di morte
      // Ferma e resetta gli altri audio
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
    }

    if (gameState === "menu" || gameState === "loading") {
      // Ferma e resetta tutti gli audio nel menu e caricamento
      ostRef.current.pause()
      ostRef.current.currentTime = 0
      deathRef.current.pause()
      deathRef.current.currentTime = 0
      dangerRef.current.pause()
      dangerRef.current.currentTime = 0
      attackRef.current.pause()
      attackRef.current.currentTime = 0
    }
  }, [gameState]) // Dipende da gameState

  // Gestione input e movimento giocatore
  // Questo è il cuore del loop di gioco, gestisce il movimento del giocatore,
  // l'aggiornamento dei proiettili e la rilevazione delle collisioni.
  useEffect(() => {
    if (gameState !== "fight") return // Esegue solo durante la fase di combattimento

    // Gestore per la pressione dei tasti (keydown)
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = true // Imposta il flag del tasto a true
    }

    // Gestore per il rilascio dei tasti (keyup)
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) keys.current[key] = false // Imposta il flag del tasto a false
    }

    // Funzione di movimento principale, chiamata a intervalli regolari
    const move = () => {
      // Aggiorna posizione giocatore
      setPosition((prev) => {
        const speed = 3 // Velocità di movimento del cuore
        let { x, y } = prev

        // Aggiorna x e y in base ai tasti premuti
        if (keys.current.w) y -= speed
        if (keys.current.s) y += speed
        if (keys.current.a) x -= speed
        if (keys.current.d) x += speed

        // Limita la posizione del cuore all'interno del riquadro di gioco
        x = Math.max(0, Math.min(GAME_CONFIG.BOX_SIZE - GAME_CONFIG.HEART_SIZE, x))
        y = Math.max(0, Math.min(GAME_CONFIG.BOX_SIZE - GAME_CONFIG.HEART_SIZE, y))

        return { x, y } // Ritorna la nuova posizione
      })

      // Aggiorna fiamme durante attacco fiamme
      if (attackPhase === "flame") {
        setVisibleFlames((prevFlames) => {
          const newFlames = updateFlames(prevFlames) // Aggiorna le posizioni delle fiamme

          // Controllo collisioni con fiamme
          for (const flame of newFlames) {
            // Controlla se il cuore si sovrappone a una fiamma
            if (
              flame.x < position.x + GAME_CONFIG.HEART_SIZE &&
              flame.x + GAME_CONFIG.FLAME_SIZE > position.x &&
              flame.y < position.y + GAME_CONFIG.HEART_SIZE &&
              flame.y + GAME_CONFIG.FLAME_SIZE > position.y
            ) {
              setGameState("gameover") // Se c'è collisione, il gioco finisce
              break // Esce dal loop
            }
          }

          return newFlames // Ritorna le fiamme aggiornate
        })
      }
      // Aggiorna stelle durante attacco stelle
      else if (attackPhase === "star") {
        setVisibleStars((prevStars) => {
          const newStars = updateStars(prevStars) // Aggiorna le posizioni delle stelle

          // Controllo collisioni con stelle
          for (const star of newStars) {
            // Controlla se il cuore si sovrappone a una stella
            if (
              star.x < position.x + GAME_CONFIG.HEART_SIZE &&
              star.x + GAME_CONFIG.STAR_SIZE > position.x &&
              star.y < position.y + GAME_CONFIG.HEART_SIZE &&
              star.y + GAME_CONFIG.STAR_SIZE > position.y
            ) {
              setGameState("gameover") // Se c'è collisione, il gioco finisce
              break
            }
          }

          return newStars // Ritorna le stelle aggiornate
        })
      }

      // Controllo collisione zona rossa
      if (redZoneDeadly) {
        // Se la zona rossa è letale
        // Determina se il cuore è nella zona rossa letale
        const inRedZone = redZoneOnRight ? position.x > GAME_CONFIG.BOX_SIZE / 2 : position.x < GAME_CONFIG.BOX_SIZE / 2

        if (inRedZone) {
          setGameState("gameover") // Se il cuore è nella zona letale, il gioco finisce
        }
      }

      // Movimento e collisione attacco centrale (il "doggo")
      if (midAttack.active) {
        setMidAttack((prev) => {
          const newX = prev.x + prev.speed * prev.direction // Aggiorna la posizione X dell'attacco centrale

          // Se l'attacco centrale è uscito dallo schermo, disattivalo
          if (
            (prev.direction === 1 && newX > GAME_CONFIG.BOX_SIZE) ||
            (prev.direction === -1 && newX < -GAME_CONFIG.MID_ATTACK_WIDTH)
          ) {
            return { ...prev, active: false }
          }

          // Controllo collisione con l'attacco centrale
          if (
            newX < position.x + GAME_CONFIG.HEART_SIZE &&
            newX + GAME_CONFIG.MID_ATTACK_WIDTH > position.x &&
            prev.y < position.y + GAME_CONFIG.HEART_SIZE &&
            prev.y + GAME_CONFIG.MID_ATTACK_HEIGHT > position.y
          ) {
            setGameState("gameover") // Se c'è collisione, il gioco finisce
            return { ...prev, active: false } // Disattiva l'attacco dopo la collisione
          }

          return { ...prev, x: newX } // Ritorna l'attacco centrale aggiornato
        })
      }
    }

    // Aggiunge gli event listener per i tasti
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    // Avvia l'intervallo di gioco (circa 60 frame al secondo)
    intervalRef.current = setInterval(move, 16) // 1000ms / 60fps ≈ 16.67ms

    // Funzione di cleanup: rimuove gli event listener e ferma l'intervallo quando il componente si smonta o lo stato cambia
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      clearInterval(intervalRef.current)
    }
  }, [gameState, position, redZoneDeadly, redZoneOnRight, midAttack.active, attackPhase]) // Dipendenze dell'effetto

  // Gestione attacchi zona rossa
  // Questo effetto gestisce l'attivazione periodica della zona rossa.
  useEffect(() => {
    // Se il gioco non è in fase di combattimento, pulisce tutti i timer e resetta gli stati della zona rossa
    if (gameState !== "fight") {
      clearInterval(zoneIntervalRef.current)
      clearTimeout(zoneTimerRef.current)
      clearTimeout(angryAsgoreTimeoutRef.current)
      clearTimeout(warningAsgoreTimeoutRef.current)
      clearAllTimers() // Pulisce anche i timer degli attacchi fiamme/stelle
      setZoneActive(false)
      setRedZoneDeadly(false)
      setShowAngryAsgore(false)
      setShowWarningAsgore(false)
      setAttackPhase("transition") // Resetta la fase di attacco
      setVisibleFlames([])
      setVisibleStars([])
      if (dangerRef.current) {
        // Ferma e resetta gli audio di pericolo e attacco
        dangerRef.current.pause()
        dangerRef.current.currentTime = 0
      }
      if (attackRef.current) {
        attackRef.current.pause()
        attackRef.current.currentTime = 0
      }
      return
    }

    // Funzione per attivare la zona rossa
    const activateZone = () => {
      setRedZoneOnRight((prev) => !prev) // Inverte la posizione della zona rossa (destra/sinistra)
      setZoneActive(true) // Attiva la zona visivamente
      setRedZoneDeadly(false) // La zona non è ancora letale
      setZoneCountdown(3) // Imposta il countdown della zona a 3
      setShowWarningAsgore(true) // Mostra Asgore in stato di avviso

      if (dangerRef.current) {
        // Riproduce l'audio di pericolo
        dangerRef.current.currentTime = 0
        dangerRef.current.play().catch((e) => console.log("Audio play error:", e))
      }

      // Nascondi warning Asgore dopo 2.5 secondi
      warningAsgoreTimeoutRef.current = setTimeout(() => {
        setShowWarningAsgore(false)
      }, 2500)

      // Attiva zona mortale dopo 3 secondi
      setTimeout(() => {
        setRedZoneDeadly(true) // La zona diventa letale
        setShowAngryAsgore(true) // Mostra Asgore arrabbiato

        angryAsgoreTimeoutRef.current = setTimeout(() => {
          setShowAngryAsgore(false) // Nasconde Asgore arrabbiato dopo 0.5 secondi
        }, 500)

        if (attackRef.current) {
          // Riproduce l'audio di attacco
          attackRef.current.currentTime = 0
          attackRef.current.play().catch((e) => console.log("Audio play error:", e))
        }
      }, 3000)

      // Disattiva zona dopo 4 secondi (dalla sua attivazione iniziale)
      zoneTimerRef.current = setTimeout(() => {
        setZoneActive(false) // Disattiva la zona visivamente
        setRedZoneDeadly(false) // La zona non è più letale
        setShowAngryAsgore(false) // Nasconde Asgore arrabbiato
        setShowWarningAsgore(false) // Nasconde Asgore in avviso
      }, 4000)

      // Countdown visivo zona: aggiorna il countdown ogni secondo
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

    // Attacchi zona più frequenti con difficoltà crescente
    // L'intervallo tra le attivazioni della zona rossa diminuisce con l'aumentare della difficoltà.
    const zoneInterval = Math.max(4000, 6000 - difficultyLevel * 200) // Minimo 4 secondi
    // Avvia la prima zona rossa dopo un ritardo iniziale, poi ripete a intervalli regolari
    const initialDelay = setTimeout(() => {
      activateZone()
      zoneIntervalRef.current = setInterval(activateZone, zoneInterval)
    }, 3000)

    // Funzione di cleanup
    return () => {
      clearInterval(zoneIntervalRef.current)
      clearTimeout(zoneTimerRef.current)
      clearTimeout(angryAsgoreTimeoutRef.current)
      clearTimeout(warningAsgoreTimeoutRef.current)
      clearTimeout(initialDelay)
    }
  }, [gameState, difficultyLevel]) // Dipende da gameState e difficultyLevel

  // Gestione attacchi centrali
  // Questo effetto gestisce l'attivazione periodica dell'attacco centrale.
  useEffect(() => {
    // Se il gioco non è in fase di combattimento, disattiva l'attacco centrale e pulisce l'intervallo
    if (gameState !== "fight") {
      setMidAttack((prev) => ({ ...prev, active: false }))
      clearInterval(midAttackIntervalRef.current)
      return
    }

    // Funzione per attivare l'attacco centrale
    const activateMidAttack = () => {
      if (attackPhase === "star") return // Nessun attacco centrale durante la fase di attacco stelle

      const fromRight = Math.random() > 0.5 // Decide casualmente se l'attacco arriva da destra o sinistra
      setMidAttack({
        active: true,
        x: fromRight ? GAME_CONFIG.BOX_SIZE : -GAME_CONFIG.MID_ATTACK_WIDTH, // Posizione iniziale
        y: Math.random() * (GAME_CONFIG.BOX_SIZE - GAME_CONFIG.MID_ATTACK_HEIGHT), // Posizione Y casuale
        speed: 1.5,
        direction: fromRight ? -1 : 1, // Direzione del movimento
      })
    }

    // Attacchi centrali più frequenti con difficoltà crescente
    // L'intervallo tra le attivazioni dell'attacco centrale diminuisce con l'aumentare della difficoltà.
    const midAttackInterval = Math.max(3000, 5000 - difficultyLevel * 150) // Minimo 3 secondi
    // Avvia il primo attacco centrale dopo un ritardo iniziale, poi ripete a intervalli regolari
    const initialDelay = setTimeout(() => {
      activateMidAttack()
      midAttackIntervalRef.current = setInterval(activateMidAttack, midAttackInterval)
    }, 4000)

    // Funzione di cleanup
    return () => {
      clearTimeout(initialDelay)
      clearInterval(midAttackIntervalRef.current)
    }
  }, [gameState, attackPhase, difficultyLevel]) // Dipende da gameState, attackPhase e difficultyLevel

  // Avvio ciclo attacchi quando inizia combattimento
  // Questo effetto avvia il primo ciclo di attacchi (fiamme) quando il gioco entra in fase "fight".
  useEffect(() => {
    if (gameState === "fight") {
      setDifficultyLevel(1) // Resetta il livello di difficoltà all'inizio del combattimento
      startFlameAttackCycle() // Avvia il primo ciclo di attacchi di fiamme
    }

    return () => {
      clearAllTimers() // Pulisce tutti i timer quando il gioco esce dalla fase "fight"
    }
  }, [gameState]) // Dipende da gameState

  // Gestione video introduttivo
  // Questo effetto gestisce la riproduzione del video introduttivo e la transizione al gioco.
  useEffect(() => {
    if (!showVideo) return // Esegue solo se showVideo è true

    const video = videoRef.current
    if (!video) return // Se il riferimento al video non è disponibile, esce

    // Funzione chiamata alla fine del video
    const handleVideoEnd = () => {
      setShowVideo(false) // Nasconde il video
      // Resetta lo stato del gioco per iniziare un nuovo round
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
        ostRef.current.currentTime = 0 // Resetta la OST
      }
      startCountdown() // Avvia il countdown per il combattimento
    }

    video.addEventListener("ended", handleVideoEnd) // Aggiunge l'event listener per la fine del video

    // Funzione per avviare la riproduzione del video
    const playVideo = async () => {
      try {
        video.volume = 0.2 // Imposta il volume del video
        await video.play() // Tenta di riprodurre il video
      } catch (err) {
        console.error("Video play failed:", err) // Logga l'errore se la riproduzione fallisce (es. autoplay bloccato)
        video.muted = true // Muta il video e riprova
        try {
          await video.play()
        } catch (mutedErr) {
          console.error("Muted video play failed:", mutedErr) // Se fallisce anche muto, salta il video
          handleVideoEnd()
        }
      }
    }

    playVideo() // Avvia la riproduzione

    // Funzione di cleanup: rimuove l'event listener
    return () => {
      video.removeEventListener("ended", handleVideoEnd)
    }
  }, [showVideo]) // Dipende da showVideo

  // Gestione testi narratore durante video
  // Questo effetto gestisce la visualizzazione sequenziale dei testi del narratore durante il video.
  useEffect(() => {
    if (!showVideo) return // Esegue solo se showVideo è true

    let lineIndex = 0
    setCurrentNarratorLine(0) // Inizia dalla prima riga

    narratorIntervalRef.current = setInterval(() => {
      lineIndex++
      if (lineIndex < narratorLines.length) {
        setCurrentNarratorLine(lineIndex) // Aggiorna la riga del narratore
      } else {
        clearInterval(narratorIntervalRef.current) // Ferma l'intervallo quando tutte le righe sono state mostrate
      }
    }, 6000) // Cambia riga ogni 6 secondi

    // Funzione di cleanup
    return () => {
      clearInterval(narratorIntervalRef.current)
    }
  }, [showVideo]) // Dipende da showVideo

  // RENDER PRINCIPALE
  // Questa sezione definisce la struttura HTML/JSX del componente,
  // rendendo elementi diversi in base allo stato del gioco.
  return (
    <div className={styles.container}>
      {/* Audio Elements: Elementi audio nascosti, controllati tramite i riferimenti */}
      <audio ref={ostRef} src="/ost.mp3" />
      <audio ref={deathRef} src="/death.mp3" />
      <audio ref={dangerRef} src="/danger.mp3" />
      <audio ref={attackRef} src="/attack.mp3" />

      {/* Video Introduttivo: Mostrato solo quando showVideo è true */}
      {showVideo && (
        <div className={styles.videoContainer}>
          <video ref={videoRef} src="/start.mp4" className={styles.videoPlayer} autoPlay playsInline />
          <div className={styles.videoTitle}>{narratorLines[currentNarratorLine]}</div> {/* Testo del narratore */}
          <button onClick={skipVideo} className={styles.skipButton}>
            Salta
          </button>
        </div>
      )}

      {/* Schermata Loading: Mostrata brevemente all'inizio */}
      {gameState === "loading" && <div className={styles.countdownText} style={{ userSelect: "none" }}></div>}

      {/* Menu Principale e Game Over: Mostrati quando il gioco è nel menu o in game over e il video non è attivo */}
      {(gameState === "menu" || gameState === "gameover") && !showVideo && (
        <div className={gameState === "menu" ? styles.menu : styles.retryMenu}>
          {gameState === "gameover" && <div className={styles.retryText}>Non puoi arrenderti proprio ora...</div>}
          <img src="/start.png" alt="Start Image" className={styles.startImage} />
          <div className={styles.menuButtons}>
            <button onClick={startFight} className={styles.menuButton}>
              <img src="/heart.png" alt="Heart" className={styles.menuHeart} />
              Determinazione {/* Pulsante per iniziare il gioco */}
            </button>

            <button className={styles.homeButton} onClick={goToHome}>
              <span className={styles.homeIcon}>🏠</span>
              Torna a Casa {/* Pulsante per tornare alla home */}
            </button>
          </div>
          <div className={styles.controlsHint}>Usa i tasti WASD per muoverti</div> {/* Suggerimento controlli */}
        </div>
      )}

      {/* Schermata di Combattimento: Mostrata durante il countdown e il combattimento */}
      {(gameState === "fight" || gameState === "countdown") && !showVideo && (
        <div className={styles.gameWrapper}>
          <div className={styles.battleLayout}>
            {/* Immagine di Asgore, cambia in base allo stato */}
            <img src={getAsgoreImage() || "/placeholder.svg"} alt="Asgore" className={styles.asgore} />
            <div className={styles.box}>
              {/* Zone Rosse di Attacco: Mostrate solo quando zoneActive è true */}
              {zoneActive && (
                <>
                  {/* Zona verde (sicura) */}
                  <div
                    className={styles.greenZone}
                    style={{
                      left: redZoneOnRight ? 0 : "50%", // Posizione della zona verde
                      right: redZoneOnRight ? "50%" : 0,
                    }}
                  ></div>
                  {/* Zona rossa (pericolosa), diventa deadly se redZoneDeadly è true */}
                  <div
                    className={`${styles.redZone} ${redZoneDeadly ? styles.deadly : ""}`}
                    style={{
                      left: redZoneOnRight ? "50%" : 0, // Posizione della zona rossa
                      right: redZoneOnRight ? 0 : "50%",
                    }}
                  >
                    {zoneCountdown > 0 && <div className={styles.zoneCountdown}>{zoneCountdown}</div>}{" "}
                    {/* Countdown della zona */}
                  </div>
                </>
              )}

              {/* Cuore Giocatore: Posizionato dinamicamente */}
              <img
                src="/heart.png"
                alt="Heart"
                className={styles.heart}
                style={{ top: position.y, left: position.x }}
              />

              {/* Fiamme durante Attacco Fiamme: Renderizzate solo nella fase "flame" */}
              {attackPhase === "flame" &&
                visibleFlames.map((flame) => (
                  <img
                    key={flame.id}
                    src="/flames.png"
                    alt="Flame"
                    className={styles.flame}
                    style={{ top: flame.y, left: flame.x }}
                    draggable={false} // Impedisce il trascinamento dell'immagine
                  />
                ))}

              {/* Warning Circles per Attacco Circolare: Mostrati solo per l'onda circolare e quando il warningTime è attivo */}
              {attackPhase === "flame" &&
                currentFlameWave === 3 && // L'onda circolare è la quarta (indice 3)
                visibleFlames
                  .filter((flame) => flame.isCircle && flame.warningTime > 0) // Filtra solo le fiamme circolari con warning attivo
                  .map((flame) => (
                    <div
                      key={`warning-${flame.id}`}
                      className={styles.circleWarning}
                      style={{
                        top: GAME_CONFIG.BOX_SIZE / 2 - 60, // Posiziona il cerchio di avviso al centro
                        left: GAME_CONFIG.BOX_SIZE / 2 - 60,
                        width: "120px",
                        height: "120px",
                        transform: `rotate(${flame.angle}rad)`, // Ruota il cerchio di avviso
                      }}
                    />
                  ))}

              {/* Stelle durante Attacco Stelle: Renderizzate solo nella fase "star" */}
              {attackPhase === "star" &&
                visibleStars.map((star) => (
                  <img
                    key={star.id}
                    src="/star.png"
                    alt="Star"
                    className={styles.star}
                    style={{
                      top: star.y,
                      left: star.x,
                      transform: `rotate(${star.angle}rad)`, // Applica la rotazione
                      width: `${GAME_CONFIG.STAR_SIZE}px`,
                      height: `${GAME_CONFIG.STAR_SIZE}px`,
                    }}
                    draggable={false}
                  />
                ))}

              {/* Attacco Centrale: Mostrato solo nella fase "flame" e quando attivo */}
              {attackPhase === "flame" && midAttack.active && (
                <img
                  src="/mid.png"
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

              {/* Countdown Iniziale: Mostrato solo durante la fase "countdown" */}
              {gameState === "countdown" && (
                <div className={styles.countdownText}>{countdown === 0 ? "" : countdown}</div>
              )}

              {/* Informazioni Attacco: Mostra il countdown e il livello di difficoltà */}
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
                  <div className={styles.transitionText}>⚡ Prossimo attacco? </div> // Testo durante la transizione
                )}
              </div>
            </div>
          </div>
          <div className={styles.controlsHint}>Usa i tasti WASD per muoverti</div> {/* Suggerimento controlli */}
        </div>
      )}
    </div>
  )
}
