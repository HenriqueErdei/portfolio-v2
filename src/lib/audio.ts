import { useEffect, useState } from "react"

/**
 * Portfolio soundtrack: soft ambient pad (procedural “relax” bed) plus dry
 * mechanical ticks on control clicks. No audio files — a few oscillators and a
 * noise buffer, zero requests.
 *
 * Silent until asked for, and remembered afterwards. Sound that starts on its
 * own is a reason to close the tab, and browsers block it anyway — the graph is
 * only built once a real gesture has happened.
 */

const STORAGE_KEY = "portfolio:sound"

type Listener = (on: boolean) => void

const listeners = new Set<Listener>()

let on = readPreference()
let ctx: AudioContext | null = null
let master: GainNode | null = null
let bedGain: GainNode | null = null
let bedNodes: AudioScheduledSourceNode[] = []
let click: AudioBuffer | null = null

/** Loudest the whole mix ever gets. Deliberately low: this is background. */
const MASTER = 0.28

function readPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on"
  } catch {
    return false
  }
}

function ensureContext(): AudioContext | null {
  if (ctx) return ctx

  try {
    ctx = new AudioContext()
  } catch {
    return null
  }

  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  return ctx
}

/** Soft air for the pad — not a room rumble. */
function airNoise(context: AudioContext): AudioBuffer {
  const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate)
  const data = buffer.getChannelData(0)

  let last = 0
  for (let i = 0; i < data.length; i += 1) {
    last = (last + 0.015 * (Math.random() * 2 - 1)) / 1.015
    data[i] = last * 2.4
  }

  return buffer
}

/** 30ms of white noise, shaped into a tick by the envelope at each play. */
function clickNoise(context: AudioContext): AudioBuffer {
  if (click) return click

  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.03), context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1

  click = buffer
  return buffer
}

/**
 * A calm portfolio pad: slow sine drones on a minor-ish triad, a barely-there
 * shimmer octave, and a whisper of filtered air. Reads as music, not engine.
 */
function startBed(context: AudioContext) {
  if (bedGain || !master) return

  const gain = context.createGain()
  gain.gain.setValueAtTime(0, context.currentTime)
  gain.gain.linearRampToValueAtTime(1, context.currentTime + 2.8)
  gain.connect(master)
  bedGain = gain

  const nodes: AudioScheduledSourceNode[] = []

  // Root + fifth + soft third — quiet enough to sit under the page.
  const tones: { freq: number; level: number; detune: number }[] = [
    { freq: 110, level: 0.085, detune: 0 },
    { freq: 164.81, level: 0.055, detune: -4 },
    { freq: 196, level: 0.045, detune: 3 },
    { freq: 329.63, level: 0.018, detune: 6 },
  ]

  for (const tone of tones) {
    const osc = context.createOscillator()
    osc.type = "sine"
    osc.frequency.value = tone.freq
    osc.detune.value = tone.detune

    const level = context.createGain()
    level.gain.value = tone.level

    // Slow breathe so the pad never freezes into a stuck tone.
    const lfo = context.createOscillator()
    lfo.type = "sine"
    lfo.frequency.value = 0.04 + tone.freq * 0.00005
    const depth = context.createGain()
    depth.gain.value = tone.level * 0.35
    lfo.connect(depth)
    depth.connect(level.gain)

    osc.connect(level)
    level.connect(gain)
    osc.start()
    lfo.start()
    nodes.push(osc, lfo)
  }

  // Whisper of air, heavily low-passed — studio hush, not rocket wash.
  const air = context.createBufferSource()
  air.buffer = airNoise(context)
  air.loop = true

  const lp = context.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 280
  lp.Q.value = 0.5

  const airLevel = context.createGain()
  airLevel.gain.value = 0.09

  air.connect(lp)
  lp.connect(airLevel)
  airLevel.connect(gain)
  air.start()
  nodes.push(air)

  bedNodes = nodes
}

function stopBed(context: AudioContext) {
  if (!bedGain) return

  const at = context.currentTime
  bedGain.gain.cancelScheduledValues(at)
  bedGain.gain.setValueAtTime(bedGain.gain.value, at)
  bedGain.gain.linearRampToValueAtTime(0, at + 0.7)

  const dying = bedNodes
  const dyingGain = bedGain
  bedNodes = []
  bedGain = null

  window.setTimeout(() => {
    for (const node of dying) {
      try {
        node.stop()
      } catch {
        // Already stopped.
      }
      node.disconnect()
    }
    dyingGain.disconnect()
  }, 800)
}

export function soundOn(): boolean {
  return on
}

export function setSound(next: boolean) {
  on = next

  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off")
  } catch {
    // Not remembering the choice is not worth breaking the switch.
  }

  const context = next ? ensureContext() : ctx

  if (next && context && master) {
    void context.resume()
    startBed(context)
    master.gain.setTargetAtTime(MASTER, context.currentTime, 0.35)
  } else if (context && master) {
    stopBed(context)
    master.gain.setTargetAtTime(0, context.currentTime, 0.2)
    window.setTimeout(() => {
      if (!on) void ctx?.suspend()
    }, 800)
  }

  if (next && !context) on = false

  for (const listener of listeners) listener(on)
}

/**
 * Rebuilds the graph for a visitor who had sound on last time. Autoplay policy
 * means this can only work from inside a real gesture, which is why it is not
 * simply done on load.
 */
export function armSound() {
  if (on && !ctx) setSound(true)
}

/** Dry mechanical tick. `level` scales it down for incidental events. */
export function tick(level = 1) {
  const context = ctx
  if (!on || !context || !master) return

  const at = context.currentTime
  const source = context.createBufferSource()
  source.buffer = clickNoise(context)

  const band = context.createBiquadFilter()
  band.type = "bandpass"
  band.frequency.value = 2200
  band.Q.value = 1.3

  const envelope = context.createGain()
  envelope.gain.setValueAtTime(0.0001, at)
  envelope.gain.exponentialRampToValueAtTime(0.55 * level, at + 0.004)
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.05)

  source.connect(band)
  band.connect(envelope)
  envelope.connect(master)
  source.start(at)
  source.stop(at + 0.06)
}

/** Two-tone blip. Rising to open something, falling to close it. */
export function blip(rising = true) {
  const context = ctx
  if (!on || !context || !master) return

  const at = context.currentTime
  const osc = context.createOscillator()
  osc.type = "sine"
  osc.frequency.setValueAtTime(rising ? 720 : 1080, at)
  osc.frequency.exponentialRampToValueAtTime(rising ? 1180 : 620, at + 0.09)

  const envelope = context.createGain()
  envelope.gain.setValueAtTime(0.0001, at)
  envelope.gain.exponentialRampToValueAtTime(0.22, at + 0.012)
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.17)

  osc.connect(envelope)
  envelope.connect(master)
  osc.start(at)
  osc.stop(at + 0.19)
}

export function subscribeToSound(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** React view of the switch. */
export function useSound(): { on: boolean; toggle: () => void } {
  const [value, setValue] = useState(on)

  useEffect(() => subscribeToSound(setValue), [])

  return { on: value, toggle: () => setSound(!soundOn()) }
}
