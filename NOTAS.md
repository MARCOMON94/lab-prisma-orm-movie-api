1. ¿Qué ventajas concretas ofrece Prisma frente a escribir SQL en crudo en este proyecto?

Prisma hace que las consultas sean más fáciles de leer y mantener, porque en vez de escribir SQL directamente con pool.query, usamos métodos como findMany, findUnique, create, update o delete.

Otra ventaja es que Prisma entiende las relaciones entre tablas. Por eso podemos pedir una película con su director, género, reseñas y conteos usando include, sin tener que escribir los JOIN manualmente.

También ayuda con las migraciones, porque los cambios en la base de datos quedan reflejados en schema.prisma y se aplican con comandos de Prisma.


2. ¿Qué hace prisma.$transaction([query1, query2])? ¿En qué se diferencia de prisma.$transaction(async (tx) => { ... })?

prisma.$transaction([query1, query2]) ejecuta varias consultas juntas dentro de una misma transacción. Si una falla, se cancela todo.

En este proyecto se usa para listar películas y contar el total a la vez, de forma que ambas consultas se hacen sobre el mismo estado de la base de datos.

La diferencia es que prisma.$transaction([query1, query2]) sirve bien cuando ya tienes varias consultas independientes.

En cambio, prisma.$transaction(async (tx) => { ... }) permite hacer una secuencia de pasos donde una consulta depende de la anterior. Por ejemplo, en este lab se usa al crear una película: primero se busca o crea el director con upsert y luego se crea la película usando ese director.

3. ¿Qué archivo NO deberías commitear nunca al repositorio de tu schema de Prisma? ¿Y cuáles sí deben estar en el repositorio?

No se debe commitear el archivo .env, porque contiene datos privados como la URL de conexión a la base de datos, usuario, contraseña o secretos JWT. Como siempre.

4. Observaciones del desarrollo

Durante el lab hubo que adaptar algunas cosas porque la versión instalada fue Prisma 7.8.0. En esta versión la URL de conexión ya no va dentro de schema.prisma, sino en prisma.config.ts.

También fue necesario instalar @prisma/adapter-pg para que Prisma Client pudiera conectarse correctamente a PostgreSQL.

Además, se creó una base nueva llamada peliculas_prisma_db para evitar problemas con la base anterior peliculas_db, que ya tenía tablas e índices creados de otros labs. Así se pudo aplicar la migración inicial sin borrar datos anteriores.

El repo también tenía partes heredadas del lab anterior que seguían usando ../config/db y pool.query. Por eso se migraron también authController, favoritosController y verificarPelicula a Prisma, y se quitó o ajustó la parte de estadísticas que dependía del controlador antiguo.
