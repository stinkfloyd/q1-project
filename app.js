document.addEventListener("DOMContentLoaded", () => {
  const mashapeKey = `oaQ37rOdEymshQuTchX0YcpHvg57p1rIczVjsn1LeIL3QWibs8`

  let options = [`Name`, `Attack Strength`, `Mana Cost`, `Race`, `Health`]
  let content = document.getElementById(`content`)
  let searchButton = document.getElementById(`searchButton`)
  let cardBackButton = document.getElementById(`cardBackButton`)

  searchButton.addEventListener(`click`, (event) => {
    clearContent()
    buildSearch()
  })

  cardBackButton.addEventListener(`click`, (event) => {
    clearContent()
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


  function clearContent() {
    while (content.hasChildNodes()) {
      content.removeChild(content.childNodes[0])
    }
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

  function buildSearch() {
    clearContent()
    let selectCol = createCol(12)
    let optionSelect = createOptionSelect()
    selectCol.appendChild(optionSelect)
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
    select.addEventListener(`change`, (event) => {
      createInputField(select.options[select.selectedIndex].value)
    })
    return select
  }

  function createInputField(value) {
    if (document.getElementById(`form`))
      removeElement(`form`)
    if (document.getElementById(`advOptionsLabel`))
      removeElement(`advOptionsLabel`)
    if (document.getElementById(`advOptionsBox`))
      removeElement(`advOptionsBox`)
    let row = createRow()
    let form = document.createElement(`form`)
    form.id = `form`
    let input = document.createElement(`input`)
    input.id = `inputField`
    switch (value) {
      case `Name`:
        input.placeholder = `Enter Card Name`
        break;
      case `Attack Strength`:
        input.placeholder = `Enter (#) Attack Strength`
        input.type = `number`
        break;
      case `Mana Cost`:
        input.placeholder = `Enter (#) Mana Cost`
        input.type = `number`
        break;
      case `Race`:
        input.placeholder = `Enter Minion Type`
        break;
      case `Health`:
        input.placeholder = `Enter (#) Health`
        input.type = `number`
        break;
      default:
        input.type = `text`
    }
    input.autofocus = true
    form.appendChild(input)
    let submitButton = document.createElement(`input`)
    submitButton.type = `Submit`
    form.appendChild(submitButton)
    form.addEventListener(`submit`, submitEvent)
    row.appendChild(form)
    content.appendChild(row)
  }

  function selectChange(event) {
    createInputField()
  }

  function submitEvent(event) {
    event.preventDefault()
    // need to add get call and data processing
    let advOptions = document.getElementById(``)
    let select = document.getElementById(`optionSelect`)
    let input = document.getElementById(`inputField`)
    switch (select.options[select.selectedIndex].value) {
      case `Name`:
        axios.get(`https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${input.value}?collectible=1`, {
            headers: {
              "X-Mashape-Key": `${mashapeKey}`
            }
          })
          .then((response) => {
            clearContent()
            createSearchAgainButton()
            let row = createRow()
            for (let i = 0; i < response.data.length; i++) {
              let card = createCard(`${response.data[i].name}`, `${response.data[i].flavor}`, `${response.data[i].img}`, `${response.data[i].cardSet}`)
              row.appendChild(card)
              content.appendChild(row)
            }
            createSearchAgainButton()
          })
          .catch((error) => {
            clearContent()
            createSearchAgainButton()
          });
        break;
      case `Attack Strength`:
        axios.get(`https://omgvamp-hearthstone-v1.p.mashape.com/cards?attack=${input.value}&collectible=1`, {
            headers: {
              "X-Mashape-Key": `${mashapeKey}`
            }
          })
          .then((response) => {
            clearContent()
            createSearchAgainButton()
            let row = createRow()
            for (let season in response.data) {
              for (let i = 0; i < response.data[season].length; i++) {
                let card = createCard(`${response.data[season][i].name}`, `${response.data[season][i].flavor}`, `${response.data[season][i].img}`, `${response.data[season][i].cardSet}`)
                row.appendChild(card)
                content.appendChild(row)
              }
            }
            createSearchAgainButton()
          })
          .catch((error) => {
            clearContent()
            createSearchAgainButton()
          });
        break;
      case `Mana Cost`:
        axios.get(`https://omgvamp-hearthstone-v1.p.mashape.com/cards?cost=${input.value}&collectible=1`, {
            headers: {
              "X-Mashape-Key": `${mashapeKey}`
            }
          })
          .then((response) => {
            clearContent()
            createSearchAgainButton()
            let row = createRow()
            for (let season in response.data) {
              for (let i = 0; i < response.data[season].length; i++) {
                let card = createCard(`${response.data[season][i].name}`, `${response.data[season][i].flavor}`, `${response.data[season][i].img}`, `${response.data[season][i].cardSet}`)
                row.appendChild(card)
                content.appendChild(row)
              }
            }
            createSearchAgainButton()
          })
          .catch((error) => {
            clearContent()
            createSearchAgainButton()
          });
        break;
      case `Race`:
        axios.get(`https://omgvamp-hearthstone-v1.p.mashape.com/cards/races/${input.value}`, {
            headers: {
              "X-Mashape-Key": `${mashapeKey}`
            }
          })
          .then((response) => {
            clearContent()
            createSearchAgainButton()
            let row = createRow()
            for (let i = 0; i < response.data.length; i++) {
              let card = createCard(`${response.data[i].name}`, `${response.data[i].flavor}`, `${response.data[i].img}`, `${response.data[i].cardSet}`)
              row.appendChild(card)
              content.appendChild(row)
            }
            createSearchAgainButton()
          })
          .catch((error) => {
            clearContent()
            createSearchAgainButton()
          });
        break;
      case `Health`:
        axios.get(`https://omgvamp-hearthstone-v1.p.mashape.com/cards?health=${input.value}&collectible=1`, {
            headers: {
              "X-Mashape-Key": `${mashapeKey}`
            }
          })
          .then((response) => {
            clearContent()
            createSearchAgainButton()
            let row = createRow()
            for (let season in response.data) {
              for (let i = 0; i < response.data[season].length; i++) {
                let card = createCard(`${response.data[season][i].name}`, `${response.data[season][i].flavor}`, `${response.data[season][i].img}`, `${response.data[season][i].cardSet}`)
                row.appendChild(card)
                content.appendChild(row)
              }
            }
            createSearchAgainButton()
          })
          .catch((error) => {
            clearContent()
            createSearchAgainButton()
          });
        break;
      default:
    }
  }

  function createSearchAgainButton() {
    let row = createRow()
    let searchAgain = document.createElement(`button`)
    searchAgain.addEventListener(`click`, (event) => {
      clearContent()
      buildSearch()
    })
    searchAgain.innerText = `Search Again`
    row.appendChild(searchAgain)
    content.appendChild(searchAgain)
  }

  function removeElement(id) {
    let element = document.getElementById(id);
    return element.parentNode.removeChild(element);
  }
})
