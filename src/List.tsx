import './list.css'

function List() {

  return (
    <div className="App">
      <h1>Vue</h1>
      <ul>
        <li><a href="/vue/">gobang</a></li>
      </ul>
      <h1>React</h1>
      <ul>
        <li><a href="/#/password">阅后即焚</a></li>
        <li><a href="/#/sw">Service Worker</a></li>
        <li><a href="/#/notice">Notice</a></li>
        <li><a href="/#/demo">Demo</a></li>
      </ul>
    </div>
  )
}

export default List
