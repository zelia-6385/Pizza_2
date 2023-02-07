import { useEffect, useState, FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface IPizza {
  imageUrl: string;
  title: string;
  price: number;
}

const FullPizza: FC = () => {
  const [pizza, setPizza] = useState<IPizza | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          `https://62e146c3fa99731d75d2f762.mockapi.io/items/${id}`
        );
        setPizza(data);
      } catch (error) {
        alert("Ошибка при получении пиццы");
        navigate("/");
      }
    }

    fetchPizza();
  }, []);

  if (!pizza) {
    return <div className="container">Загрузка...</div>;
  }

  return (
    <div className="container">
      <img src={pizza.imageUrl} alt="" />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} ₽</h4>
    </div>
  );
};

export default FullPizza;
