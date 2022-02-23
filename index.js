



let Start = () => {
    let canvas = document.getElementById('redexpo-canvas')

    let context = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // context.fillStyle = 'white'
    // context.font = '50px Roboto'
    // context.fillText('RedExpo', 0, 30)

    var img = document.getElementById("my-image");
    context.drawImage(img, 0, 0);

    let textCoordinate = context.getImageData(0, 0, 1000, 1000)

    let particleArray = []

    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    })
    let prev_x = 0
    let prev_y = 0

    class REParticle {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.c_size = Math.random(5, 8)
            this.baseX = this.x
            this.baseY = this.y
            this.density = (Math.random() * 30) + 1
        }

        draw(index) {
            if (index % 2 == 0) {
                context.fillStyle = 'white'
            }
            else {
                context.fillStyle = 'orange'
            }
            context.beginPath()
            context.arc(this.x, this.y, this.c_size, 0, Math.PI * 2)
            context.closePath()
            context.fill()
        }
        update() {
            let dx = mouse.x - this.x
            let dy = mouse.y - this.y
            let distance = Math.sqrt(dx * dx + dy * dy)
            let forceDirectionX = dx / distance
            let forceDirectionY = dy / distance

            let maxDistance = mouse.radius
            let force = (maxDistance - distance) / maxDistance

            let directionX = forceDirectionX * force * this.density
            let directionY = forceDirectionY * force * this.density

            context.beginPath();
            if ((prev_x + this.x) < 10 || (prev_y + this.y) < 50) {
                context.moveTo(prev_x, prev_y);
                context.lineTo(this.x, this.y);
                context.strokeStyle = '#ffffff';
                context.stroke();
            }

            if (distance < mouse.radius) {
                this.x -= directionX
                this.y -= directionY
            }
            else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX
                    this.x -= dx / 10
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY
                    this.y -= dy / 10
                }
            }

            prev_x = this.x
            prev_y = this.y

        }
    }

    let Init = () => {
        particleArray = []
        // for (let i = 0; i < 1000; i++) {
        //     let random_x = Math.random() * window.innerWidth
        //     let random_y = Math.random() * window.innerHeight
        //     particleArray.push(new REParticle(random_x, random_y))
        // }

        for (let y = 0, y2 = textCoordinate.height; y < y2; y++) {
            for (let x = 0, x2 = textCoordinate.width; x < x2; x++) {
                if (textCoordinate.data[(y * 4 * textCoordinate.width) + (x * 4) + 3] > 128) {
                    let positionX = x
                    let positionY = y
                    particleArray.push(new REParticle(positionX * 2, positionY * 2))
                }
            }
        }
    }

    Init()

    const animate = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        particleArray.forEach((prtcl, index) => {
            prtcl.draw(index)
            prtcl.update()
        })
        requestAnimationFrame(animate)
    }
    animate()
}




window.onload = () => {
    Start()
}