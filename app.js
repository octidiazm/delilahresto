const express = require('express');
const compression = require('compression');
const app = express();
const sequelize = require('./conexionBase');
const jwt = require('jsonwebtoken');
const signature = 'de1i14'
app.use(express.json());
app.use(compression());


// ---------------------------ESTA ES LA FUNCION DONDE PODEMOS GENERAR EL TOKEN AL USUARIO


function getToken(data){
    const resp = jwt.sign(data, signature);
    return resp;
}

// ---------------------------ESTA FUNCION ES LA QUE DETERMINA SI UN USUARIO ES ADMIN O NO


function isAdmin(req,res,next){
    const token = req.headers['access_token']
    const usuario = "admin"
    const password = "1234" 
    console.log(usuario +' '+password); 
    const decoded = jwt.verify(token, signature);
    console.log(decoded);
    if(decoded.usuario == usuario && decoded.password == password){
        return next();
    }else{
        res.status(403).json({
            auth:false,
            message: 'no tienes permisos para esta accion'
        })
    }
}

//----------------------------------ESTA FUNCION DETERMINA SI UN TOKEN INGRESADO ES VALIDO O NO


function validartoken(req,res,next){
    try {
        const token = req.headers.access_token;
        console.log(token);
        const validData = jwt.verify(token, signature);
        console.log(validData);
        if (validData) {
          req.userData = validData.userData;
          next();
        }
      } catch (err) {
        res.status(401).json("Error al validar usuario. Prueba un token válido.");
      }
}

//-----------------------------ACA VAMOS A ENCONTRAR LAS APIS Y LAS FUNCIONES DE USUARIOS


function validarNuevoContacto(req, res, next) {
    const {
        usuario,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        password
    } = req.body;
    if (!usuario ||!nombre|| !apellido || !email || !telefono || !direccion || !password) {
        return res.status(400)
            .send({
                status: 'Error',
                mensaje: 'Dato de del contacto invalido'
            });
    }
    return next();
}

async function traerUsuarios() {
    const res = await sequelize.query('SELECT * FROM usuarios', {
        type: sequelize.QueryTypes.SELECT
    })
    return res;
}

async function validarSiExiste(req, res, next){
    const usuarios = await traerUsuarios();
    const {email} = req.body;

    const i = usuarios.findIndex(c => {
        return c.email == email; ``
    })
    

    if (i >= 0) {
        return res.status(409)
            .send({
                status: 'Error',
                mensaje: 'el contacto ya existe'
            });
    }
    return next();
}

async function validarLogin(req, res, next) {
    const usuarios = await traerUsuarios();
    const {usuario, password} = req.body;

    const i = usuarios.findIndex(c => {
        return c.usuario == usuario; 
    })
    if( i > -1){
        const e = usuarios[i];
        if(e.password == password){
            next();
        }
        else{
            return res.status(409)
            .send({
                status: 'Error',
                mensaje: 'el contacto no existe o los datos son incorrectos'
            });
        }
    }
    
    if (i == -1) {
        return res.status(409)
            .send({
                status: 'Error',
                mensaje: 'el contacto no existe'
            });
    }
    return next();
}



app.post('/registro', validarNuevoContacto, validarSiExiste, (req, res) => {
    let usuario = Object.values(req.body);
    usuario.unshift('NULL');
    sequelize.query('INSERT INTO usuarios VALUES (?,?,?,?,?,?,?,?)', {
        replacements: usuario
    }).then(respuesta => {
        console.log(respuesta);
    })
    res.status(201).json({
        status: "OK",
        mensaje: "Contacto Agregado"
    })
});

app.post('/login',validarLogin, (req,res)=>{
    const usuario = req.body;
    console.log(usuario);
    res.status(200).json({
        status:"Ok",
        mensaje: 'Sesion iniciada',
        token: getToken(usuario)
    })
    
})

