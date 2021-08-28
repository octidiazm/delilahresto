-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-08-2021 a las 22:14:48
-- Versión del servidor: 10.4.20-MariaDB
-- Versión de PHP: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilah_resto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_producto`
--

CREATE TABLE `ordenes_producto` (
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_estados` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `item` varchar(60) NOT NULL,
  `rutaFoto` varchar(255) DEFAULT 'https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png ',
  `descripcion` text NOT NULL,
  `precio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `item`, `rutaFoto`, `descripcion`, `precio`) VALUES
(1, 'Hamburguesa La Burgesa', 'https://images.clarin.com/2021/06/17/LC25eDtCT_1200x630__1.jpg', 'Hamburguesa completa con lechuga, tomate, mayonesa , cebolla ,huevo y papas fritas', 500),
(2, 'RapaPizza', 'https://b.zmtcdn.com/data/pictures/3/17305713/0d6230db62d13baacc1b5d16483b43d8.jpg?fit=around|771.75:416.25&crop=771.75:416.25;*,*', 'Pizza de muzzarella y pepperoni ,8 porciones', 630),
(3, 'Tacos', 'https://www.hola.com/imagenes/cocina/recetas/20200720172343/tacos-rapidos-chili-picante-salchichas-aguacate/0-848-631/tacos-rapidos-chile-queso-aguacate-m.jpg', 'los mejores tacos mexicanos de la ciudad', 480),
(4, 'Shawarma', 'https://www.recetas-judias.com/base/stock/Post/23-image/23-image_web.jpg', 'Shawarma completo con papas', 500),
(5, 'Lomito', 'https://images.lavoz.com.ar/resizer/N5MuF4VKUUK-lxUmvPBnPsBB9O8=/1023x682/smart/cloudfront-us-east-1.images.arcpublishing.com/grupoclarin/4J3UJNMRD5DCXODMPUHI3BS3TE.jpg', 'Lomito completo con lechuga ,tomate ,jamon queso, mayonesa y papas', 630),
(6, 'Sanguche de Milanesa', 'https://www.elancasti.com.ar/u/fotografias/m/2018/3/18/f800x450-131298_182744_5050.jpg', 'Sanguche completo con lechuga , tomate , huevo y mayonesa', 200);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `telefono` bigint(15) NOT NULL,
  `direccion` varchar(40) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
