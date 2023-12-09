const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const codeEditor = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');
  const openFileBtn = document.getElementById('openFileBtn');
  const saveFileBtn = document.getElementById('saveFileBtn');
  const saveFileAsBtn = document.getElementById('saveFileAsBtn');
  const fileInput = document.getElementById('file-input');
  const compileBtn = document.getElementById('compileBtn');
  const treeCompilador = document.getElementById('btnAbrir');

    treeCompilador.addEventListener('click', () => {
      ipcRenderer.send('open-new-window');

    })
  fileInput.addEventListener('change', loadFile);

  // Agregar números de línea
  codeEditor.addEventListener('input', updateLineNumbers);
  updateLineNumbers();

  openFileBtn.addEventListener('click', () => {
    // Al hacer clic en el botón de abrir, activamos el control de entrada de archivos
    fileInput.click();
  });

  fileInput.addEventListener('change', loadFile);
  saveFileBtn.addEventListener('click', saveFile);
  saveFileAsBtn.addEventListener('click', saveFileAs);
  compileBtn.addEventListener('click', compileCode);

  function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, index) => index + 1).join('<br>');
  }

  function saveFile() {
    //Guardar usando la ruta del archivo actual con require
    const contentToSave = codeEditor.value;
    const defaultPath = fileInput.getAttribute('data-filepath') || 'Untitled.txt';

    const fs = require('fs');
    fs.writeFileSync(defaultPath, contentToSave);

    // alert('Archivo guardado en ' + defaultPath);

  }


function saveFileAs() {
  const contentToSave = codeEditor.value;
  const defaultPath = fileInput.getAttribute('data-filepath') || 'Untitled.txt';

  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(contentToSave);
  a.download = defaultPath.split('/').pop(); // Obtener el nombre del archivo del path
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  fileInput.setAttribute('data-filepath', defaultPath);
  //pausa hasta que se guarde el archivo
  // setTimeout(function(){ alert("Archivo guardado."); }, 2000);
}

function loadFile() {
  //Borrar todos los datos temporales
  

  codeEditor.value = '';
  fileInput.setAttribute('data-filepath', '');

  const file = fileInput.files[0];

  if (!file) {
    alert('No se ha seleccionado ningún archivo');
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;

    // Introduce a delay before updating the content
    setTimeout(() => {
      codeEditor.value = content;
      // Actualizar los números de línea después de cargar el archivo
      updateLineNumbers();
      // Establecer la ruta del archivo actual
      fileInput.setAttribute('data-filepath', file.path);
      // Clear the file input value to ensure the change event triggers for subsequent selections
      fileInput.value = '';
    }, 100); // Adjust the delay as needed
  };

  reader.readAsText(file);
}

//Si es textarea con id code-editor, cuando le de al tab no pierda el focus si no meter una identacon
    codeEditor.addEventListener('keydown', function(e) {

      if (e.keyCode === 9) { // tab was pressed

        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var target = e.target;
        var value = target.value;

        // set textarea value to: text before caret + tab + text after caret
        target.value = value.substring(0, start)
                        + "    " 
                        + value.substring(end);

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
      }
    }
  );


  function compileCode() {

    saveFile();
    document.getElementById('console-output').innerHTML = "";
    // Lógica de compilación aquí
    //consumir api java para compilar
    
    try {
      // recibe un json es tipo post y se debe mandar una lista bidimensional
      // fileInput.getAttribute('data-filepath') lee el contenido y velo guardando en una lista bidimensiona cada linea es una nuva lista
      const lines = codeEditor.value.split('\n');

      // Convert each line into an array by splitting on commas
      const twoDimensionalArray = lines.map(line => line.split(','));
      
      const url = 'http://localhost:8080/compiladorController/compilar';
      const data = { code: codeEditor.value };
      const otherParams = {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: twoDimensionalArray }), 
        method: 'POST',
      };
      //cargarlo en console-output
      fetch(url, otherParams)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(data.length === 0){
            document.getElementById('console-output').innerHTML = "Compilacion exitosa";  
          }else{
            for (let index = 0; index < data.length; index++) {
              document.getElementById('console-output').innerHTML += data[index] +"<br>";
              
            }
          }
        })
        .catch((err) => {
          console.log(err);
          alert('Error al compilar');
        });
      
    } catch (error) {
      console.log(error);
      alert('Error al compilar');
      
    }


    
  }
});
