document.addEventListener("DOMContentLoaded", () => {
  const mashapeKey = `oaQ37rOdEymshQuTchX0YcpHvg57p1rIczVjsn1LeIL3QWibs8`
  // let name = `leeroy`

  let classes = [`Druid`, `Hunter`, `Mage`, `Paladin`, `Priest`, `Rogue`, `Shaman`, `Warlock`, `Warrior`]
  let options = [`Name`, `Attack Strength`, `Mana Cost`, `Race`, `Health`]
  let content = document.getElementById(`content`)
  let searchButton = document.getElementById(`searchButton`)
  let cardBackButton = document.getElementById(`cardBackButton`)
  let randomButton = document.getElementById(`randomButton`)


  searchButton.addEventListener(`click`, (event) => {
    console.log(`Search Button Clicked`);
    clearContent()
    buildSearch()
  })

  cardBackButton.addEventListener(`click`, (event) => {
    console.log(`Card Back Button Clicked`)
    clearContent()
    axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cardbacks', {
        headers: {
          "X-Mashape-Key": `${mashapeKey}`
        }
      })
      .then((response) => {
        console.log(response);
        let row = createRow()
        for (let i = 0; i < response.data.length; i++) {
          let card = createCard(`${response.data[i].name}`, `${response.data[i].description}`, `${response.data[i].imgAnimated}`, `${response.data[i].howToGet}`)
          if (i !== 0 && i % 4 === 0)
            row = createRow()
          row.appendChild(card)
          content.appendChild(row)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  })
  randomButton.addEventListener(`click`, (event) => {
    console.log(`Random Button Clicked`);
    clearContent()
  })

  function clearContent() {
    while (content.hasChildNodes()) {
      content.removeChild(content.childNodes[0])
    }
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
    return col

    // image.src = response.data[i].imgAnimated
    // image.onerror = () => {
    //   image.style.display = `none`
    // }
  }

  function buildSearch() {
    clearContent()
    let selectCol = createCol(12)
    let optionSelect = createOptionSelect()
    selectCol.appendChild(optionSelect)
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

  function createClassesSelect() {
    let select = document.createElement(`select`)
    select.id = `heroSelect`
    let option = document.createElement(`option`)
    option.disabled = true
    option.selected = true
    option.innerText = `Please select a Class`
    select.appendChild(option)
    for (let hero of classes) {
      option = document.createElement(`option`)
      option.value = hero
      option.innerText = hero
      select.appendChild(option)
    }
    return select
  }

  function createOptionSelect() {
    let select = document.createElement(`select`)
    select.id = `optionSelect`
    let option = document.createElement(`option`)
    option.disabled = true
    option.selected = true
    option.innerText = `Please select a method to search by`
    select.appendChild(option)
    for (let choice of options) {
      option = document.createElement(`option`)
      option.value = choice
      option.innerText = choice
      select.appendChild(option)
    }
    select.addEventListener("change", selectChange)
    return select
  }

  function createInputField() {
    if (document.getElementById(`form`))
      removeElement(`form`)
    let row = createRow()
    let form = document.createElement(`form`)
    form.id = `form`
    let input = document.createElement(`input`)
    input.id = `inputField`
    input.autofocus = true
    form.appendChild(input)
    let submitButton = document.createElement(`input`)
    submitButton.type = `Submit`
    form.appendChild(submitButton)
    form.addEventListener(`submit`, submitEvent)
    row.appendChild(form)
    content.appendChild(row)
    row = createRow()
    let label = document.createElement(`label`)
    label.innerText = `Advanced Options?`
    row.appendChild(label)
    let checkbox = document.createElement(`input`)
    checkbox.type = `checkbox`
    checkbox.addEventListener("change", checkboxChanged)
    row.appendChild(checkbox)
    content.appendChild(row)
  }

  function checkboxChanged(event) {
    createAdvOptions()
  }

  function createAdvOptions() {

  }

  function selectChange(event) {
    createInputField()
  }

  function submitEvent(event) {
    event.preventDefault()
    console.log(`Submit Event Occured`);
    // need to add get call and data processing
    buildSearch()
  }

  function removeElement(id) {
    let element = document.getElementById(id);
    return element.parentNode.removeChild(element);
  }
})
