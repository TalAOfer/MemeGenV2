'use strict'

const gDisable = { load: false, clear: true }

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}

const gCurrUserSettings = {
    stroke: 'black',
    fill: 'white',
    fontSize: 40,
    fontType: 'impact',
    align: 'center'
}

function saveLine(ev) {
    if (ev.type === 'click') {
        const textBox = document.querySelector('.text-input')
        let text = textBox.value
        addLine(text)
        textBox.value = ''

    } else if (ev.type === 'submit') {
        ev.preventDefault()
        let text = ev.target.elements[0].value
        addLine(text)
        ev.target.elements[0].value = ''
    }
}

function addLine(text) {
    const settings = gCurrUserSettings
    gMeme.lines.push({
        text: text,
        size: settings.fontSize,
        font: null,
        fillColor: null,
        strokeColor: null,
        align: null,
        isMarked: false,
        position: { x: null, y: null }
    })
    renderMeme()
    // setTimeout(() => {gMeme.selectedLineIdx++}, 1500);

}


function getCurrUserSettings() {
    return gCurrUserSettings
}

// RENDER

function renderMeme() {
    const imgId = gMeme.selectedImgId
    var img = new Image();
    img.src = `img/squareTemp/${imgId}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        let lines = gMeme.lines
        lines.forEach((line, idx) => {
            drawText(line.text, idx)
        });
    };

}

function renderCanvas() {
    const elContainer = document.querySelector('.main-container')

    var strHtml = `<div class="generator-container">
        <div class="canvas-container">
        <canvas id="my-canvas" width="400" height="400">
        
        </canvas>
        </div>
        <div class="controller-container">
        
        <div class="form-container">
        <form onsubmit="saveLine(event)">
        <input class="text-input" oninput1="drawText(event, this.value)" type="text" placeholder="enter your text here">
        </form>
        </div>
        
        <div class="main-buttons-container">
        <button onclick="onMoveText('up')" class="control-btn up-btn"> ⬆️ </button>
        <button onclick="onMoveText('down')" class="control-btn down-btn"> ⬇️ </button>
        <button onclick="onChangeLine()" class="control-btn change-line-btn"> 🔃</button>
        <button onclick= "saveLine(event)" class="control-btn plus-btn"> <img src="img/icons/plus2.png" </button>
        <button onclick="deleteLine()" class="control-btn"> 🗑️ </button>
        </div>
        
        <div class="secondary-buttons-container">
        <button onclick="changeFontSize('up')" class="control-btn"> <img src="img/icons/increase-font.png" alt=""> </button>
        <button onclick="changeFontSize('down')" class="control-btn"> <img src="img/icons/decrease-font.png" alt=""> </button>
        <button onclick="onAlignChange('left')" class="control-btn t-a-left"> <img src="img/icons/align-left.png" alt=""> </button>
        <button onclick="onAlignChange('center')" class="control-btn t-a-center"> <img src="img/icons/align-center.png" alt=""> </button>
        <button onclick="onAlignChange('right')" class="control-btn t-a-right"> <img src="img/icons/align-right.png" alt=""> </button>
        <select class="font-type-btn" onchange="changeFontType(this.value)" name="fonts" >
        <option style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;" value="impact">Impact</option>
        <option style="font-family:Arial, Helvetica, sans-serif" value="arial">Arial</option>
        <option  style="font-family:'Times New Roman', Times, serif" value="times new roman">Times New Roman</option>
        </select>
        <label class="color-btn control-btn"> <img src="img/icons/palette.png" alt="">
        <input type="color" name="fillColor" onchange="onChangeColor('fill', this.value)" hidden>
        </label>
        <label class="color-btn control-btn"> <img src="img/icons/outline.png" alt="">
        <input type="color" name="strokeColor" onchange="onChangeColor('stroke', this.value)" hidden>
        </label>
        </div>

        <div class="load-buttons-container">
        <button onclick="_clearSelected()" class="load-button clear-btn" disabled> Clear </button>
        <a href="#" onclick="onDownloadCanvas(this)" download="myphoto" ><button class="load-button download-btn control-btn active"><img src="img/icons/download.png"</button></a>
        <a href="#" onclick="uploadImg(this)" >  <button class="load-button upload-btn control-btn active"><img src="img/icons/facebook.png"</button></a>
        </div>

        </div>
        
        </div>`
    elContainer.innerHTML = strHtml

    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
}

// DRAW

function drawText(txt, idx) {

    gElCanvas = document.getElementById('my-canvas')
    const settings = gCurrUserSettings
    const currLine = gMeme.lines[idx]
    const lines = gMeme.lines

    let y = null
    if (!currLine.position.y) {
        if (idx === 0) y = gElCanvas.offsetHeight / 9
        if (idx === 1) y = gElCanvas.offsetHeight / 10 * 9.5
        if (idx > 1) y = gElCanvas.offsetHeight / 1.8
    } else { y = currLine.position.y }

    let x = null
    if (!currLine.position.x) {
        if (gCurrUserSettings.align === 'left') x = gElCanvas.offsetWidth / 4
        if (gCurrUserSettings.align === 'center') x = gElCanvas.offsetWidth / 2
        if (gCurrUserSettings.align === 'right')  x = gElCanvas.offsetWidth - (gElCanvas.offsetWidth / 4)
    } else { x = currLine.position.x }


    gCtx.beginPath()
    gCtx.font = `${currLine.size}px ${settings.fontType}`;
    gCtx.textAlign = 'center';
    gCtx.lineWidth = 2;
    if (!currLine.fillColor) {
        gCtx.fillStyle = settings.fill
        currLine.fillColor = settings.fill
    }
    else gCtx.fillStyle = currLine.fillColor

    if (!currLine.strokeColor) {
        gCtx.strokeStyle = settings.stroke
        currLine.strokeColor = settings.stroke
    }
    else gCtx.strokeStyle = currLine.strokeColor

    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);

    gCtx.closePath()

    currLine.position.y = y
    currLine.position.x = x

    if (currLine.isMarked) {
        currLine.metric = getTextMetric(idx)
        drawRect(x, y, idx)
    }


}

function drawRect(x, y, idx) {
    const currLine = gMeme.lines[idx]
    const width = currLine.metric.width
    const height = currLine.metric.height
    gCtx.lineWidth = 1;
    gCtx.rect(x - (width / 2), y - height + 10, width, height);
    gCtx.strokeStyle = 'black'
    gCtx.stroke();
}


// LINE MANIPULATION

function moveText(direction) {
    _markFirst()
    const currLine = gMeme.lines[searchSelected()]

    if (direction === 'down') currLine.position.y += 5
    else if (direction === 'up') currLine.position.y -= 5
    renderMeme()
}



function changeColor(type, val) {
    const settings = gCurrUserSettings
    if (type === 'stroke') {
        settings.stroke = val
    }
    else if (type === 'fill') {
        settings.fill = val
    }
}

function changeLine() {
    const selectedLine = gMeme.lines[gMeme.selectedLineIdx]

    if ((gMeme.lines).length === 0) return
    else if ((gMeme.lines).length === 1) {
        if (selectedLine.isMarked) {
            selectedLine.isMarked = false
        } else {
            selectedLine.isMarked = true
        }
    }


    else if ((gMeme.lines).length > 1) {

        gMeme.lines.forEach((line, idx) => {
            if (idx !== gMeme.selectedLineIdx) line.isMarked = false
            else line.isMarked = true
        });

        gMeme.selectedLineIdx++
        if (gMeme.selectedLineIdx > (gMeme.lines).length - 1) {
            gMeme.selectedLineIdx = 0
        }
    }
    renderMeme()
    disableLoad()
    enableClear()
}

function changeFontSize(direction) {
    _markFirst()
    const currLine = gMeme.lines[searchSelected()]
    if (direction === 'up') currLine.size += 2
    else if (direction === 'down') currLine.size -= 2

    renderMeme()
}

function deleteLine() {
    const currLineIdx = searchSelected()
    if (currLineIdx === undefined) return
    const currLine = gMeme.lines[currLineIdx]
    const lines = gMeme.lines
    lines.splice(currLineIdx, 1)
    renderMeme()
}

function changeFontType(type) {
    gCurrUserSettings.fontType = type
    renderMeme()
}

function onAlignChange(direction) {
    gCurrUserSettings.align = direction
    const isntMarked = isNothingMarked()
    if (isntMarked) {
        _markFirst()
    }
    const currLineIdx = searchSelected()
    const currLine = gMeme.lines[currLineIdx]
    console.log(currLine)
    if (gCurrUserSettings.align === 'left') currLine.position.x = gElCanvas.offsetWidth / 4
    if (gCurrUserSettings.align === 'center') currLine.position.x = gElCanvas.offsetWidth / 2
    if (gCurrUserSettings.align === 'right') currLine.position.x = gElCanvas.offsetWidth - (gElCanvas.offsetWidth / 4)
    renderMeme()
}

// HELPERS

function getTextMetric(idx) {
    const currLine = gMeme.lines[idx]

    const text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = currLine.font;
    text.style.fontSize = currLine.size + "px";
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = `${currLine.text}`;

    const width = Math.ceil(text.clientWidth);
    const height = Math.ceil(text.clientHeight)

    document.body.removeChild(text);
    return ({ width, height })
}

function searchSelected() {
    let selected
    gMeme.lines.forEach((line, idx) => {
        if (line.isMarked) selected = idx
    });
    return selected
}


function _markFirst() {
    const nothingIsMarked = isNothingMarked()
    if (nothingIsMarked) gMeme.lines[0].isMarked = true
    disableLoad()
    enableClear()
}

function _clearSelected() {
    gMeme.lines.forEach((line) => {
        line.isMarked = false
    });
    renderMeme()
    enableDownload()
    disableClear()
}

function disableLoad() {
    const elDownloadBtn = document.querySelector('.download-btn')
    const elUploadBtn = document.querySelector('.upload-btn')

    elDownloadBtn.classList.remove('active')
    elUploadBtn.classList.remove('active')
    elDownloadBtn.disabled = true
    elUploadBtn.disabled = true
    gDisable.load = true
}

function enableDownload() {
    const elDownloadBtn = document.querySelector('.download-btn')
    const elUploadBtn = document.querySelector('.upload-btn')

    elDownloadBtn.disabled = false
    elUploadBtn.disabled = false
    elDownloadBtn.classList.add('active')
    elUploadBtn.classList.add('active')
    gDisable.load = false
}

function disableClear() {
    const elClearBtn = document.querySelector('.clear-btn')
    elClearBtn.disabled = true
    elClearBtn.classList.remove('active')
}

function enableClear() {
    const elClearBtn = document.querySelector('.clear-btn')
    elClearBtn.disabled = false
    elClearBtn.classList.add('active')
}

function isNothingMarked() {
    let nothingIsMarked = null
    gMeme.lines.forEach(line => {
        if (line.isMarked) nothingIsMarked = false
        else nothingIsMarked = true
    })
    return nothingIsMarked
}

// DOWNLOAD & UPLOAD

function onDownloadCanvas(elLink) {
    console.log(gDisable.load)
    if (!gDisable.load) {
        const data = gElCanvas.toDataURL();
        elLink.href = data;
        elLink.download = 'my-canvas'
    }
}

function uploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)

        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`)
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then((url) => {
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}
