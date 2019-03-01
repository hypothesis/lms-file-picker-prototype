const FOLDER_ICON = 'folder-solid.svg';
const FILE_ICON = 'file-alt-regular.svg';
const PDF_FILE_ICON = 'file-pdf-solid.svg';

function fileIconUrl(icon) {
  return `/assets/icons/mime/${icon}`;
}

// See https://www.opensourceshakespeare.org/views/plays/plays.php
const files = {
  '/': [
    'Tragedies/',
    'Comedies/',
    'Histories/',
    'Biography.htm',
    'Poems.htm',
    'Sonnets.pdf',
  ],

  '/Tragedies': [
    'Antony and Cleopatra',
    'Coriolanus',
    'Cymbeline',
    'Hamlet',
    'Julius Ceasar',
    'King Lear',
    'Macbeth',
    'Othello',
    'Romeo and Juliet',
    'Timon of Athens',
    'Titus Andronicus',
    'Troilus and Cressida',
  ],

  '/Comedies': [
    "All's well that ends well.pdf",
    'As you like it.pdf',
    'Comedy of errors.docx',
    "Love's labour's lost.htm",
    'Measure for measure',
    'Merchant of Venice.pdf',
    'Merry wives of Windsor.pdf',
    "Midsummer night's dream.pdf",
    'Much ado about nothing',
    'Taming of the shrew',
    'Tempest',
    'Twelfth night',
    'Two gentlemen of Verona',
    "Winter's tale",
  ],

  '/Histories': [
    'Henry IV, Part I',
    'Henry IV, Part II',
    'Henry V',
    'Henry VI, Part I',
    'Henry VI, Part II',
    'Henry VI, Part III',
    'Henry VIII',
    'King John',
    'Pericles',
    'Richard I',
    'Richard II',
  ],
};

function listFiles(path) {
  if (!files[path]) {
    return [];
  }

  const fileNames = files[path].sort((a, b) => {
    // Sort directories before files.
    if (a.endsWith('/') !== b.endsWith('/')) {
      return a.endsWith('/') ? -1 : 1;
    }

    // Sort in lexicographical order.
    return a.localeCompare(b);
  });

  return fileNames.map(name => {
    if (name.endsWith('/')) {
      return {
        type: 'directory',
        name: name.slice(0, -1),
        icon: fileIconUrl(FOLDER_ICON),
      };
    }

    const icon = name.endsWith('.pdf') ? PDF_FILE_ICON : FILE_ICON;
    return {
      type: 'file',
      name,
      icon: fileIconUrl(icon),
      last_modified: new Date().toISOString(),
    };
  });
}

module.exports = { listFiles };
