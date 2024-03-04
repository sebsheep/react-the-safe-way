import { Item } from "./Item";

export function ItemList(props: { items: Array<Item> }): JSX.Element {
  return (
    <ul>
      {props.items.map((item) => (
        <li>
          {" "}
          <Item item={item} key={item.id} />
        </li>
      ))}
    </ul>
  );
}
