import { FC, memo } from "react";

type CategoriesProps = {
  value: number;
  onChangeCategory: (idx: number) => void;
};

export const Categories: FC<CategoriesProps> = memo(
  ({ value, onChangeCategory }) => {
    const categories = [
      "Все",
      "Мясные",
      "Вегетарианские",
      "Гриль",
      "Острые",
      "Закрытые",
    ];

    return (
      <div className="categories">
        <ul>
          {categories.map((category, idx) => (
            <li
              key={idx}
              onClick={() => onChangeCategory(idx)}
              className={value === idx ? "active" : ""}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
