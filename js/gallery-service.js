var gGallery = [
{id: 1, aspectRatio: '1/1'},
{id: 2, aspectRatio: '1/1'},
{id: 3, aspectRatio: '1/1'},
{id: 5, aspectRatio: '1/1'},
{id: 6, aspectRatio: '1/1'},
{id: 7, aspectRatio: '1/1'},
{id: 8, aspectRatio: '1/1'},
{id: 9, aspectRatio: '1/1'},
{id: 10, aspectRatio: '1/1'},
{id: 11, aspectRatio: '1/1'},
{id: 12, aspectRatio: '1/1'},
{id: 13, aspectRatio: '1/1'},
{id: 14, aspectRatio: '1/1'},
{id: 15, aspectRatio: '1/1'},
{id: 16, aspectRatio: '1/1'},
{id: 17, aspectRatio: '1/1'},
{id: 18, aspectRatio: '1/1'}

]

function renderGallery() {
const elContainer = document.querySelector('.main-container')

var strHtmls = gGallery.map(image =>
`<img onclick="onPickImg(${image.id})" src="img/squareTemp/${image.id}.jpg" alt=""></img>`
)
    const joinedStr = strHtmls.join('')
    const joinedFinalStr = `<div class="gallery-container"> ${joinedStr} </div>`
    elContainer.innerHTML = joinedFinalStr

}


