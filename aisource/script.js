import bot from './assets/bot.svg'
import user from './assets/user.svg'

let form = document.querySelector('form');
let chatcontainer = document.querySelector('#chat_container')

let loadInterval;

function loader(element) { 
    element.textContent = ''
    loadInterval = setInterval(() => { 
        element.textContent += '.';
        if (element.textContent === '....') { 
            element.textContent = ''
        }
    },300)
}

function typetext(element, text) { 
    let index = 0
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++;
        } else { 
            clearInterval(interval)
        }
    }, 20);
}

function generateUniqueid() { 
    let timestamp = Date.now()
    const randomnumber = Math.random();
    let hexanumberstring = randomnumber.toString(16)
    return `id-${timestamp}-${hexanumberstring}`
}

function chatstripe(isAi, value, uniqueid) {
    return (
        `
          <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
              <div class="profile">
                <img src="${isAi ? bot : user }" alt="${isAi ? 'bot' : 'user'}"/>
              </div>
              <div class="message" id=${uniqueid}>${value}</div>
            </div>
          </div>
        `
    )
}

const handleSubmit = async (e) => { 
    e.preventDefault();

    const data = new FormData(form);
    // users chat stripe

    chatcontainer.innerHTML += chatstripe(false, data.get('prompt'))

    form.reset()

    // bots chatstripe

    let uniqueid = generateUniqueid()
    chatcontainer.innerHTML += chatstripe(true," ", uniqueid)
    chatcontainer.scrollTop = chatcontainer.scrollHeight;

    const messagediv = document.getElementById(uniqueid);
    loader(messagediv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
           prompt:data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messagediv.innerHTML = ''

    if (response.ok) {
        const data = await response.json()
        const parsedata = data.bot.trim()
        console.log({parsedata})
        typetext(messagediv, parsedata)

    } else { 
        const err = response.text()
        messagediv.innerHTML = 'Something Went wrong'
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', function (e) { 
    if (e.keyCode === 13) { 
        handleSubmit(e)
    }
})