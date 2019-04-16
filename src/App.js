import React, { Component } from 'react';
import 'normalize.css';
import axios from 'axios'; 
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:3100/notebooks').then(res => {
      console.log(res.data);
      this.setState({ notebooks: res.data });
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
                      <li key={notebook.id} className="notebook-item">
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
              <li>
                <div className="note-brief active">
                  <div className="box">
                    <div className="header">读《深入理解ES6》</div>
                    <div className="body">
                      不识老尼，枉为前端攻城狮，其成名作《JS高级程序设计》曾名动江湖。
                    </div>
                  </div>
                  <div className="footer">
                    <div className="datetime">刚刚</div>
                    <button className="trash button">
                      <i className="iconfont icon-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
              <li>
                <div className="note-brief">
                  <div className="box">
                    <div className="header">新建笔记</div>
                    <div className="body">
                      笔记概要
                    </div>
                  </div>
                  <div className="footer">
                    <div className="datetime">2019-3-5</div>
                    <button className="trash button">
                      <i className="iconfont icon-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
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
}

export default App;
