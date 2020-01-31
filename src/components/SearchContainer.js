import React, { Component } from "react"
import * as JsSearch from "js-search"
import playerData from "../data/players_1_30_2020.json"
import CopyToClipboard from "react-copy-to-clipboard"

class Search extends Component {
  state = {
    playerList: [],
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: "",
  }

  async componentDidMount() {
    this.setState({ playerList: playerData.players }, () => {
      this.rebuildIndex()
    })
  }

  componentDidUpdate() {
    setTimeout(() => this.setState({ copied: false }), 10000)
  }

  rebuildIndex = () => {
    const { playerList } = this.state
    const dataToSearch = new JsSearch.Search("full_name")

    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()

    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()

    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("id")

    dataToSearch.addIndex("full_name")
    dataToSearch.addIndex("team")
    dataToSearch.addIndex("id")

    dataToSearch.addDocuments(playerList)
    this.setState({ search: dataToSearch, isLoading: false })
  }

  searchData = e => {
    const { search } = this.state
    const queryResult = search.search(e.target.value)
    this.setState({ searchQuery: e.target.value, searchResults: queryResult })
  }
  handleSubmit = e => {
    e.preventDefault()
  }

  onCopy = () => {
    this.setState({ copied: true })
  }

  render() {
    const { playerList, searchResults, searchQuery } = this.state
    const queryResults = searchQuery === "" ? playerList : searchResults
    return (
      <div>
        <div style={{ margin: "0 auto" }}>
          <form onSubmit={this.handleSubmit}>
            <div style={{ margin: "0 auto" }}>
              <label htmlFor="Search" style={{ paddingRight: "10px" }}>
                Search for Player by name, team or ID
              </label>
              <input
                id="Search"
                value={searchQuery}
                onChange={this.searchData}
                placeholder="Enter your search here"
                style={{ margin: "0 auto", width: "400px" }}
              />
            </div>
          </form>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px",
              }}
            >
              Number of players:
              {queryResults.length}
              <section className="section">
                {this.state.copied ? (
                  <span style={{ color: "red" }}>Copied.</span>
                ) : null}
              </section>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderRadius: "4px",
                border: "1px solid #d3d3d3",
              }}
            >
              <thead style={{ border: "1px solid #808080" }}>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      fontSize: "14px",
                      fontWeight: 600,
                      borderBottom: "2px solid #d3d3d3",
                      cursor: "pointer",
                    }}
                  >
                    Player Full Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      fontSize: "14px",
                      fontWeight: 600,
                      borderBottom: "2px solid #d3d3d3",
                      cursor: "pointer",
                    }}
                  >
                    Player Team
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "5px",
                      fontSize: "14px",
                      fontWeight: 600,
                      borderBottom: "2px solid #d3d3d3",
                      cursor: "pointer",
                    }}
                  >
                    Player ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {queryResults.map(item => {
                  return (
                    <tr key={`row_${item.id}`}>
                      <td
                        style={{
                          fontSize: "14px",
                          padding: "10px",
                          border: "1px solid #d3d3d3",
                        }}
                      >
                        {item.full_name}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          padding: "10px",
                          border: "1px solid #d3d3d3",
                        }}
                      >
                        {item.team}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          padding: "10px",
                          border: "1px solid #d3d3d3",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {item.id}

                        <CopyToClipboard onCopy={this.onCopy} text={item.id}>
                          <button onClick={this.onClick}>Copy PlayerID</button>
                        </CopyToClipboard>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
export default Search
