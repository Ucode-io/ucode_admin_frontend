let stackMessages = {}
let timeOut = 10000

class StackMessages {
  callBacks = {}
  messages = []

  constructor(name) {
    this.name = name
  }

  subscribe(callback) {
    const id = new Date().getTime().toString() + Math.random().toString()
    callback(this.messages, id)
    this.callBacks = { ...this.callBacks, [id]: callback }

    setTimeout(() => {
      this.unsubscribe(id)
    }, timeOut)
  }

  unsubscribe(id) {
    delete this.callBacks[id]
  }

  reload() {
    for (let key in this.callBacks) {
      this.callBacks[key](this.messages, key)
    }
  }

  get() {
    return this.messages
  }

  add(elm) {
    this.messages.push(elm)
    this.reload()

    setTimeout(() => {
      this.remove(elm.id)
    }, timeOut)
  }

  remove(id) {
    this.messages = this.messages.filter((elm) => elm.id !== id)
  }

  clear() {
    this.messages = []
  }

  clearCallbacks() {
    this.callBacks = {}
  }
}

function connect(name) {
  stackMessages = new StackMessages(name)
}

export { connect, stackMessages }
