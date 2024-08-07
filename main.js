let themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset"
]

// Custom Theme
for (let i in themes) {
    let k = document.createElement("li")
    let a = document.createElement("a")
    a.innerText = themes[i]
    a.addEventListener("click", () => {
        localStorage.setItem("theme", a.innerText);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", a.innerText)
    })
    k.appendChild(a)
    document.getElementById('List_Theme').appendChild(k)
}

let theme = localStorage.getItem("theme")
if (theme == null)
    localStorage.setItem("theme", 'synthwave');
else
    document.getElementsByTagName("html")[0].setAttribute("data-theme", theme)

// Date Picker
let date_picker = document.getElementById('date_picker')
let time_now
date_picker.addEventListener('focus', () => {
    // console.log('in')
    var today = new Date();
    time_now = today
    var DD = String(today.getDate()).padStart(2, '0');
    var MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var YYYY = today.getFullYear();
    let hour = today.getHours() + 1
    var hh = String(hour >= 24 ? hour - 24 : hour).padStart(2, '0')
    var mm = String(today.getMinutes()).padStart(2, '0')

    // format: YYYY-MM-DDThh:mm
    today = YYYY + '-' + MM + '-' + DD + 'T' + hh + ':' + mm;
    date_picker.setAttribute("min", today);
    date_picker.setAttribute("value", today);
    date_picker.value = today
})


// Note Render
let notes = {}
let index = []
let is_empty = false

function note_obj(data, start, end, id) {
    return {
        "data": data,
        "start": start,
        "end": end,
        "id": id
    }
}

function time_diff(start, end) {
    let diff = end - start
    if (diff > 0) {
        days = Math.floor(diff / (1000 * 60 * 60 * 24))
        hours = Math.floor(diff / (1000 * 60 * 60) - days * 24)
        mins = Math.ceil(diff / (1000 * 60) - days * 24 * 60 - hours * 60)
        return days.toString() + ' Days ' + hours.toString() + 'h ' + mins.toString() + 'm Left';
    }
    else {
        let days = Math.ceil(diff / (1000 * 60 * 60 * 24))
        let hours = Math.ceil(diff / (1000 * 60 * 60) - days * 24)
        let mins = Math.ceil(diff / (1000 * 60) - days * 24 * 60 - hours * 60)
        return 'Due ' + Math.abs(days).toString() + ' Days ' + Math.abs(hours).toString() + 'h ' + Math.abs(mins).toString() + 'm'
    }
}

function note(data, start, end, id) {
    let a = document.createElement('div')
    let b = time_diff(start, end)
    let c = new Date(end).toLocaleString()
    let theme = 'accent'
    if (b.includes('Due'))
        theme = 'error'

    a.setAttribute('class', 'px-3 w-full max-h-[50%]')
    a.setAttribute('id', `${id}`)
    let html = `<div class="relative lexend-regular bg-${theme} text-${theme}-content rounded-lg inline-flex p-3 hover:border-solid w-full h-full">
                    <input type="checkbox" class="checkbox border-2 border-${theme}-content mr-5 self-center" />
                    <div class="grid grid-cols-1 w-[95%] gap-2">
                        <p class="break w-full overflow-y-auto lexend-regular">${data}</p>
                        <p class="lexend-bold text-${theme}-content">${b}&ensp;|&emsp;${c}</p>
                    </div>
                </div>`
    a.innerHTML = html
    let checkbox = a.querySelector('input')
    checkbox.addEventListener('change', () => {
        if (checkbox.checked)
            index.push(a.getAttribute('id'))
        else {
            let temp = index.indexOf(a.getAttribute('id'))
            index.splice(temp, 1)
        }
        // console.log(index)
    })
    return a
}

notes = JSON.parse(localStorage.getItem('notes'))
if (notes == null) {
    localStorage.setItem('notes', JSON.stringify({}))
    notes = {}
}

let notes_keys = Object.keys(notes)
if (notes_keys.length == 0) {
    let temp = document.createElement('span')
    temp.setAttribute('id', "goodjob")
    temp.innerHTML = '<pre data-prefix=">" class="lexend-bold bg-warning text-warning-content">GOOD JOB THERE IS NO TODOs </pre>'
    document.getElementById('notes').appendChild(temp)
    is_empty = true
}
for (let i in notes_keys) {
    let a = notes[notes_keys[i]]
    let b = note(a['data'], new Date().valueOf().toString(), a['end'], a['id'])
    document.getElementById('notes').appendChild(b)
}

// CRUD
let add = document.getElementById('add')
let del = document.getElementById('del')
let input = document.getElementById('input')
add.addEventListener('click', () => {
    let txt_value = input.value.toString()
    let time_value = date_picker.value.toString()
    if (txt_value.length == 0 || time_value.length == 0)
        return

    let end_obj = new Date(time_value)
    let id = new Date().valueOf()
    let b = note(txt_value, time_now.valueOf(), end_obj.valueOf(), id)
    document.getElementById('notes').appendChild(b)
    // save to storage
    let obj = note_obj(txt_value, time_now.valueOf(), end_obj.valueOf(), id)
    notes[id.toString()] = obj
    localStorage.setItem('notes', JSON.stringify(notes))

    input.value = ''
    date_picker.setAttribute('value', '')
    date_picker.value = ''

    if (is_empty) {
        is_empty = false
        let temp = document.getElementById('goodjob')
        document.getElementById('notes').removeChild(temp)
    }
})

del.addEventListener('click', () => {
    let a = document.getElementById('notes')
    for (i in index) {
        let b = document.getElementById(index[i])
        a.removeChild(b)
        delete notes[index[i]]
    }
    index = []
    localStorage.setItem('notes', JSON.stringify(notes))
    if (Object.keys(notes).length == 0) {
        let temp = document.createElement('span')
        temp.setAttribute('id', "goodjob")
        temp.innerHTML = '<pre data-prefix=">" class="lexend-bold bg-warning text-warning-content">GOOD JOB THERE IS NO TODOs </pre>'
        document.getElementById('notes').appendChild(temp)
        is_empty = true
    }
})
