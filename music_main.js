// Modal
let modal = document.getElementById('my_modal')
let modal_content = document.getElementById('modal_content')

modal.addEventListener('click', () => {
    modal.close()
})

modal_content.addEventListener('click', (event) => {
    event.stopPropagation()
})

// Function
let play_state = true
let loop = 'none'
let song_list = []
let song_idx = 0
let song_names = []
var tag = document.createElement('script');
let body = document.querySelector('#contaier')


tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data == 1) {
        document.getElementById('tile').innerText = event.target.videoTitle
        if (song_names[song_idx].includes('www.youtube.com')) {
            song_names[song_idx] = event.target.videoTitle
        }
        play_state = true
        document.getElementById('play').innerText = '❚❚'
        update_playlist_info()
    }

    if (event.data == 2) {
        play_state = false
        document.getElementById('play').innerText = '▶'
    }


    if (event.data == 0)
        if (loop == 'once') {
            player.loadVideoById(`${song_list[song_idx]}`)
        }
        else if (song_idx + 1 < song_list.length) {
            song_idx += 1
            player.loadVideoById(`${song_list[song_idx]}`)
        } else if (loop == 'all') {
            song_idx = 0
            player.loadVideoById(`${song_list[song_idx]}`)
        }
}

function onPlayerReady(event) {
    document.getElementById('controller').classList.replace('hidden', 'flex')

    let play_butt = document.getElementById('play')
    let loop_butt = document.getElementById('loop')


    play_butt.addEventListener('click', () => {
        if (play_state) {
            // play_butt.innerText = '▶'
            player.pauseVideo()
        } else {
            // play_butt.innerText = '❚❚'
            player.playVideo()
        }
        play_state = !play_state
    })

    loop_butt.addEventListener('click', () => {
        if (loop == 'none') {
            loop_butt.innerHTML = `<svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.71597 3.20277C8.98843 2.93241 9.43017 2.93241 9.70263 3.20277L11.5631 5.04893C11.7626 5.24692 11.8223 5.5447 11.7143 5.8034C11.6063 6.06209 11.352 6.23077 11.0698 6.23077H9.2093C5.99834 6.23077 3.39535 8.81374 3.39535 12C3.39535 15.1862 5.99857 17.7692 9.20956 17.7692H9.67442C10.0597 17.7692 10.3721 18.0792 10.3721 18.4615C10.3721 18.8439 10.0597 19.1538 9.67442 19.1538H9.20956C5.22801 19.1538 2 15.951 2 12C2 8.04904 5.22771 4.84615 9.2093 4.84615H9.38543L8.71597 4.18184C8.44351 3.91148 8.44351 3.47314 8.71597 3.20277Z" fill="currentColor"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6279 5.53846C13.6279 5.15611 13.9403 4.84615 14.3256 4.84615H14.7907C18.7723 4.84615 22 8.04904 22 12C22 15.951 18.7723 19.1538 14.7907 19.1538H14.6146L15.284 19.8182C15.5565 20.0885 15.5565 20.5269 15.284 20.7972C15.0116 21.0676 14.5698 21.0676 14.2974 20.7972L12.4369 18.9511C12.2374 18.7531 12.1777 18.4553 12.2857 18.1966C12.3937 17.9379 12.648 17.7692 12.9302 17.7692H14.7907C18.0017 17.7692 20.6047 15.1863 20.6047 12C20.6047 8.81374 18.0017 6.23077 14.7907 6.23077H14.3256C13.9403 6.23077 13.6279 5.92081 13.6279 5.53846Z" fill="currentColor"/>
                                        <path d="M5.48837 12C5.48837 9.96079 7.15429 8.30769 9.2093 8.30769H14.7907C16.8457 8.30769 18.5116 9.96079 18.5116 12C18.5116 14.0392 16.8457 15.6923 14.7907 15.6923H9.2093C7.15429 15.6923 5.48837 14.0392 5.48837 12Z" fill="currentColor"/>
                                    </svg>`
            loop = 'all'
        } else if (loop == 'all') {
            loop_butt.innerHTML = `<svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5 11.5L12 10V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M9.5 19.75C9.91421 19.75 10.25 19.4142 10.25 19C10.25 18.5858 9.91421 18.25 9.5 18.25V19.75ZM11 5V5.75C11.3033 5.75 11.5768 5.56727 11.6929 5.28701C11.809 5.00676 11.7448 4.68417 11.5303 4.46967L11 5ZM9.53033 2.46967C9.23744 2.17678 8.76256 2.17678 8.46967 2.46967C8.17678 2.76256 8.17678 3.23744 8.46967 3.53033L9.53033 2.46967ZM1.25 12C1.25 12.4142 1.58579 12.75 2 12.75C2.41421 12.75 2.75 12.4142 2.75 12H1.25ZM3.86991 15.5709C3.63293 15.2312 3.16541 15.1479 2.82569 15.3849C2.48596 15.6219 2.40267 16.0894 2.63965 16.4291L3.86991 15.5709ZM9.5 18.25H9.00028V19.75H9.5V18.25ZM9 5.75H11V4.25H9V5.75ZM11.5303 4.46967L9.53033 2.46967L8.46967 3.53033L10.4697 5.53033L11.5303 4.46967ZM2.75 12C2.75 8.54822 5.54822 5.75 9 5.75V4.25C4.71979 4.25 1.25 7.71979 1.25 12H2.75ZM2.63965 16.4291C4.03893 18.435 6.36604 19.75 9.00028 19.75V18.25C6.87703 18.25 5.00068 17.1919 3.86991 15.5709L2.63965 16.4291Z" fill="currentColor"/>
                                        <path d="M13 19V18.25C12.6967 18.25 12.4232 18.4327 12.3071 18.713C12.191 18.9932 12.2552 19.3158 12.4697 19.5303L13 19ZM14.4697 21.5303C14.7626 21.8232 15.2374 21.8232 15.5303 21.5303C15.8232 21.2374 15.8232 20.7626 15.5303 20.4697L14.4697 21.5303ZM14.5 4.25C14.0858 4.25 13.75 4.58579 13.75 5C13.75 5.41421 14.0858 5.75 14.5 5.75V4.25ZM22.75 12C22.75 11.5858 22.4142 11.25 22 11.25C21.5858 11.25 21.25 11.5858 21.25 12H22.75ZM20.1302 8.42907C20.3671 8.76881 20.8347 8.85211 21.1744 8.61514C21.5141 8.37817 21.5974 7.91066 21.3604 7.57093L20.1302 8.42907ZM15 18.25H13V19.75H15V18.25ZM12.4697 19.5303L14.4697 21.5303L15.5303 20.4697L13.5303 18.4697L12.4697 19.5303ZM14.5 5.75H15V4.25H14.5V5.75ZM21.25 12C21.25 15.4518 18.4518 18.25 15 18.25V19.75C19.2802 19.75 22.75 16.2802 22.75 12H21.25ZM21.3604 7.57093C19.9613 5.56497 17.6342 4.25 15 4.25V5.75C17.1232 5.75 18.9995 6.80806 20.1302 8.42907L21.3604 7.57093Z" fill="currentColor"/>
                                    </svg>`
            loop = 'once'
        } else if (loop == 'once') {
            loop_butt.innerHTML = `<svg width=1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 12L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                        <path d="M9.5 19.75C9.91421 19.75 10.25 19.4142 10.25 19C10.25 18.5858 9.91421 18.25 9.5 18.25V19.75ZM11 5V5.75C11.3033 5.75 11.5768 5.56727 11.6929 5.28701C11.809 5.00676 11.7448 4.68417 11.5303 4.46967L11 5ZM9.53033 2.46967C9.23744 2.17678 8.76256 2.17678 8.46967 2.46967C8.17678 2.76256 8.17678 3.23744 8.46967 3.53033L9.53033 2.46967ZM1.25 12C1.25 12.4142 1.58579 12.75 2 12.75C2.41421 12.75 2.75 12.4142 2.75 12H1.25ZM3.86991 15.5709C3.63293 15.2312 3.16541 15.1479 2.82569 15.3849C2.48596 15.6219 2.40267 16.0894 2.63965 16.4291L3.86991 15.5709ZM9.5 18.25H9.00028V19.75H9.5V18.25ZM9 5.75H11V4.25H9V5.75ZM11.5303 4.46967L9.53033 2.46967L8.46967 3.53033L10.4697 5.53033L11.5303 4.46967ZM2.75 12C2.75 8.54822 5.54822 5.75 9 5.75V4.25C4.71979 4.25 1.25 7.71979 1.25 12H2.75ZM2.63965 16.4291C4.03893 18.435 6.36604 19.75 9.00028 19.75V18.25C6.87703 18.25 5.00068 17.1919 3.86991 15.5709L2.63965 16.4291Z" fill="currentColor"/>
                                        <path d="M13 19V18.25C12.6967 18.25 12.4232 18.4327 12.3071 18.713C12.191 18.9932 12.2552 19.3158 12.4697 19.5303L13 19ZM14.4697 21.5303C14.7626 21.8232 15.2374 21.8232 15.5303 21.5303C15.8232 21.2374 15.8232 20.7626 15.5303 20.4697L14.4697 21.5303ZM14.5 4.25C14.0858 4.25 13.75 4.58579 13.75 5C13.75 5.41421 14.0858 5.75 14.5 5.75V4.25ZM22.75 12C22.75 11.5858 22.4142 11.25 22 11.25C21.5858 11.25 21.25 11.5858 21.25 12H22.75ZM20.1302 8.42907C20.3671 8.76881 20.8347 8.85211 21.1744 8.61514C21.5141 8.37817 21.5974 7.91066 21.3604 7.57093L20.1302 8.42907ZM15 18.25H13V19.75H15V18.25ZM12.4697 19.5303L14.4697 21.5303L15.5303 20.4697L13.5303 18.4697L12.4697 19.5303ZM14.5 5.75H15V4.25H14.5V5.75ZM21.25 12C21.25 15.4518 18.4518 18.25 15 18.25V19.75C19.2802 19.75 22.75 16.2802 22.75 12H21.25ZM21.3604 7.57093C19.9613 5.56497 17.6342 4.25 15 4.25V5.75C17.1232 5.75 18.9995 6.80806 20.1302 8.42907L21.3604 7.57093Z" fill="currentColor"/>
                                    </svg>`
            loop = 'none'
        }
    })

    document.getElementById('volume').addEventListener('input', () => {
        let value = Math.round(document.getElementById('volume').value)
        player.setVolume(value)
    })

    document.getElementById('next').addEventListener('click', () => {
        if (song_idx + 1 < song_list.length) {
            song_idx += 1
            player.loadVideoById(`${song_list[song_idx]}`)
        } else if (loop == 'all') {
            song_idx = 0
            player.loadVideoById(`${song_list[song_idx]}`)
        }
    })

    document.getElementById('prev').addEventListener('click', () => {
        if (song_idx - 1 >= 0) {
            song_idx -= 1
            player.loadVideoById(`${song_list[song_idx]}`)
        }
    })

}

