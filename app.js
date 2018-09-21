document.addEventListener("DOMContentLoaded", () => {
  // API Key
  const mashapeKey = `oaQ37rOdEymshQuTchX0YcpHvg57p1rIczVjsn1LeIL3QWibs8`
  // All the searchable card classes
  const HEROES = [`DRUID`, `HUNTER`, `MAGE`, `PALADIN`, `PRIEST`, `SHAMAN`, `WARLOCK`, `WARRIOR`, `NEUTRAL`]
  // ALl the availible search options
  const OPTIONS = [`Name`, `Attack Strength`, `Mana Cost`, `Hero`, `Health`]
  // Will store the stringified response of the following get call.
  let data = {};
  // API call that responds with data for every card in the game.
  axios.get('https://cryptic-basin-89110.herokuapp.com/api.hearthstonejson.com/v1/25770/enUS/cards.collectible.json')
    .then((response) => {
      // Sets the GET response to local storage to parse and work with from there. Since the data returned is typically static and updates a few times a year, one call and storing the data would be overall much more efficient. Since it takes a bit of random time before the data is stored in the local storage, I have waited until after it is set to change the text displayed in the #content element and add event listeners, making it easy to understand things are loading.
      localStorage.setItem(`data`, JSON.stringify(response.data))
      // Parses the data in the local storage.
      data = JSON.parse(localStorage.getItem(`data`))
      // Replaces default text in the #loadText element, letting user know the app is functional.
      document.getElementById(`loadText`).innerText = `Please select an option from the top`
      // On click event, call function buildSearch(event).
      searchButton.addEventListener(`click`, buildSearch)
      // On click event, call function buildAbout(event).
      aboutButton.addEventListener(`click`, buildAbout)
      // On click event, clears the #content element and removes any error text. An API call is made to gather the image links of all the availible card backs in the game. When GET call returns, the corresponding data is used to create card backs and append them the #content element.
      cardBackButton.addEventListener(`click`, (event) => {
        clearContent()
        errorText.innerText = ``
        axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cardbacks', {
            headers: {
              "X-Mashape-Key": `${mashapeKey}`
            }
          })
          .then((response) => {
            let moreInfoText = document.createElement(`div`)
            moreInfoText.id = `moreInfoText`
            moreInfoText.innerText = `Click a card back to zoom in`
            content.appendChild(moreInfoText)
            let row = createRow()
            for (let i = 0; i < response.data.length; i++) {
              let cardBack = createCardBack(`${response.data[i].name}`, `${response.data[i].description}`, `${response.data[i].imgAnimated}`, `${response.data[i].howToGet}`)
              if (i !== 0 && i % 3 === 0)
                row = createRow()
              row.appendChild(cardBack)
              content.appendChild(row)
            }
          })
          .catch((error) => {});
      })
    })
    .catch((error) => {});


  // Static HTML elements
  let errorText = document.getElementById(`error`)
  let content = document.getElementById(`content`)
  let searchButton = document.getElementById(`searchButton`)
  let homeButton = document.getElementById(`homeButton`)
  let cardBackButton = document.getElementById(`cardBackButton`)
  let cardModalTitle = document.getElementById(`cardModalTitle`)
  let cardModalBody = document.getElementById(`cardModalBody`)
  let jumbotron = document.getElementById(`jumbotron`)


  // Clears all child elements in the #content element.
  function clearContent() {
    if (jumbotron.style.display === "block") {
        jumbotron.style.display = "none";
    }
    while (content.hasChildNodes()) {
      content.removeChild(content.childNodes[0])
    }
  }
  // Clears the #content element, and then calls the function that builds the input form.
  function buildSearch() {
    clearContent()
    createInputForm()
  }

  // Clears the #content element, and then calls the function that builds the About page.
  function buildAbout() {
    clearContent()
    createAboutPage()
  }

  function createAboutPage() {
    errorText.innerText = ``

    if (jumbotron.style.display === `` || "none") {
      jumbotron.style.display = "block"
    } else {
      console.log(jumbotron.style.display);
    }
  }
  // Builds and displays the form used for search parameters for the cards to be displayed in the #content element.
  function createInputForm() {
    errorText.innerText = ``
    if (document.getElementById(`searchForm`))
      removeElement(`searchForm`)
    let form = document.createElement(`form`)
    let formGroup = document.createElement(`div`)
    formGroup.classList.add(`form-group`)
    formGroup.id = `searchForm`
    for (let option of OPTIONS) {
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
          input.placeholder = `Full or Partial Card Name`
          input.autofocus = true
          break;
        case `Attack Strength`:
          label.innerText = `${option}`
          input.id = `attack`
          input.placeholder = `Enter (0-20) Attack Strength`
          input.type = `number`
          input.min = 0
          input.max = 20
          break;
        case `Mana Cost`:
          label.innerText = `${option}`
          input.id = `cost`
          input.placeholder = `Enter (0-20) Mana Cost`
          input.type = `number`
          input.min = 0
          input.max = 20
          break;
        case `Hero`:
          label.innerText = `${option}`
          input = createHeroSelect()
          break;
        case `Health`:
          label.innerText = `${option}`
          input.id = `health`
          input.placeholder = `Enter (0-30) Health`
          input.type = `number`
          input.min = 0
          input.max = 30
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
  // Verifies that at least one field has a value. If true, then it parses the input fields containing a value, then calls a function to find and a function to display the results that match the search form parameters given.
  function submitEvent(event) {
    event.preventDefault()
    error.innerText = ``
    formData = parseForm(event)
    if (!Object.keys(formData).length) {
      errorText.innerText = `Please enter at least one option`
      return
    }
    let result = findResult(formData)
    displayResult(result)
  }
  // Clears the #content element, then if result.length is 0, no cards were found to display and message is displayed. If results contains data, Informational title is created to display additional functionality, followed by game image renders of the card. The image itself is a link to activate a modal that displays that card's full art.
  function displayResult(result) {
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
      image.classList.add(`resize`)
      modalAnchor.appendChild(image)
      modalAnchor.addEventListener(`click`, modalClicked)
      row.appendChild(modalAnchor)
    }
    content.appendChild(row)
  }
  // Clears the information in the #cardModalBody element, then appends the correct information to the same element before the modal is displayed
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
    cardText.id = `cardText`
    cardText.innerText = `${card[0].flavor}\nArtist: ${card[0].artist}`
    cardModalBody.appendChild(cardText)
  }
  // Returns the data needed to display the correct cards based on the formData object that was gathered from the input fields.
  function findResult(formData) {
    return data.filter(card => matches(card, formData))
  }
  // Checks the keys in the formData object and their values and only returns true when all pairs match their key/value pair in the data object
  function matches(card, formData) {
    let result = true
    for (let key of Object.keys(formData)) {
      // if key is "name field"
      if (key !== `name`) {
        result &= card[key] == formData[key]
      } else {
        result &= card[key].toLowerCase().includes(formData[key].toLowerCase())
      }
    }
    return result
  }
  // Returns an object where the form's input fields and their value are made into key/value pairs that correspond the correct key name and value pattern used in the data object
  function parseForm(event) {
    let result = {}
    for (let i = 0; i < event.target.length; i++) {
      if (event.target[i].value) {
        result[event.target[i].id] = event.target[i].value
      }
    }
    return result
  }
  // Returns a HTML input element of type `select` that contains all the strings in the const HEROES array as `options`.
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
    for (hero of HEROES) {
      selectOption = document.createElement(`option`)
      selectOption.text = `${hero}`
      selectOption.value = `${hero}`
      input.add(selectOption)
    }
    return input
  }
  // Returns a 12 column wide bootstrap card, The image of the card back being the imgSrc provided with included text on the card back title, the flavor text associated with that card back, and the tasks needed to unlock.
  function createCardBack(title, flavorText, imgSrc, howToGet) {
    let col = createCol(4)
    col.id = title
    let card = document.createElement(`div`)
    card.classList.add(`card`)
    let cardBody = document.createElement(`div`)
    cardBody.classList.add(`card-body`)
    let modalAnchor = document.createElement(`a`)
    modalAnchor.id = imgSrc
    modalAnchor.href = `#cardModal`
    modalAnchor.role = `button`
    modalAnchor.setAttribute(`data-toggle`, `modal`)
    let cardImage = document.createElement(`img`)
    cardImage.onerror = () => {
      col.style.display = `none`
      document.getElementById(title).remove()
    }
    cardImage.id = `${imgSrc}`
    cardImage.classList.add(`card-image`)
    cardImage.src = imgSrc
    modalAnchor.appendChild(cardImage)
    modalAnchor.addEventListener(`click`, cardBackModalClicked)
    cardBody.appendChild(modalAnchor)
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
    col.appendChild(cardBody)
    let link = document.createElement(`a`)
    link.href = `#top`
    link.innerText = `Back to Top`
    col.appendChild(link)
    return col
  }

  function cardBackModalClicked(event) {
    while (cardModalBody.hasChildNodes()) {
      cardModalBody.removeChild(cardModalBody.childNodes[0])
    }
    document.getElementById(`cardModalTitle`).innerText = ``
    let image = document.createElement(`img`)
    image.classList.add(`card-image`)
    image.src = event.target.id
    // image.src = event.target.id
    image.id = `cardBackModalImage`
    cardModalBody.appendChild(image)
  }

  // Simple function that returns a bootstrap row.
  function createRow() {
    let row = document.createElement(`div`)
    row.classList.add(`row`)
    return row
  }
  // Simple function that returns a bootstrap column that is howManyCols wide
  function createCol(howManyCols) {
    let col = document.createElement(`div`)
    col.classList.add(`col-sm-${howManyCols}`)
    content.appendChild(col)
    return col
  }
})
