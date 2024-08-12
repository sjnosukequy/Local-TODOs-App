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
    if (date_picker.value == '') {
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
    }
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
        "id": id,
        "done": false
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

function note(data, start, end, id, done) {
    let a = document.createElement('div')
    let b = time_diff(start, end)
    let c = new Date(end).toLocaleString()
    let theme = 'accent'
    if (done === false || done === null || done === undefined)
        if (b.includes('Due'))
            theme = 'error'
    if (done === true) {
        theme = 'info'
    }

    a.setAttribute('class', 'px-3 w-full max-h-[50%]')
    a.setAttribute('id', `${id}`)
    let html = `<div class="relative lexend-regular bg-${theme} text-${theme}-content rounded-lg inline-flex p-3 hover:border-solid w-full h-full">
                    <input type="checkbox" class="checkbox border-2 border-${theme}-content mr-5 self-center" />
                    <div class="grid grid-cols-1 w-[95%] gap-2">
                        <p class="text-sm md:text-base break w-full overflow-y-auto lexend-regular">${data}</p>
                        <p class="text-sm md:text-base lexend-bold text-${theme}-content">${b} | ${c}</p>
                    </div>
                </div>`
    a.innerHTML = html

    if (done === true) {
        let content = a.querySelectorAll('p')[1]
        content.innerText = 'DONE ' + content.innerText.replace(/\xA0/g, '').split('|')[1]
    }

    // Set Checkbox event
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

// Init Render
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
    let b = note(a['data'], new Date().valueOf().toString(), a['end'], a['id'], a['done'])
    document.getElementById('notes').appendChild(b)
}

// Timer and Re-render
let timer = document.getElementById('time')
const config_timer = { attributes: false, childList: true, subtree: false };
const change_event = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            let time_check = new Date().valueOf()
            let time_check_current_sec = Math.floor(time_check % (60 * 1000) / 1000)
            // console.log(time_check_current_sec)
            let time_diff = (60 - time_check_current_sec) * 1000

            setTimeout(() => {
                re_render()
                set_timer()
            }, time_diff);
        }
    }
};
const observer = new MutationObserver(change_event);
observer.observe(timer, config_timer);

function set_timer() {
    let init_time = new Date()
    let init_date = init_time.toDateString()
    let init_timestring = init_time.toTimeString().split(' ')[0]
    let init_HH = init_timestring.split(':')
    timer.innerText = `${init_date}
        ${init_HH[0]} : ${init_HH[1]}`
}
set_timer()

function re_render() {
    for (let i in notes_keys) {
        let a = notes[notes_keys[i]]
        let b = note(a['data'], new Date().valueOf().toString(), a['end'], a['id'], a['done'])
        let current_code = document.getElementById(a['id'])
        let check_idx = index.indexOf(a['id'].toString())
        if (check_idx != -1)
            b.querySelector('input').checked = 'checked'
        document.getElementById('notes').replaceChild(b, current_code)
    }
}

// CRUD
let add = document.getElementById('add')
let del = document.getElementById('del')
let input = document.getElementById('input')
let done = document.getElementById('done')

add.addEventListener('click', () => {
    let txt_value = input.value.toString()
    let time_value = date_picker.value.toString()
    if (txt_value.length == 0 || time_value.length == 0)
        return

    let end_obj = new Date(time_value)
    let id = new Date().valueOf()
    let b = note(txt_value, time_now.valueOf(), end_obj.valueOf(), id, false)
    document.getElementById('notes').appendChild(b)
    // save to storage
    let obj = note_obj(txt_value, time_now.valueOf(), end_obj.valueOf(), id, false)
    notes[id.toString()] = obj
    localStorage.setItem('notes', JSON.stringify(notes))
    notes_keys.push(id.toString())

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
        notes_keys.splice(notes_keys.indexOf(index[i]), 1)
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

done.addEventListener('click', () => {
    let a = document.getElementById('notes')
    for (i in index) {
        let b = document.getElementById(index[i])
        let new_b = note(notes[index[i]]['data'], notes[index[i]]['start'], notes[index[i]]['end'], index[i], true)
        a.replaceChild(new_b, b)
        notes[index[i]]['done'] = true
    }
    index = []
    localStorage.setItem('notes', JSON.stringify(notes))
})
