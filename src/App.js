import React, { Component } from 'react';
import 'normalize.css';
import 'github-markdown-css';
import axios from 'axios';
import cx from 'classnames';
import Swal from 'sweetalert2'
import marked from 'marked';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: [],
      currentBookIndex: 0,
      notes: [],
      currentNote: null
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
    const currentNote = this.state.currentNote;
    return (
      <div className="app">
        <div className="sidebar">
          <div className="header">
            <button className="button adder" onClick={() => this.handleAddNote()}>
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
                      <li key={notebook.id}
                        className={this.handleActiveClassName('currentBookIndex', ['notebook-item'], index)}
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
                  <div className={cx('note-brief', { active: currentNote && currentNote.id === note.id })}>
                    <div className="box" onClick={() => this.handleEditNote(note.id)}>
                      <div className="header">{note.title}</div>
                      <div className="body">
                        {note.body}
                      </div>
                    </div>
                    <div className="footer">
                      <div className="datetime">{this.handleDateTime(note.datetime)}</div>
                      <button className="trash button" onClick={() => this.handleDeleteNote(note.id)}>
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
        { currentNote ?
          <div className="note-panel">
            <div className="header">
              <div className="category has-icon">
                <i className="iconfont icon-notebook"></i>
                读书笔记
              </div>
              <div className="title">
                <input name="title" type="text" value={currentNote.title} onChange={e => this.handleFieldChange(e)}/>
              </div>
            </div>
            <div className="body">
              <div className="editor">
                <textarea name="body"
                  value={currentNote.body}
                  onChange={e => this.handleFieldChange(e)}
                  onKeyDown={e => this.handlePressTab(e)}
                ></textarea>
              </div>
              <div className="preview markdown-body">
                <div dangerouslySetInnerHTML={{ __html: marked(currentNote.body) }}></div>
              </div>
            </div>
          </div> : null
        }
      </div>
    );
  }

  // 单词拼写错误，叫fieldName
  handleActiveClassName(fieldName, defaultClasses, index) {
    return cx(...defaultClasses, { active: this.state[fieldName] === index });
  }

  handleSelectBook(index) {
    this.setState({ currentBookIndex: index });
    const book = this.state.notebooks[index];
    this.loadNotes(book.id);
  }

  loadNotes(bookId) {
    axios.get(`http://localhost:3100/notes?bookId=${bookId}`).then(res => {
      console.log(res.data);
      this.setState({ notes: res.data });
    });
  }

  handleDateTime(datetime) {

    const dateObj = new Date(datetime);
    // let formatDateTime = '';

    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const times = dateObj.getTime();
    const nowTimes = new Date().getTime();
    const difference = nowTimes - times;

    // 下面是否使用if语句更好？比如
    /*
     if (difference < 60 * 1000) {
      return '刚刚';
     }
     */
    // switch (true) {
    //   case difference < 60 * 1000 :
    //     formatDateTime = '刚刚';
    //     break;

    //   case difference >= 60 * 1000 && difference < 2 * 60 * 1000:
    //     formatDateTime = '1分钟前';
    //     break;

    //   case difference >= 2 * 60 * 1000 && difference < 3 * 60 * 1000:
    //     formatDateTime = '2分钟前';
    //     break;

    //   case difference >= 3 * 60 * 1000 && difference < 24 * 60 * 60 * 1000 :
    //     // 这里的拼装，可以使用ES6中的模板字符串
    //     // `今天 ${hours}:${minutes}`;
    //     formatDateTime = ['今天 ', hours, ':', minutes].join('');
    //     break;

    //   case difference >= 24 * 60 * 60 * 1000 && difference < 2 * 24 * 60 * 60 * 1000 :
    //     formatDateTime = ['昨天 ', hours, ':', minutes].join('');
    //     break;

    //   default:
    //     formatDateTime = [month, '月', date, '日 ', hours, ':', minutes].join('');
    //     break;
    // }

    // return formatDateTime;

    if (difference < 60 * 1000) {
      return '刚刚';
    } else if (difference >= 60 * 1000 && difference < 2 * 60 * 1000) {
      return '1分钟前';
    } else if (difference >= 2 * 60 * 1000 && difference < 3 * 60 * 1000) {
      return '2分钟前';
    } else if (difference >= 3 * 60 * 1000 && difference < 24 * 60 * 60 * 1000) {
      return `今天 ${hours}:${minutes}`
    } else if (difference >= 24 * 60 * 60 * 1000 && difference < 2 * 24 * 60 * 60 * 1000) {
      return `昨天 ${hours}:${minutes}`
    } else {
      return `${month}月${date}日 ${hours}:${minutes}`
    }
  }

  handleAddNote() {
    const note = {
      title: '新建笔记',
      body: '',
      datetime: new Date().toISOString(),
      bookId: this.state.notebooks[this.state.currentBookIndex].id
    };
    axios.post('http://localhost:3100/notes/', note).then(res => {
      this.reloadNotes();
    });
  }

  reloadNotes() {
    const bookId = this.state.notebooks[this.state.currentBookIndex].id;
    this.loadNotes(bookId);
  }

  // 你学过ES6，可以尝试使用async/await来实现下面这段代码。
  /**
  async handleDeleteNote(noteId) {
    const result = await Swal.fire({
      ...
    });

    if (result.value) {
      ...
    }
  }

  是否避免的层层嵌套的缩进，让这个流程更加清晰
   */
  // handleDeleteNote(noteId) {

  //   Swal.fire({
  //     title: '确定要删除吗?',
  //     type: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消'
  //   }).then((result) => {
  //     if (result.value) {
  //       axios.delete(`http://localhost:3100/notes/${noteId}`).then(res => {

  //         Swal.fire({
  //           title: '删除成功！',
  //           type: 'success'
  //         });

  //         this.reloadNotes();
  //       });
  //     }
  //   })

  // }

  async handleDeleteNote(noteId) {
    const result = await Swal.fire({
      title: '确定要删除吗?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    });

    if (result.value) {
      await axios.delete(`http://localhost:3100/notes/${noteId}`);
      Swal.fire({
        title: '删除成功！',
        type: 'success'
      });
      this.reloadNotes();
    }
  }

  handleEditNote(noteId) {
    axios.get(`http://localhost:3100/notes/${noteId}`).then(res => {
      this.setState({ currentNote: res.data });
    });
  }

  handleFieldChange(e) {
    const note = {
      ...this.state.currentNote,
      [e.target.name]: e.target.value
    };

    this.setState({
      currentNote: note
    });

    axios.put(`http://localhost:3100/notes/${this.state.currentNote.id}`, note);

    const notes = [...this.state.notes];
    const index = notes.findIndex(o => o.id === this.state.currentNote.id);
    if (index !== -1) {
      notes[index] = note;
      this.setState({ notes: notes });
    }
  }

  handlePressTab(e) {
    if ( e.keyCode === 9 ) {

      // Set up some variables. We need to know the current position of the cursor or selection.
      // 用了es6 const，复制过来的代码最好也将它改成一致的，把var改成const，顺便阅读一遍。
      const selectionStartPos = e.target.selectionStart;
      const selectionEndPos = e.target.selectionEnd;
      const oldContent = e.target.value;

      // Set the new content.
      e.target.value = oldContent.substring( 0, selectionStartPos ) + "\t" + oldContent.substring( selectionEndPos );

      // Set the new cursor position (current position + 1 to account for the new tab character).
      e.target.selectionStart = e.target.selectionEnd = selectionStartPos + 1;

      // Prevent the default action (tabbing to the next field or control).
      e.preventDefault();

      this.handleFieldChange(e);
    }
  }
}

export default App;
