import React, { Component } from 'react';
import 'normalize.css';
import axios from 'axios'; 
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: [],
      currentBookIndex: 0,
      notes: []
    };
  }

  // 使用classnames 优化className
  // 格式化note.body(省略号),datetime(通过new Date('')、刚刚、前天、昨天、2月13日 23:23).

  componentDidMount() {
    axios.get('http://localhost:3100/notebooks').then(res => {
      this.setState({ notebooks: res.data });
      const currentBook = res.data[this.state.currentBookIndex];
      this.loadNotes(currentBook.id);
    });
  }

  render() {
    const notebooks = this.state.notebooks;
    return (
      <div className="app">
        <div className="sidebar">
          <div className="header">
            <button className="button adder">
              <i className="iconfont icon-add"></i>
              新建笔记
            </button>
          </div>
          <div className="body">
            <div className="notebooks">
              <div className="header has-icon">
                <i className="iconfont icon-books"></i>
                笔记本
              </div>
              <div className="body">
                <ul className="notebooks-list">
                  {
                    notebooks.map((notebook, index) => (
                      <li key={notebook.id} className={'notebook-item ' + (this.state.currentBookIndex === index ? 'active' : '')}
                        onClick={() => this.handleSelectBook(index)}>
                        <div className="title has-icon">
                          <i className="iconfont icon-book"></i>
                          {notebook.name}
                        </div>
                        <button className="button trash"><i className="iconfont icon-trash"></i></button>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="notes-panel">
          <div className="header">读书笔记</div>
          <div className="body">
            <ul className="notes-list">
            {
              this.state.notes.map((note, index) => (
                <li key={note.id}>
                  <div className="note-brief">
                    <div className="box">
                      <div className="header">{note.title}</div>
                      <div className="body">
                        {note.body}
                      </div>
                    </div>
                    <div className="footer">
                      <div className="datetime">{note.datetime}</div>
                      <button className="trash button">
                        <i className="iconfont icon-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))
            }
            </ul>
          </div>
        </div>
        <div className="note-panel">
          <div className="header">
            <div className="category has-icon">
              <i className="iconfont icon-notebook"></i>
              读书笔记
            </div>
            <div className="title">
              <input type="text" />
            </div>
          </div>
          <div className="body">
            <div className="editor">
              <textarea></textarea>
            </div>
            <div className="preview markdown-body">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleSelectBook(index) {
    this.setState({ currentBookIndex: index });
    const book = this.state.notebooks[index];
    this.loadNotes(book.id);
  }

  loadNotes(bookId) {
    axios.get('http://localhost:3100/notes?bookId=' + bookId).then(res => {
      console.log(res.data);
      this.setState({ notes: res.data });
    });
  }
}

export default App;
