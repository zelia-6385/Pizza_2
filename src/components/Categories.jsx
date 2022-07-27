import { useState } from 'react';

function Categories() {
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = ['Все', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые'];

  return (
    <div className="categories">
      <ul>
        {categories.map((category, idx) => (
          <li
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={activeIndex === idx ? 'active' : ''}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