app.get('/usuarios',validartoken, isAdmin, (req,res) =>{
    sequelize
    .query("SELECT * FROM usuarios", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(results => {
        res.status(200).json(results)
    });
})

app.get("/usuario/:id", validartoken, isAdmin,(req,res) =>{
    let id = req.params.id;
    sequelize.query (
        "SELECT * FROM  `usuarios` WHERE `id` = ?",{
            replacements : [id],
            type: sequelize.QueryTypes.SELECT
        }
    ).then((resultado)=>{
        if(resultado[0]){
            res.status(200).json(resultado[0]);
        }else{
            res.status(404).json({
                status:'fallido',
                mensaje:'no se pudo encontrar el usuario'
            })   
                 
        }
    })
})




//---------------------- EN ESTA SECCION SE VA A ENCONTRAR TODAS LAS FUNCIONES DE PRODUCTOS


function setProducts(req,res,next){
    const {name,foto,descripcion,precio} = req.body;
    sequelize.query(
        "INSERT INTO productos (item,rutaFoto,descripcion,precio) VALUES (?,?,?,?)",
        {
            replacements:[name,foto,descripcion,precio],
            type: sequelize.QueryTypes.INSERT
        }
    )
    .then(()=>{
        next();
    });
}

async function traidaProducto(a){
    const res = await sequelize.query('SELECT * FROM productos WHERE productos.id = ?',{replacements:[a],type: sequelize.QueryTypes.SELECT});
    return res;
}

async function traidaPedido(a){
    const res = await sequelize.query('SELECT * FROM orders WHERE orders.id = ?',{replacements:[a],type: sequelize.QueryTypes.SELECT});
    return res;
}

app.delete('/productos/:id', validartoken, isAdmin, async function i(req,res){
    const id = req.params.id;
    const verificacion = await traidaProducto(id);
    if(verificacion.length > 0){
        sequelize.query('DELETE FROM `productos` WHERE `id` = ?',
        {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE
        })
        .then(()=>{
            res.status(200).json({
                "mensaje":"producto eliminado con exito"
            })
        })
        .catch(()=>{
            res.status(400).json({
                "mensaje": "ha ocurrido un error con la peticion"
            })
        })
    }else{
        res.status(404).json({
            'mensaje':"Producto no encontrado en la base de datos"
        })
    }
})

app.put('/productos/:id', validartoken, isAdmin, async function e(req, res){
    const a = req.params.id;
    const producto = await traidaProducto(a);
    const {name,foto,descripcion,precio} = req.body;
    if(producto[0]){
        sequelize.query("UPDATE `productos` SET `item` = ?, `rutaFoto` = ?, `descripcion` = ?, `precio` = ? WHERE `productos`.`id` = ?",
            {
                replacements:[
                    name,
                    foto,
                    descripcion,
                    precio,
                    req.params.id
                ],
                type: sequelize.QueryTypes.UPDATE
            }
        )
        .then(()=>{
            res.status(200).json({
                "status" : "ok",
                "mensaje": "el producto ha sido modificado con exito"
            })
        })
    }else{
        res.status(400).json({
            "mensaje":"No existe un producto con ese id"
        });
    }
});

app.get("/productos", validartoken, (req, res) => {
    sequelize
      .query("SELECT * FROM productos", {
        type: sequelize.QueryTypes.SELECT
      })
      .then(results => {
        res.json(results);
      });
});

app.post('/productos',isAdmin, setProducts,(req,res)=>{
    res.status(201).json({
        status:'Ok',
        message:'Producto insertado en la base de datos'
    })
})


//-----------------------------EN ESTA SECCION SE ENCONTRARA TODO LO RELACIONADO A PEDIDOS 


app.delete('/pedido/:id', validartoken, isAdmin, async function o(req,res){
    const id = req.params.id;
    const verificacion = await traidaPedido(id);
    if(verificacion.length > 0 ){
        sequelize.query('DELETE FROM `orders` WHERE `id` = ?',
        {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE
        })
        sequelize.query('DELETE FROM `ordenes_producto` WHERE `id_pedido` = ?',
        {
            replacements: [id],
            type: sequelize.QueryTypes.DELETE
        })
        .then(()=>{
            res.status(200).json({
                "mensaje":"pedido eliminado con exito"
            })
        })
        .catch(()=>{
            res.status(400).json({
                "mensaje": "ha ocurrido un error con la peticion"
            })
        })
    }else{
        res.status(404).json({
            'mensaje':"pedido no encontrado en la base de datos"
        })
    }     
    
})

app.post('/pedido', validartoken, async function a(req,res){
    const {id_usuario, id_productos} =req.body
    await sequelize.query('INSERT INTO orders(id_usuario, id_estados) VALUES (?, 1 )',
    {
        replacements:[id_usuario],
        type: sequelize.QueryTypes.INSERT
    })
    const pedidos  = await sequelize.query('SELECT * FROM orders',{type: sequelize.QueryTypes.SELECT});
    console.log(pedidos[pedidos.length-1],'hola soy numPedido');
    let idUltimoPedido = pedidos[pedidos.length-1.].id;
    console.log(id_productos);
    for(i=0; i<id_productos.length; i++){
        sequelize.query('INSERT INTO ordenes_producto(id_pedido, id_producto) VALUE (?,?)',
            {
                replacements: [idUltimoPedido, id_productos[i]],
                type: sequelize.QueryTypes.INSERT
            }   
        )
    }
    res.status(201).json({
        "status" : "ok",
        "mensaje" : 'pedido creado con exito'
    })
})

app.put('/pedido/:id', validartoken,isAdmin, async function a(req,res){
    const id_pedido = req.params.id
    const {id_new_productos} =req.body
    await sequelize.query('DELETE FROM `ordenes_producto` WHERE `id_pedido` = ?',
    {
        replacements:[id_pedido],
        type: sequelize.QueryTypes.DELETE
    })
    for(i=0; i<id_new_productos.length; i++){
        sequelize.query('INSERT INTO ordenes_producto(id_pedido, id_producto) VALUE (?,?)',
            {
                replacements: [id_pedido, id_new_productos[i]],
                type: sequelize.QueryTypes.INSERT
            }   
        )
    }
    res.status(200).json({
        "mensaje" : 'productos del id actualizados con exito'
    })
})

app.put('/pedido/estado/:id', validartoken, isAdmin, async function i(req,res){
    const id_pedido = req.params.id;
    const pedido = await traidaPedido(id_pedido);
    const {id_nuevo_estado} = req.body;
    if(pedido[0]){
        sequelize.query("UPDATE `orders` SET `id_estados` = ? WHERE `orders`.`id` = ?",{
            replacements:[
                id_nuevo_estado,
                id_pedido
                ],
                type: sequelize.QueryTypes.UPDATE
        }).then(()=>{
            res.status(200).json({
                "mensaje": "el estado del pedido se ha modificado con exito"
            })
        })
    }else{
        res.status(400).json({
            "mensaje":"No existe un pedido con ese id"
        })
    }
    
})


app.listen(4000, function () {
    console.log('El server corre en el puerto 4000')
});