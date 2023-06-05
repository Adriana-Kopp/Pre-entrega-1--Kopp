import { addDoc, collection, getFirestore } from "firebase/firestore";
import Button from "react-bootstrap/esm/Button";
import { useCartContext } from "../../context/CartContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export const CartContainer = () => {
  const [id, setId] = useState("");
  const [dataForm, setDataForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const { cartList, emptyCart, totalPrice, deletProducts } = useCartContext();

  const generateOrder = (evt) => {
    evt.preventDefault();

    const order = {};
    order.buyer = dataForm;
    order.items = cartList.map(({ name, id, price, cantidad }) => ({
      id,
      name,
      price,
      cantidad,
    }));
    order.total = totalPrice();

    const dbFirestore = getFirestore();
    const ordersCollection = collection(dbFirestore, "orders");

    addDoc(ordersCollection, order)
      .then((resp) => console.log(resp.id))
      .catch((err) => console.log(err))
      .finally(() => {
        setDataForm({
          name: "",
          phone: "",
          email: "",
        });
        setTimeout(() => {
          emptyCart();
          setId("");
        }, 5000);
      });
  };

  const handleOnChange = (evt) => {
    console.log("nombre del input", evt.target.name);
    console.log("valor del input", evt.target.value);
    setDataForm({
      ...dataForm,
      [evt.target.name]: evt.target.value,
    });
  };

  return (
    <div>
      {id.length != 0 && (
        <h6>El número de ID de la orden de la compra es: {id}</h6>
      )}
      {cartList.length != 0 ? (
        <>
          {cartList.map((prod) => (
            <div>
              <img src={prod.img} alt="" />
              <label>
                Precio: ${prod.price}
                Cantidad: {prod.cantidad}
              </label>
              <Button onClick={() => deletProducts(prod.id)}> X </Button>
            </div>
          ))}

          <h3>Total de la compra: ${totalPrice()}</h3>

          <Button onClick={emptyCart} className="btn btn-danger">
            Limpiar carrito
          </Button>

          <form onSubmit={generateOrder}>
            <input
              type="text"
              name="name"
              onChange={handleOnChange}
              value={dataForm.name}
              placeholder="Ingrese su nombre"
            />
            <input
              type="text"
              name="phone"
              onChange={handleOnChange}
              value={dataForm.phone}
              placeholder="Ingrese su numero de teléfono"
            />
            <input
              type="text"
              name="email"
              onChange={handleOnChange}
              value={dataForm.email}
              placeholder="Ingrese su correo electrónico"
            />

            <button className="btn btn-outline-danger">Generar orden</button>
          </form>
        </>
      ) : (
        <div>
          <h4> No hay productos en el carrito </h4>
          <Link to="/">Seguir comprando </Link>
        </div>
      )}
    </div>
  );
};

//tengo que agregar un Imput mas para validad el mail