document.getElementById('play_current').addEventListener('click', () => {
    let b = document.getElementById('txt')
    if (b.value.includes('www.youtube.com/watch?v=')) {

        let c = b.value.split('?v=')
        if (c[1].includes('&')) {
            c = c[1].split('&')[0]
        }
        else {
            c = c[1]
        }

        // console.log(body.children)
        if (body.children.length == 0) {
            let a = document.createElement('iframe')
            a.setAttribute('id', 'player')
            a.setAttribute('src', `https://www.youtube.com/embed/${c}?autoplay=1&enablejsapi=1`)
            a.setAttribute('width', '420')
            a.setAttribute('height', '345')
            // a.style.display = 'none'
            song_list.push(c)
            song_names.push(`https://www.youtube.com/watch?v=${c}`)
            body.appendChild(a)
            onYouTubeIframeAPIReady()
        }
        else {
            song_list = []
            song_names = []
            song_list.push(c)
            song_names.push(`https://www.youtube.com/watch?v=${c}`)
            song_idx = 0
            player.loadVideoById(`${c}`)
        }
    }
})

document.getElementById('add_playlist').addEventListener('click', () => {
    let b = document.getElementById('txt')
    if (b.value.includes('www.youtube.com/watch?v=')) {

        let c = b.value.split('?v=')
        if (c[1].includes('&')) {
            c = c[1].split('&')[0]
        }
        else {
            c = c[1]
        }

        let body = document.querySelector('#contaier')
        // console.log(body.children)
        if (body.children.length == 0) {
            let a = document.createElement('iframe')
            a.setAttribute('id', 'player')
            a.setAttribute('src', `https://www.youtube.com/embed/${c}?autoplay=1&enablejsapi=1`)
            a.setAttribute('width', '420')
            a.setAttribute('height', '345')
            // a.style.display = 'none'
            song_list.push(c)
            song_names.push(`https://www.youtube.com/watch?v=${c}`)
            body.appendChild(a)
            onYouTubeIframeAPIReady()
        }
        else {
            song_list.push(c)
            song_names.push(`https://www.youtube.com/watch?v=${c}`)
            update_playlist_info()
        }

    }
})

