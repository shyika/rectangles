const ReactangleManager = (function() {
    const instance = this
    this.reactangles = []

    this.initEvents = function() {
        for(let i = 0; i < this.reactangles.length; i++) {
            const rectagle = this.reactangles[i]
            rectagle.el.addEventListener('dragstart', (e) => {
                if (!rectagle.selected) {
                    e.preventDefault()
                    return
                }
                e.dataTransfer.setDragImage(rectagle.el, 0, 0)
                e.dataTransfer.dropEffect = "move"
            })

            rectagle.el.addEventListener('dragend', (e) => {
                e.preventDefault()
                rectagle.x = e.x
                rectagle.y = e.y
                rectagle.updatePosition()
            })
        }
    }

    this.generateRectangles = function(count) {
        for (var i = 0; i < count; i++) {
            const container = document.createElement('div')
            const id = 'rect_' + i
            container.setAttribute('id', id)
            container.setAttribute('draggable', true)
            document.body.appendChild(container)
            this.reactangles.push(new Reactangle(id))
            this.reactangles[i].show()
        }

        return this
    }

    this.clearSelection = function() {
        for(let i = 0; i < this.reactangles.length; i++) {
            const rectagle = this.reactangles[i]
            if (rectagle.selected) {
                rectagle.clearSelection()
            }
        }
    }

    this.doSelection = function(id) {
        for(let i = 0; i < this.reactangles.length; i++) {
            const rectagle = this.reactangles[i]
            if (rectagle.id === id) {
                if (!rectagle.selected) {
                    rectagle.doSelection()
                }
                continue
            }

            if (rectagle.selected) {
                rectagle.clearSelection()
            }
        }
    }

    return function() {
        return instance
    }
})()


let zIndex = 0

function Reactangle(id) {
    const me = this
    this.el = document.getElementById(id)
    this.id = id

    const maxY = window.innerHeight
    const maxX = window.innerWidth

    this.x = Math.floor(Math.random() * (maxX - 1))
    this.y = Math.floor(Math.random() * (maxY - 1))
    this.width  = Math.floor(Math.random() * (maxX - this.x));
    this.height = Math.floor(Math.random() * (maxY - this.y));
    this.color  = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];

    this.selected = false

    this.show = function() {
        this.el.style.position = 'absolute'
        this.el.style.left = this.x + 'px'
        this.el.style.top = this.y + 'px'
        this.el.style.width = this.width + 'px'
        this.el.style.height = this.height + 'px'
        this.el.style.backgroundColor = 'rgb(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ')'
    }

    this.doSelection = function() {
        if (!this.selected) {
            this.selected = true
            zIndex++
            this.el.style.zIndex = zIndex
            this.el.style.border = '1px solid black'
        }
    }

    this.updatePosition = function() {
        this.el.style.left = this.x + 'px'
        this.el.style.top = this.y + 'px'
    }

    this.clearSelection = function() {
        this.selected = false
        this.el.style.border = 'none'
    }
}

function loadApp() {
    document.body.style.position = 'relative'
    const reactangleManager = new ReactangleManager
    reactangleManager.generateRectangles(3).initEvents()

    document.addEventListener('click', function(e) {
        if (e.target === document.documentElement) {
            reactangleManager.clearSelection()
        }

        if (e.target.id.includes('rect_')) {
            reactangleManager.doSelection(e.target.id)
        }
    })

    document.addEventListener('dragover', function(e) {
        e.preventDefault()
    })
}


loadApp()
