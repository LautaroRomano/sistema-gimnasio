# Realiza la implementación en Firebase Hosting
Puedes realizar la implementación ahora o más adelante. Para hacerlo ahora mismo, abre una ventana de la terminal y, luego, navega al directorio raíz de tu app web o crea uno.

Acceder a Google

```bash
firebase login
```

Inicia el proyecto
Ejecuta el siguiente comando en el directorio raíz de tu app:

```bash
firebase init
```

Especifica tu sitio en firebase.json
Agrega el ID de tu sitio al archivo de configuración firebase.json. Después de realizar la configuración, consulta las prácticas recomendadas para implementar varios sitios.

```bash
{
  "hosting": {
    "site": "chinoalmiron",

    "public": "public",
    ...
  }
}
```

Cuando tengas todo listo, implementa tu app web
Ubica los archivos estáticos (p. ej., HTML, CSS y JS) en el directorio de implementación de la app (el directorio predeterminado es “public”). Luego, ejecuta este comando desde el directorio raíz de tu app:

```bash
firebase deploy --only hosting:chinoalmiron
```

Después de la implementación, consulta tu app en chinoalmiron.web.app.

¿Necesitas ayuda? Consulta los documentos de Hosting.
