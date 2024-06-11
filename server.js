// Importación de librerías.
import express from "express";
import axios from "axios";
import _ from "lodash";
import chalk from "chalk";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// Se crea una nueva instancia de Express.
const app = express();

// URL de la API de la que obtendremos los datos de los usuarios.
const apiurl = "https://randomuser.me/api/";

// Array para almacenar los datos de los usuarios.
const usuarios = [];

// Formato para la fecha y hora.
const formato = "MMMM Do YYYY, hh:mm:ss a";

// Se inicia el servidor.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    chalk.green(`El servidor está oyendo en el puerto http://localhost:${PORT}`)
  );
});

// Ruta para obtener los datos de los usuarios.
app.get("/usuarios", async (req, res) => {
  try {
    console.log(chalk.yellow("Iniciando la solicitud a la API..."));
    // Se hace una petición a la API para obtener los datos de un usuario.
    const response = await axios.get(apiurl);
    console.log(chalk.green("Datos recibidos de la API"));

    // Se extraen los datos requeridos de la respuesta de la API.
    const data = response.data.results[0];
    const nombre = data.name.first;
    const apellido = data.name.last;
    const genero = data.gender;
    console.log(
      chalk.yellow(
        `Datos extraídos: Nombre: ${nombre}, Apellido: ${apellido}, Género: ${genero}`
      )
    );

    // Se genera un ID único para el usuario.
    const id = uuidv4();
    console.log(chalk.yellow(`ID generado: ${id}`));

    // Se obtiene la fecha y hora actual.
    const tiempo = moment().format(formato);
    console.log(chalk.yellow(`Timestamp generado: ${tiempo}`));

    // Se añade el usuario al array de usuarios.
    usuarios.push({ nombre, apellido, genero, id, tiempo });
    console.log(chalk.green("Usuario añadido al array"));
    console.log(
      chalk.blue.bgWhite(
        `Usuarios actuales: ${JSON.stringify(usuarios, null, 2)}`
      )
    );

    // Se usa lodash para dividir el array de usuarios en dos grupos: usuarios femeninos y masculinos.
    const [usuariosFemeninos, usuariosMasculinos] = _.partition(
      usuarios,
      (item) => item.genero === "female"
    );
    console.log(chalk.green("Usuarios divididos por género"));
    console.log(
      chalk.blue.bgWhite(
        `Usuarios femeninos: ${JSON.stringify(usuariosFemeninos, null, 2)}`
      )
    );
    console.log(
      chalk.blue.bgWhite(
        `Usuarios masculinos: ${JSON.stringify(usuariosMasculinos, null, 2)}`
      )
    );

    // Se crea una lista (html) de usuarios femeninos y masculinos.
    const listaFemeninos = usuariosFemeninos
      .map(
        (usuario) =>
          `<li>Nombre: ${usuario.nombre} - Apellido: ${usuario.apellido} - Id: ${usuario.id} - Timestamp: ${usuario.tiempo}</li>`
      )
      .join("");
    const listaMasculinos = usuariosMasculinos
      .map(
        (usuario) =>
          `<li>Nombre: ${usuario.nombre} - Apellido: ${usuario.apellido} - Id: ${usuario.id} - Timestamp: ${usuario.tiempo}</li>`
      )
      .join("");

    // Se crea el template con las listas de usuarios.
    const template = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Usuarios</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h4 {
            color: #333;
          }
          ol {
            padding-left: 20px;
          }
          li {
            margin-bottom: 10px;
          }
          .usuarios-container {
            display: flex;
            justify-content: space-between;
          }
          .usuarios-section {
            width: 45%;
          }
        </style>
      </head>
      <body>
        <h1>Lista de Usuarios Registrados</h1>
        <div class="usuarios-container">
          <div class="usuarios-section">
            <h4>Mujeres</h4>
            <ol>
              ${listaFemeninos}
            </ol>
          </div>
          <div class="usuarios-section">
            <h4>Hombres</h4>
            <ol>
              ${listaMasculinos}
            </ol>
          </div>
        </div>
      </body>
      </html>`;

    // Se imprime en la consola los datos del usuario, con fondo blanco y letras azules.
    console.log(
      chalk.blue.bgWhite(
        `Nombre: ${nombre} - Apellido: ${apellido} - Id: ${id} - Timestamp: ${tiempo} - Genero: ${genero}`
      )
    );

    // Se envía el template como respuesta.
    res.send(template);
  } catch (error) {
    // Si ocurre un error, se muestra en la consola y se envía un mensaje de error como respuesta.
    console.error(red(error));
    res.status(500).send("Hubo un error al obtener los datos");
  }
});
