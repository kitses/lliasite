document.addEventListener('DOMContentLoaded', () => {
  const getSelectedText = () => window.getSelection?.().toString() || document.selection?.createRange().text || '';
  const modifyText = (action, text = '') => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const parent = range.commonAncestorContainer.parentNode;
    if (parent.closest('.content') && !parent.closest('.directoryCont')) {
      if (action === 'cut' && selection.toString()) {
        range.deleteContents();
        range.insertNode(document.createTextNode(''))
      } else if (action === 'paste') {
        range.deleteContents();
        range.insertNode(document.createTextNode(text))
      }
    }
  };
  const cutText = () => modifyText('cut');
  const pasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      modifyText('paste', text)
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  };
  const snarfText = async () => {
    const selectedText = getSelectedText();
    if (selectedText) {
      try {
        await navigator.clipboard.writeText(selectedText)
      } catch (err) {
        console.error('Failed to write to clipboard: ', err)
      }
    }
  };
  document.addEventListener('keydown', (event) => {
    const {key} = event;
    if ([ '1', '2', '3' ].includes(key)) {
      event.preventDefault()
    }
    if (key === '1') {
      cutText()
    } else if (key === '2') {
      pasteText()
    } else if (key === '3') {
      snarfText()
    }
  })
});