function update_playlist_info() {
    let info = document.getElementById('playlist_info')
    info.className = 'flex flex-col overflow-hidden'
    info.classList.add('lexend-regular')
    let song_len = song_list.length.toString() + ' in the playlist'
    let list_info = document.createElement('ol')
    list_info.className = 'pe-3 overflow-y-auto flex flex-col gap-2 grow'
    for (let i in song_list) {
        i = parseInt(i)
        let temp = document.createElement('li')
        let div = document.createElement('div')
        div.className = 'flex gap-3 ml-2'
        let ply_butt = document.createElement('button')
        ply_butt.classList.add('btn')
        ply_butt.classList.add('btn-sm')
        ply_butt.innerText = '▶'
        let del_butt = document.createElement('button')
        del_butt.innerText = '⛌'
        del_butt.classList.add('btn')
        del_butt.classList.add('btn-sm')
        let text_info = document.createElement('p')
        text_info.innerText = song_names[i]
        div.appendChild(ply_butt)
        div.appendChild(del_butt)
        div.appendChild(text_info)
        temp.appendChild(div)

        list_info.appendChild(temp)
        if (i == song_idx) {
            text_info.classList.add('text-accent')
            // temp.scrollIntoView({ behavior: "smooth", block: "center" })
        }
       

        ply_butt.addEventListener('click', () => {
            song_idx = i
            console.log(song_idx)
            player.loadVideoById(song_list[i])
        })

        del_butt.addEventListener('click', () => {
            if (song_idx != i) {
                song_list.splice(i, 1)
                song_names.splice(i, 1)
                if (i < song_idx)
                    song_idx -= 1
                update_playlist_info()
            }
        })

    }
    info.innerHTML = `<p class='mb-2 shrink-0'>${song_len}</p>`
    info.appendChild(list_info)
    list_info.querySelectorAll('li')[song_idx].scrollIntoView({ behavior: "smooth", block: "center" })
}