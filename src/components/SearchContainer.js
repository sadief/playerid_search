import React, { Component } from "react"
import * as JsSearch from "js-search"
import playerData from "../data/players_1_30_2020.json"
import CopyToClipboard from "react-copy-to-clipboard"
import Axios from "axios"

class Search extends Component {
  state = {
    playerList: [],
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: "",
  }
  /**
   * React lifecycle method to fetch the data
   */
  async componentDidMount() {
    Axios.get("https://bvaughn.github.io/js-search/books.json")
      .then(result => {
        this.setState({ playerList: playerData.players })
        this.rebuildIndex()
      })
      .catch(err => {
        this.setState({ isError: true })
        console.log("====================================")
        console.log(`Something bad happened while fetching the data\n${err}`)
        console.log("====================================")
      })
  }

  componentDidUpdate() {
    setTimeout(() => this.setState({ copied: false }), 5000)
  }

  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const { playerList } = this.state
    const dataToSearch = new JsSearch.Search("id")
    /**
     *  defines a indexing strategy for the data
     * more about it in here https://github.com/bvaughn/js-search#configuring-the-index-strategy
     */
    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()
    /**
     * defines the sanitizer for the search
     * to prevent some of the words from being excluded
     *
     */
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()
    /**
     * defines the search index
     * read more in here https://github.com/bvaughn/js-search#configuring-the-search-index
     */
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("id")

    dataToSearch.addIndex("full_name") // sets the index attribute for the data
    dataToSearch.addIndex("team") // sets the index attribute for the data
    dataToSearch.addIndex("id")

    dataToSearch.addDocuments(playerList) // adds the data to be searched
    this.setState({ search: dataToSearch, isLoading: false })
  }

  /**
   * handles the input change and perform a search with js-search
   * in which the results will be added to the state
   */
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
                    Player ID
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
