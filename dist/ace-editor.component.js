// Good navigators expose currentScript, old ones need a Polyfill which expose _currentScript
const { ownerDocument } = document.currentScript || (document)._currentScript
const template = ownerDocument.querySelector('template')

class AceEditor extends HTMLElement {

  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).appendChild(
      document.importNode(template.content, true)
    )
  }

  createdCallback() {}
  attachedCallback() {}
  detachedCallback() {}
  attributeChangedCallback(attr, oldVal, newVal) {}
}
customElements.define('ace-editor', AceEditor)
