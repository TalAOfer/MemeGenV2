var gElCanvas
var gCtx
var gCurrPage
var gIsDrag = false
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gCurrDragged = null


function onInit () {
    if (!gCurrPage || gCurrPage === 'gallery') {
        gCurrPage = 'gallery'
        toggleChosenBtn('gallery')
        renderGallery()
    }
    else if (gCurrPage = 'meme') {
        toggleChosenBtn('meme')
        renderCanvas()
        clearCanvas()    
        resizeCanvas()
        addListeners()
    }
    }

function resizeCanvas() {
    if (gCurrPage === 'gallery') return
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 50
    gElCanvas.height = elContainer.offsetHeight - 50
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        if (gCurrPage === 'gallery') return
        resizeCanvas()
        renderMeme()
    })
}

function clearCanvas() {
    gCtx.fillStyle = "white"
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function addMouseListeners() {
    if (gCurrPage === 'gallery') return
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    if (gCurrPage === 'gallery') return
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    _clearSelected()
    if (!isLineClicked(pos)) return
    gElCanvas.style.cursor = 'grab'
    gCurrDragged = isLineClicked(pos)
    gCurrDragged.isMarked = true
    renderMeme()
    disableLoad()
    enableClear()
    setLineDrag(true)
}

function onMove(ev) {
    if (!gIsDrag) return
    const pos = getEvPos(ev)
    const line = gCurrDragged
    line.position.x = pos.x
    line.position.y = pos.y
    renderMeme()
    gElCanvas.style.cursor = 'grabbing'
}

function onUp() {
    setLineDrag(false)
    gElCanvas.style.cursor = 'grab'
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function isLineClicked(clickedPos) {
    // console.log(clickedPos)
    let clickedLine = null
    const clickedLineIdx = null
    gMeme.lines.forEach((line, idx)=> {
       if (line.position.y >= (clickedPos.y - 10) && line.position.y < (clickedPos.y + 10)) clickedLine = line
    })
    return (clickedLine)
}

function setLineDrag (bool) {
    gIsDrag = bool
}


// ON CLICKS AND CHANGES

function onLoadMeme() { 
    gCurrPage = 'meme'
    onInit()
}

function onLoadGallery() {
    gCurrPage = 'gallery'
    onInit()
}

function onPickImg (imgId) {
    gCurrPage = 'meme' 
    onInit()
    gMeme.selectedImgId = imgId
    renderMeme()
}

function onChangeColor(type, val) {
    changeColor(type, val)
}

function onChangeLine() {
    changeLine()
}

function onMoveText(direction) {
    moveText(direction)
}

function toggleChosenBtn(page) {
    const elMemeBtn = document.querySelector('.meme-btn')
    const elGalleryBtn = document.querySelector('.gallery-btn')

    if (page === 'gallery') {
        elGalleryBtn.classList.remove('unchosen-btn')
        elMemeBtn.classList.add('unchosen-btn')

    } else if (page === 'meme') {
        elMemeBtn.classList.remove('unchosen-btn')
        elGalleryBtn.classList.add('unchosen-btn')
    }
}



