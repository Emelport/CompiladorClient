document.addEventListener('DOMContentLoaded', () => {
  const codeEditor = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');
  const openFileBtn = document.getElementById('openFileBtn');
  const saveFileBtn = document.getElementById('saveFileBtn');
  const saveFileAsBtn = document.getElementById('saveFileAsBtn');
  const fileInput = document.getElementById('file-input');
  const compileBtn = document.getElementById('compileBtn');

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

    alert('Archivo guardado en ' + defaultPath);

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
  setTimeout(function(){ alert("Archivo guardado."); }, 2000);
}


  function loadFile() {
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
        codeEditor.value = content;

        // Actualizar los números de línea después de cargar el archivo
        updateLineNumbers();

        // Establecer la ruta del archivo actual
        fileInput.setAttribute('data-filepath', file.path);
      };

      reader.readAsText(file);
    }
  }

  function compileCode() {
    // Lógica de compilación aquí
    console.log('Compilando código...');
    alert('Compilando código...');
    //consumir api java para compilar
    
    try {
      const url = 'http://localhost:8080/compile';
      const data = { code: codeEditor.value };
      const otherParams = {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        method: 'POST',
      };
      //cargarlo en console-output
      fetch(url, otherParams)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          document.getElementById('console-output').innerHTML = data.output;
          alert('Compilación exitosa');
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
