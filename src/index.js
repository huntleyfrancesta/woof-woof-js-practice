BASE_URL = "http://localhost:3000/pups"

let allDoggos = []


document.addEventListener('DOMContentLoaded', () => {
    getDoggos()

    fetch(BASE_URL)
        .then(res => res.json())
        .then(dogData => allDoggos.push(dogData))

    let filter = document.querySelector("#good-dog-filter")
    filter.addEventListener('click', () => filterDogs(event, allDoggos))
})

const getDoggos = () => {
    document.querySelector('#dog-bar').innerHTML = ""
    fetch(BASE_URL)
        .then(res => res.json())
        .then(dogData => dogData.forEach(renderDogs))
}

const renderDogs = (dog) => {
    let dogBar = document.querySelector('#dog-bar')

    let dogButton = document.createElement('span')
    dogButton.innerText = dog.name

    dogButton.addEventListener('click', () => { showDog(dog) })

    dogBar.appendChild(dogButton)
}

const showDog = (dog) => {
    let dogInfo = document.querySelector("#dog-info")
    dogInfo.innerHTML = ""

    let dogImage = document.createElement("img")
    dogImage.src = dog.image

    let dogName = document.createElement("h2")
    dogName.innerText = dog.name

    let goodBoyButton = document.createElement("button")
    if (dog.isGoodDog === true) {
        goodBoyButton.innerText = "Good Dog!"
    } else if (dog.isGoodDog == false) {
        goodBoyButton.innerText = "Bad Dog!"
    }

    goodBoyButton.addEventListener('click', () => { changeStatus(dog) })

    dogInfo.append(dogImage, dogName, goodBoyButton)
}

const changeStatus = (dog) => {
    let reqPackage = {}
    reqPackage.headers = { "Content-Type": "application/json" }
    reqPackage.method = "PATCH"
    reqPackage.body = JSON.stringify({ isGoodDog: !dog.isGoodDog })

    fetch(BASE_URL + `/${dog.id}`, reqPackage)
        .then(res => res.json())
        .then(dogData => {
            updateArray(dogData)
            showDog(dogData)
                //write a function to change the master array with new data about this dog
                //find object in array, then change/replace data
        })
}

const filterDogs = (event, array) => {
    let status = event.target.innerText.split(" ")
    document.querySelector('#dog-bar').innerHTML = ""

    if (status[status.length - 1] == "OFF") {
        status[status.length - 1] = "ON"
        event.target.innerText = status.join(" ")
        let result = array[0].filter(dog => dog.isGoodDog == true)
        result.forEach(renderDogs)

    } else if (status[status.length - 1] == "ON") {
        status[status.length - 1] = "OFF"
        event.target.innerText = status.join(" ")
        let result = array[0]
        result.forEach(renderDogs)
    }

}

const updateArray = (dogData) => {
    allDoggos.find(dog => dog.id == dogData.id)
    for (let i = 0; i < allDoggos.length; i++) {
        if (allDoggos[i].id == dogData.id) {
            allDoggos[i].isGoodDog = dogData.isGoodDog;
        }
    }
}