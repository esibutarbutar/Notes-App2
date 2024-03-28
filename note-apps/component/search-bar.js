class NoteSearch extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .search-container {
                    margin: 20px auto;
                    width: 70%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                input[type="text"] {
                    padding: 15px;
                    width: 70%;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    margin-right: 10px;
                    outline: none;
                    transition: box-shadow 0.3s;
                }

                input[type = "text"]:focus {
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                }
                
                button[type="submit"] {
                    padding: 15px;
                    background-color: #627254;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                
                button[type="submit"]:hover {
                    background-color: #76885B;
                }
            </style>
            <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search...">
            <button type="submit" id="searchButton">Search</button>
        </div>
        `;
    }

    connectedCallback() {
        const searchInput = this.shadowRoot.getElementById('searchInput');
    
        searchInput.addEventListener('input', () => {
            const searchValue = searchInput.value.trim().toLowerCase();
            const searchEvent = new CustomEvent('search', { detail: searchValue });
            this.dispatchEvent(searchEvent);
        });
    }
    
}
customElements.define('note-search', NoteSearch);
