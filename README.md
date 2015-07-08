# Gestion tgd

Realizado con el scaffolding meanjs y FULLSTACK en el que se realiza la gestion de archivos del tacógrafo para su interpretacion y grabado en base de datos:

BASE DE DATOS  	       	API REST                FRONTEND
                ------>   nodejs      ------->
Mongodb                     +                   angularjs   
                ------>   express     ------->
							
Dicha aplicacion se comunica con el servicio que esta ha la escucha:

http://server.valdepeace.com:8080/ServiceCardFile/filecard

y nos devolverá el archivo binario en json con el que podremos trabajar tanto para la visualizacion del contenido como
para el grabado en base de datos.
