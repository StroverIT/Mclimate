export const buzzerVolume = [
    { label: "1 (min)", value: '1' },
    { label: "2", value: '2' },
    { label: "3", value: '3' },
    { label: "4", value: '4' },
    { label: "5", value: '5' },
    { label: "6 (max)", value: '6' }
]

export const buzzerFreq = [
    { label: "1 kHz", value: '0' },
    { label: "1.5 kHz", value: '1' },
    { label: "2 kHz", value: '2' },
    { label: "2.5 kHz", value: '3' },
    { label: "3 kHz", value: '4' },
    { label: "3.5 kHz", value: '5' },
    { label: "4 kHz", value: '6' },
    { label: "4.5 kHz", value: '7' },
    { label: "5 kHz", value: '8' },
    { label: "5.5 kHz", value: '9' },
    { label: "6 kHz", value: '10' }
]

export const buzzerBehavior = [
    { label: "Fast", value: { on_time: 50, off_time: 50 } },
    { label: "Slow", value: { on_time: 1000, off_time: 1000 } },
    { label: "Constant", value: { on_time: 50, off_time: 0 } }
]

export const aqiLedColor = [
    { label: "Red", value: 'red' },
    { label: "Green", value: 'green' },
    { label: "Blue", value: 'blue' },
    { label: "White", value: 'white' },
    { label: "Cyan", value: 'cyan' },
    { label: "Pink", value: 'pink' },
    { label: "Yellow", value: 'yellow' }
]

export const aqiLedBehaviour = [
    { label: "Fast Blink", value: 2 },
    { label: "Slow Blink", value: 3 },
    { label: "Constant", value: 1 }
]

export const aqiLedDuration = [
    { label: "10s", value: 10 },
    { label: "20s", value: 20 },
    { label: "30s", value: 30 }
]

export const operationModeOptions = [
    { label: "Manual", value: '00' },
    { label: "Automatic", value: '01' },
    { label: "Automatic with ext. temp sensor", value: '02' }
    // { label: "Online MCloud algorithm", value: '03' }
]

export const openWindowEnabledOptions = [
    { label: "False", value: false },
    { label: "True", value: true }
]

export const onlineAlgorithmVersion = [
    { label: "Disable MCloud algorithm", value: 'manual_control' },
    { label: "Online MCloud algorithm", value: 'v1' },
    { label: "Proportional Control MCloud algorithm", value: 'pid' }
]
