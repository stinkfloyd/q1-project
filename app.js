document.addEventListener("DOMContentLoaded", () => {
  // const mashapeKey = `oaQ37rOdEymshQuTchX0YcpHvg57p1rIczVjsn1LeIL3QWibs8`
  // let name = `leeroy`
  // axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards', {
  //     headers: { "X-Mashape-Key": `${mashapeKey}` }
  //   })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  let heroes = [`Druid`, `Hunter`, `Mage`, `Paladin`, `Priest`, `Rogue`, `Shaman`, `Warlock`, `Warrior`]
  let content = document.getElementById(`content`)
  let searchButton = document.getElementById(`searchButton`)
  let cardBackButton = document.getElementById(`cardBackButton`)
  let randomButton = document.getElementById(`randomButton`)


  searchButton.addEventListener(`click`, (event) => {
    console.log(`Search Button Clicked`);
    buildSearch()
  })
  cardBackButton.addEventListener(`click`, (event) => {
    console.log(`Card Back Button Clicked`)
  })
  randomButton.addEventListener(`click`, (event) => {
    console.log(`Random Button Clicked`);
  })

  function clearContent() {
    while (content.hasChildNodes()) {
      content.removeChild(content.childNodes[0])
    }
  }

  function buildSearch() {
    clearContent()
  }

  function createRow() {
    let row = document.createElement(`div`)
    row.classList.add(`row`)
    return row
  }

  function createCol(howManyCols) {
    let col = document.createElement(`div`)
    col.classList.add(`col-sm-${howManyCols}`)
    return col
  }

  function createSelect() {
    let select = document.createElement(`select`)
    select.id = `select`
    for (let hero of heroes) {
      let option = document.createElement(`option`)
      option.value = hero
      option.innerText = hero
      select.appendChild(option)
    }
    return select
  }
})
