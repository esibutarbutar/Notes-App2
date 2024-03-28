class CustomHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    text-align: center;
                    font-size: 50px;
                    color: #627254;
                }
            </style>
            <h1>Notes App</h1>
        `;
    }
}

customElements.define('custom-header', CustomHeader);
