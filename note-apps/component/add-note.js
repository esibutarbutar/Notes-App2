class AddNote extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.noteList = document.querySelector('note-list');
        this.shadowRoot.innerHTML = `
            <style>
                .popup-content h2 {
                    color: #627254; 
                    margin-bottom: 20px; 
                    font-family: 'Poppins'
                }
                .add-note-card {
                    width: 100px;
                    height: 100px;
                    background-color: #f9f9f9;
                    border: 2px dashed #ccc;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    border-radius: 50px
                }
                .add-note-icon {
                    font-size: 48px;
                    color: #ccc;
                }
                
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 999; 
                }
                
                .popup-content {
                    background-color: #fff;
                    padding: 20px 40px;
                    margin-right: 40px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                    z-index: 1000; 
                    flex-direction: column;
                    align-items: center;
                    justify-content : center;
                    width: calc(100% - 50px); 
                    max-width: 360px;
                    height: 300px;
                    position: relative; 
                }

                .close-icon {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 24px;
                    color: #fff; 
                    font-size: 12px;
                }
                
                .add-note-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 2px;
                }

                .add-note-content p {
                    margin: 0;
                }
                
               .add-note-content .icon {
                    font-size : 24px;
                    font-weight: bold;
                    color: #76885B;
               }
                
                input[type="text"],
                textarea, button[type="submit"] {
                width: calc(100% - 20px); 
                margin-right: 10px; 
                margin-bottom: 10px;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 5px;
                transition: border-color 0.3s;
                }

                button[type="submit"] {
                width: 100%; 
                margin-right: 10px; 
                margin-bottom: 10px;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 5px;
                transition: border-color 0.3s;
                }

                input[type="text"]:focus,
                textarea:focus {
                    outline: none;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); 
                }

                button {
                    padding: 8px 16px;
                    background-color: #627254;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                button:hover {
                    background-color: #76885B;
                }
            </style>
            <div class="add-note-card">
            <div class="add-note-content">
            <p class="icon">+</p>
            <p>Add Note</p>
            </div>
                <!-- Popup -->
                <div class="popup-overlay">
                    <div class="popup-content">
                        <h2>Add Note</h2>
                        <button class="close-icon fas fa-times-circle">X</button>
                        <form id="addNoteForm">
                            <input type="text" placeholder="Title" id="titleInput" required>
                            <textarea placeholder="Description" rows="4" id="bodyInput" required></textarea>
                            <button type="submit">Tambah</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        this.shadowRoot.querySelector('.close-icon').addEventListener('click', () => this.removePopup());
    }

    connectedCallback() {
        this.noteList = document.querySelector('note-list');
        const addNoteCard = this.shadowRoot.querySelector('.add-note-card');
        const closeIcon = this.shadowRoot.querySelector('.close-icon');
        addNoteCard.addEventListener('click', () => this.showPopup());
        closeIcon.addEventListener('click', (event) => { 
            event.stopPropagation(); 
        });
        this.shadowRoot.getElementById('addNoteForm').addEventListener('submit', event => this.addNoteHandler(event));
        
        
        if (this.mode === 'edit' && this.editNoteData) {
            this.shadowRoot.getElementById('titleInput').value = this.editNoteData.title;
            this.shadowRoot.getElementById('bodyInput').value = this.editNoteData.body;
            this.shadowRoot.querySelector('.popup-content h2').textContent = 'Edit Note';
        }
    }
    

    showPopup() {
        console.log('Showing popup...');
        this.shadowRoot.querySelector('.popup-overlay').style.display = 'flex';
    }

    addNoteHandler(event) {
        event.preventDefault();
        const titleInput = this.shadowRoot.querySelector('#titleInput').value;
        const bodyInput = this.shadowRoot.querySelector('#bodyInput').value;
        const createdAt = new Date().toISOString();
        const eventDetail = { title: titleInput, body: bodyInput, createdAt };
        const notesApp = document.querySelector('note-list');
        if (notesApp) {
            notesApp.addNote(eventDetail);
        }
        this.removePopup();
    }

    removePopup() {
        console.log('Removing popup...');
        this.shadowRoot.querySelector('.popup-overlay').style.display = 'none';
    }
}

customElements.define('add-note', AddNote);
