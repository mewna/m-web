export class Logger {
    constructor(name) {
        this.name = name
    }

    log(...args) {
        const inputLevel = args.shift()
        let logLevel = "INFO"
        let color = "#0000FF"
        switch(inputLevel) {
            case "DEBUG":
                logLevel = "DEBUG"
                color = "#00FF00"
                break
            case "INFO":
                logLevel = "INFO"
                color = "#0000FF"
                break
            case "WARN":
                logLevel = "WARN"
                color = "#FFFF00"
                break
            case "ERROR":
                logLevel = "ERROR"
                color = "#FF0000"
                break
            default:
                logLevel = "INFO"
                color = "#0000FF"
                break
        }
        const fullPrefix = "%c[MEWNA] %c[" + logLevel + "] %c[" + this.name + "]"
        const base = [fullPrefix, "color: #FF69B4", "color: " + color, "color: black"]
        // This is fucking stupid
        args = args[0]
        let x = []
        for(let i = 0; i < args.length; i++) {
            x.push(args[i])
        }
        let y = base.concat(x)
        console.log.apply(console, y)
    }

    debug() {
        this.log("DEBUG", arguments)
    }

    info() {
        this.log("INFO", arguments)
    }

    warn() {
        this.log("WARN", arguments)
    }

    error() {
        this.log("ERROR", arguments)
    }
}
