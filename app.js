document.addEventListener("DOMContentLoaded", () => {
  const mashapeKey = `oaQ37rOdEymshQuTchX0YcpHvg57p1rIczVjsn1LeIL3QWibs8`

  let data = JSON.parse(localStorage.getItem(`data`)) || {};

  axios.get('https://cryptic-basin-89110.herokuapp.com/api.hearthstonejson.com/v1/25770/enUS/cards.collectible.json')
    .then((response) => {
      localStorage.setItem(`data`, JSON.stringify(response.data))

      data = JSON.parse(localStorage.getItem(`data`))

      document.getElementById(`loadText`).innerText = `Please select an option from the top`

      searchButton.addEventListener(`click`, (event) => {
        errorText.innerText = ``
        clearContent()
        buildSearch()
      })

      cardBackButton.addEventListener(`click`, (event) => {
        clearContent()
        errorText.innerText = ``
        axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cardbacks', {
            headers: {
              "X-Mashape-Key": `${mashapeKey}`
            }
          })
          .then((response) => {
            let row = createRow()
            for (let i = 0; i < response.data.length; i++) {
              let card = createCard(`${response.data[i].name}`, `${response.data[i].description}`, `${response.data[i].imgAnimated}`, `${response.data[i].howToGet}`)
              if (i !== 0 && i % 4 === 0)
                row = createRow()
              row.appendChild(card)
              content.appendChild(row)
            }
          })
          .catch((error) => {});
      })
    })
    .catch((error) => {});

  let heroes = [`DRUID`, `HUNTER`, `MAGE`, `PALADIN`, `PRIEST`, `SHAMAN`, `WARLOCK`, `WARRIOR`, `NEUTRAL`]
  let options = [`Name`, `Attack Strength`, `Mana Cost`, `Hero`, `Health`]
  let filteredFormData = {}
  let errorText = document.getElementById(`error`)
  let content = document.getElementById(`content`)
  let searchButton = document.getElementById(`searchButton`)
  let cardBackButton = document.getElementById(`cardBackButton`)
  let cardModalTitle = document.getElementById(`cardModalTitle`)
  let cardModalBody = document.getElementById(`cardModalBody`)



  function clearContent() {
    while (content.hasChildNodes()) {
      content.removeChild(content.childNodes[0])
    }
  }

  function buildSearch() {
    clearContent()
    createInputForm()
  }

  function createInputForm() {
    if (document.getElementById(`searchForm`))
      removeElement(`searchForm`)
    let form = document.createElement(`form`)
    let formGroup = document.createElement(`div`)
    formGroup.classList.add(`form-group`)
    formGroup.id = `searchForm`
    for (let option of options) {
      let row = createRow()
      let label = document.createElement(`label`)
      let input = document.createElement(`input`)
      input.classList.add(`form-control`)
      input.name = `${option}`
      label.htmlFor = `${option}`
      switch (option) {
        case `Name`:
          label.innerText = `${option}`
          input.id = `name`
          input.placeholder = `Enter Card Name`
          input.autofocus = true
          break;
        case `Attack Strength`:
          label.innerText = `${option}`
          input.id = `attack`
          input.placeholder = `Enter (#) Attack Strength`
          input.type = `number`
          input.min = 0
          break;
        case `Mana Cost`:
          label.innerText = `${option}`
          input.id = `cost`
          input.placeholder = `Enter (#) Mana Cost`
          input.type = `number`
          input.min = 0
          break;
        case `Hero`:
          label.innerText = `${option}`
          input = createHeroSelect()
          break;
        case `Health`:
          label.innerText = `${option}`
          input.id = `health`
          input.placeholder = `Enter (#) Health`
          input.type = `number`
          input.min = 0
          break;
        default:
          input.type = `text`
      }
      row.appendChild(label)
      row.appendChild(input)
      form.appendChild(row)
    }
    let submitButton = document.createElement(`input`)
    submitButton.classList.add(`btn`)
    submitButton.type = `submit`
    formGroup.appendChild(submitButton)
    form.addEventListener(`submit`, submitEvent)
    form.appendChild(formGroup)
    content.appendChild(form)
  }

  function submitEvent(event) {
    event.preventDefault()
    error.innerText = ``
    filteredFormData = parseForm(event)
    if (!Object.keys(filteredFormData).length) {
      errorText.innerText = `Please enter at least one option`
      return
    }
    let result = parseData(filteredFormData)
    displayCards(result)
  }

  function displayCards(result) {
    clearContent()
    if (result.length === 0) {
      errorText.innerText = `No cards found. Please Search Again`
      return
    }
    let moreInfoText = document.createElement(`div`)
    moreInfoText.id = `moreInfoText`
    moreInfoText.innerText = `Click a card for more Information`
    content.appendChild(moreInfoText)
    let row = createRow()
    let modalAnchor = document.createElement(`a`)
    modalAnchor.href = `#cardModal`
    modalAnchor.role = `button`
    modalAnchor.setAttribute(`data-toggle`, `modal`)
    for (let i = 0; i < result.length; i++) {
      let {
        id
      } = result[i]
      let image = document.createElement(`img`)
      image.classList.add(`card`)
      image.src = `https://art.hearthstonejson.com/v1/render/latest/enUS/512x/${id}.png`
      image.id = `${id}`
      modalAnchor.appendChild(image)
      modalAnchor.addEventListener(`click`, modalClicked)
      row.appendChild(modalAnchor)
    }
    content.appendChild(row)
  }

  function modalClicked(event) {
    while (cardModalBody.hasChildNodes()) {
      cardModalBody.removeChild(cardModalBody.childNodes[0])
    }
    let card = data.filter(card => card.id === event.target.id)
    cardModalTitle.innerText = card[0].name
    let image = document.createElement(`img`)
    image.src = `https://art.hearthstonejson.com/v1/512x/${event.target.id}.jpg`
    image.id = `modalImage`
    cardModalBody.appendChild(image)
    let cardText = document.createElement(`p`)
    cardText.innerText = `Artist: ${card[0].artist}`
    cardModalBody.appendChild(cardText)
  }

  function parseData(filteredInput) {
    return data.filter(card => matches(card, filteredInput))
  }

  function matches(card, filteredInput) {
    let result = true
    for (let key of Object.keys(filteredInput)) {
      // if key is "name field"
      if (key !== `name`) {
        result &= card[key] == filteredInput[key]
      } else {
        result &= card[key].toLowerCase().includes(filteredInput[key].toLowerCase())
      }
    }
    return result
  }

  function parseForm(event) {
    let result = {}
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].value) {
        result[event.target[i].id] = event.target[i].value
      }
    }
    return result
  }

  function createHeroSelect() {
    let input = document.createElement(`select`)
    input.classList.add(`form-control`)
    input.id = `cardClass`
    let selectOption = document.createElement(`option`)
    selectOption.text = `Select a Hero`
    selectOption.value = ""
    selectOption.disabled = true;
    selectOption.selected = true;
    input.add(selectOption)
    for (hero of heroes) {
      selectOption = document.createElement(`option`)
      selectOption.text = `${hero}`
      selectOption.value = `${hero}`
      input.add(selectOption)
    }
    return input
  }

  function createCard(title, flavorText, imgSrc, howToGet) {
    let col = createCol(12)
    let card = document.createElement(`div`)
    card.classList.add(`card`)
    let cardBody = document.createElement(`div`)
    cardBody.classList.add(`card-body`)
    let cardImage = document.createElement(`img`)
    cardImage.onerror = () => {
      col.style.display = `none`
      col.classList.add(`remove`)
    }
    cardImage.classList.add(`card-image`)
    cardImage.src = imgSrc
    cardBody.appendChild(cardImage)
    let cardTitle = document.createElement(`h4`)
    cardTitle.innerText = title
    cardTitle.classList.add(`card-title`)
    cardBody.appendChild(cardTitle)

    let cardText = document.createElement(`div`)
    cardText.classList.add(`card-text`)
    cardText.innerText = flavorText
    cardBody.appendChild(cardText)
    let footer = document.createElement(`footer`)
    footer.classList.add(`blockquote-footer`)
    footer.innerText = `How to get: ${howToGet}`
    cardBody.appendChild(footer)
    card.appendChild(cardBody)
    col.appendChild(card)
    let link = document.createElement(`a`)
    link.href = `#top`
    link.innerText = `Back to Top`
    col.appendChild(link)
    return col
  }

  function createRow() {
    let row = document.createElement(`div`)
    row.classList.add(`row`)
    return row
  }

  function createCol(howManyCols) {
    let col = document.createElement(`div`)
    col.classList.add(`col-sm-${howManyCols}`)
    content.appendChild(col)
    return col
  }
})
