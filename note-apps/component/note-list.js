import notesData from '../data/data.js';
class NotesApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.notesData = notesData;
        this.filteredNotesData = [];
        this.shadowRoot.innerHTML = `
          <style>
          
            .notes-grid {
              justify-content: center;
              margin: 50px;
              display: grid;
              grid-template-columns: repeat(auto-fill, 360px);
              gap: 15px;
            }
            .note-card, add-note {
              height: 300px; 
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
              display: flex;
              flex-direction: column;
              position: relative;
            }
  
            .note-card h3 {
              margin-top: 0;
            }
  
            .note-card p {
              margin-bottom: auto;
            }
  
            .note-card small {
              color: #666;
              margin-top: auto;
            }
  
            add-note {
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            }
  
            .add-note-icon {
              font-size: 48px;
              color: #ccc;
            }
            .button-container {
              position: absolute;
              bottom: 10px;
              right: 10px;
            }
            
            .button-container button {
              margin-left: 5px;
              cursor: pointer;
            }
  
            .edit-button {
              padding: 10px;
              border-radius: 5px;
              background-color: #C6EBC5;
              border: none;
              transition: background-color 0.3s, color 0.3s;
            }
  
            .edit-button {
              background-color : #4CAF50;
              color: white;
            }
  
            .delete-button {
              background-color: #f44336;
              color: white;
              border: none;
              border-radius : 5px;
              padding: 10px;
            }
  
            .edit-button:hover, .delete-button:hover {
              background-color: #45a049; 
              color: white; 
            }
  
            delete-button:hover {
              background-color : #f44336;
              color: white;
            }
  
            .note-card hr{
              margin: 10px 0;
              border: none;
              border-top: 1px solid #ccc;
            }
  
            .note-card h3{
              margin-top : 9px;
              text-align: center;
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
                display: flex;
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

            .edit-button:hover {
                background-color: #a9dfbf;
                color: white;
            }

            .delete-button:hover{
              background-color: #ff6961;
              color: white;

              
            }
            </style>
            <div class="notes-grid"></div>
            <div class="popup-overlay">
                <div class="popup-content">
                <h2>Edit Note</h2>
                <button class="close-icon fas fa-times-circle">X</button>
                <form id="editNoteForm">
                    <input type="text" placeholder="Title" id="titleInput" required>
                    <textarea placeholder="Description" rows="4" id="bodyInput" required></textarea>
                    <button type="submit">Update</button>
                </form>
                </div>
            </div>
            
        `;
        this.shadowRoot.querySelector('.close-icon').addEventListener('click', () => this.removePopup());
    }
    generateId() {
        return Math.random().toString(36).substring(2);
    }

    connectedCallback() {
        this.retrieveDataFromLocalStorage();
        this.renderNotes();
        this.setupSearch();

    }

    addNote(note) {
        this.notesData.unshift({ id: this.generateId(), archived: false, ...note });
        localStorage.setItem('notesData', JSON.stringify(this.notesData));
        this.filteredNotesData = [...this.notesData];
        this.renderNotes();
        const event = new CustomEvent('noteAdded', { detail: note });
        document.dispatchEvent(event); 
    }

    retrieveDataFromLocalStorage() {
        const storedNotesData = localStorage.getItem('notesData');
        if (storedNotesData) {
            this.notesData = JSON.parse(storedNotesData);
            this.filteredNotesData = [...this.notesData]; 
        }
    }

    renderNotes() {
        const notesGrid = this.shadowRoot.querySelector('.notes-grid');
        notesGrid.innerHTML = ''; 
        const addNoteCard = document.createElement('add-note');
        notesGrid.appendChild(addNoteCard);
        this.filteredNotesData.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note-card');
            noteElement.dataset.noteId = note.id;
            const editedText = note.editedAt ? ` (diedit)` : ''; 
            const createdAtText = `${new Date(note.createdAt).toLocaleString()}${editedText}`; 
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <hr>
                <p>${note.body}</p>
                <small>${createdAtText}</small> 
                <div class="button-container">
                    <button class="edit-button"><i class="fas fa-edit"></i>Edit</button>
                    <button class="delete-button">Delete</button>
                </div>`;
            notesGrid.appendChild(noteElement);
            const deleteButton = noteElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => this.deleteNoteHandler(note.id));
            const editButton = noteElement.querySelector('.edit-button');
            editButton.addEventListener('click', () => this.editNoteHandler(note)); 
        });
    }
    
    

    editNoteHandler(note) {
        this.showEditPopup(note);
    }

    getNoteById(noteId) {
        return this.notesData.find(note => note.id === noteId);
    }
    getNoteById(noteId) {
        return this.notesData.find(note => note.id === noteId);
    }

    setupSearch() {
        const searchElements = document.querySelectorAll('note-search');
        searchElements.forEach(searchElement => {
            searchElement.addEventListener('search', (event) => {
                const searchValue = event.detail.toLowerCase();
                this.filteredNotesData = this.notesData.filter(note =>
                    note.title.toLowerCase().includes(searchValue) ||
                    note.body.toLowerCase().includes(searchValue)
                );
                this.renderNotes();
            });

        });

    }
    showEditPopup(note) {
        const titleInput = this.shadowRoot.querySelector('#titleInput');
        const bodyInput = this.shadowRoot.querySelector('#bodyInput');
        titleInput.value = note.title;
        bodyInput.value = note.body;
        const titleText = note.editedAt ? `${note.title} (diedit)` : note.title; 
        titleInput.value = titleText;
        this.shadowRoot.querySelector('.popup-content h2').textContent = 'Edit Note';
        this.showPopup();
        const editForm = this.shadowRoot.getElementById('editNoteForm');
        editForm.addEventListener('submit', event => {
            event.preventDefault();
            const updatedTitle = titleInput.value;
            const updatedBody = bodyInput.value;
            const noteIndex = this.notesData.findIndex(item => item.id === note.id);
            this.notesData[noteIndex].title = updatedTitle;
            this.notesData[noteIndex].body = updatedBody;
            this.notesData[noteIndex].editedAt = new Date().toISOString(); 
            localStorage.setItem('notesData', JSON.stringify(this.notesData));
            this.renderNotes();
            this.removePopup();
        });
    }
    

    showPopup() {
        this.shadowRoot.querySelector('.popup-overlay').style.display = 'flex';
    }

    removePopup() {
        this.shadowRoot.querySelector('.popup-overlay').style.display = 'none';
    }

    deleteNoteHandler(noteId) {
        this.notesData = this.notesData.filter(note => note.id !== noteId);
        localStorage.setItem('notesData', JSON.stringify(this.notesData));
        this.retrieveDataFromLocalStorage(); 
        this.renderNotes();
    }



}

customElements.define("note-list", NotesApp);