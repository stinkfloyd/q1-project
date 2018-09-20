const { expect } = chai

describe('check tests are running', () => {
  it('Check Tests running', () => {
    expect(true).to.equal(true);
  })
})

describe(`checking static DOM elements`, () => {
  //set describe messages


  it(`Check error text is clear`, () => {
    expect(document.getElementById(`error`).innerText).to.equal(``)
  })
  it(`Load text is present`, () => {
    expect(document.getElementById(`loadText`).innerText).to.not.equal(``)
  })
  it('checks for search, and makes sure its a button', () => {
    expect(document.getElementById(`searchButton`).tagName).to.equal("BUTTON")
  })
  it('checks for card back gallery, and makes sure its a button', () => {
    expect(document.getElementById(`cardBackButton`).tagName).to.equal("BUTTON")
  })
  describe(`CHECKING THE MODAL`, () => {
    it(`checks that it exists`, () => {
      expect(document.getElementById(`cardModal`).classList).to.include([`modal`, `fade`])
    })
    it(`checks that modal is empty`, () => {
      expect(document.getElementById(`cardModalBody`).innerText).to.equal(``)
    })
  })
})
